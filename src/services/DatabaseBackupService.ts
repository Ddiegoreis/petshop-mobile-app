import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { openDatabaseSync } from 'expo-sqlite';
import { DATABASE_NAME } from '../storage/database/connection';
import { format } from 'date-fns';

const SYSTEM_TABLES = ['sqlite_sequence', '__drizzle_migrations', 'sqlite_stat1', 'sqlite_stat4'];

type BackupResult = {
    success: boolean;
    message: string;
};

type BackupData = Record<string, Record<string, unknown>[]>;

/**
 * Service responsible for exporting and importing the SQLite database as JSON.
 * Separates data logic from UI — returns results that the screen can display via Alert.
 */
export const DatabaseBackupService = {

    /**
     * Export: Reads all user tables, builds a JSON object, saves to a temp file,
     * and opens the native share sheet so the user can save to Drive, WhatsApp, etc.
     */
    async exportBackup(): Promise<BackupResult> {
        const db = openDatabaseSync(DATABASE_NAME);

        try {
            // 1. Discover all user tables
            const tablesResult = db.getAllSync<{ name: string }>(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
            );

            const tableNames = tablesResult
                .map(row => row.name)
                .filter(name => !SYSTEM_TABLES.includes(name));

            if (tableNames.length === 0) {
                return { success: false, message: 'Nenhuma tabela encontrada para exportar.' };
            }

            // 2. Extract all rows from each table
            const backup: BackupData = {};

            for (const table of tableNames) {
                const rows = db.getAllSync<Record<string, unknown>>(`SELECT * FROM "${table}"`);
                backup[table] = rows;
            }

            // 3. Save JSON to a temporary file using the new expo-file-system API
            const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
            const fileName = `petshop_backup_${timestamp}.json`;
            const file = new File(Paths.cache, fileName);

            file.write(JSON.stringify(backup, null, 2));

            // 4. Share the file via native share sheet
            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) {
                return { success: false, message: 'Compartilhamento não disponível neste dispositivo.' };
            }

            await Sharing.shareAsync(file.uri, {
                mimeType: 'application/json',
                dialogTitle: 'Salvar Backup do Petshop',
                UTI: 'public.json',
            });

            // 5. Clean up temp file
            try {
                file.delete();
            } catch {
                // Non-critical — ignore cleanup errors
            }

            return { success: true, message: 'Backup exportado com sucesso!' };

        } catch (error) {
            console.error('Export backup error:', error);
            return {
                success: false,
                message: `Erro ao exportar backup: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    },

    /**
     * Import: Opens a document picker for JSON files, reads the content,
     * validates the structure, and restores data inside a transaction.
     */
    async importBackup(): Promise<BackupResult> {
        const db = openDatabaseSync(DATABASE_NAME);

        try {
            // 1. Pick a JSON file
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return { success: false, message: 'Nenhum arquivo selecionado.' };
            }

            const fileUri = result.assets[0].uri;

            // 2. Read and parse JSON using the new expo-file-system API
            const pickedFile = new File(fileUri);
            const jsonString = await pickedFile.text();

            let backupData: BackupData;
            try {
                backupData = JSON.parse(jsonString);
            } catch {
                return { success: false, message: 'Arquivo JSON inválido. Verifique o formato do backup.' };
            }

            // 3. Validate backup structure
            if (typeof backupData !== 'object' || backupData === null || Array.isArray(backupData)) {
                return { success: false, message: 'Estrutura do backup inválida. Esperado um objeto com tabelas.' };
            }

            // 4. Get existing tables to validate against
            const existingTables = db.getAllSync<{ name: string }>(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
            ).map(row => row.name).filter(name => !SYSTEM_TABLES.includes(name));

            const tablesToRestore = Object.keys(backupData).filter(table =>
                existingTables.includes(table)
            );

            if (tablesToRestore.length === 0) {
                return {
                    success: false,
                    message: 'Nenhuma tabela compatível encontrada no arquivo de backup.',
                };
            }

            // 5. Restore data inside a transaction
            // Order matters: delete children first (appointments, pets, payments), then parents (owners)
            const deleteOrder = ['appointments', 'payments', 'pets', 'owners'].filter(t =>
                tablesToRestore.includes(t)
            );
            // Add any remaining tables not in our known order
            const remainingTables = tablesToRestore.filter(t => !deleteOrder.includes(t));
            const orderedDelete = [...deleteOrder, ...remainingTables];

            // Insert order is the reverse (parents first)
            const insertOrder = [...orderedDelete].reverse();

            db.withTransactionSync(() => {
                // Temporarily disable foreign key checks for clean restore
                db.runSync('PRAGMA foreign_keys = OFF');

                // Delete existing data
                for (const table of orderedDelete) {
                    db.runSync(`DELETE FROM "${table}"`);
                }

                // Insert backup data
                for (const table of insertOrder) {
                    const rows = backupData[table];
                    if (!Array.isArray(rows) || rows.length === 0) continue;

                    const columns = Object.keys(rows[0]);
                    const placeholders = columns.map(() => '?').join(', ');
                    const columnNames = columns.map(c => `"${c}"`).join(', ');
                    const sql = `INSERT INTO "${table}" (${columnNames}) VALUES (${placeholders})`;

                    for (const row of rows) {
                        const values = columns.map(col => {
                            const val = row[col];
                            return val === undefined ? null : val;
                        });
                        db.runSync(sql, values as any[]);
                    }
                }

                // Re-enable foreign key checks
                db.runSync('PRAGMA foreign_keys = ON');
            });

            return {
                success: true,
                message: `Backup restaurado com sucesso! ${tablesToRestore.length} tabela(s) restaurada(s).`,
            };

        } catch (error) {
            console.error('Import backup error:', error);
            return {
                success: false,
                message: `Erro ao restaurar backup: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    },
};
