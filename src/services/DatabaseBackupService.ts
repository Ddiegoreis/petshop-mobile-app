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

function getUserTableNames(): string[] {
    const db = openDatabaseSync(DATABASE_NAME);
    const tables = db.getAllSync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    return tables.map(row => row.name).filter(name => !SYSTEM_TABLES.includes(name));
}

function extractAllData(tableNames: string[]): BackupData {
    const db = openDatabaseSync(DATABASE_NAME);
    const data: BackupData = {};
    for (const table of tableNames) {
        data[table] = db.getAllSync<Record<string, unknown>>(`SELECT * FROM "${table}"`);
    }
    return data;
}

function restoreData(backupData: BackupData, tables: string[]): void {
    const db = openDatabaseSync(DATABASE_NAME);

    const deleteOrder = ['appointments', 'payments', 'pets', 'owners'].filter(t => tables.includes(t));
    const remaining = tables.filter(t => !deleteOrder.includes(t));
    const orderedDelete = [...deleteOrder, ...remaining];
    const insertOrder = [...orderedDelete].reverse();

    db.withTransactionSync(() => {
        db.runSync('PRAGMA foreign_keys = OFF');

        for (const table of orderedDelete) {
            db.runSync(`DELETE FROM "${table}"`);
        }

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

        db.runSync('PRAGMA foreign_keys = ON');
    });
}

function saveJsonToCache(data: BackupData): File {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const fileName = `petshop_backup_${timestamp}.json`;
    const file = new File(Paths.cache, fileName);
    file.write(JSON.stringify(data, null, 2));
    return file;
}

async function shareFile(file: File): Promise<void> {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
        throw new Error('Compartilhamento não disponível neste dispositivo.');
    }
    await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Salvar Backup do Petshop',
        UTI: 'public.json',
    });
}

function cleanupFile(file: File): void {
    try {
        file.delete();
    } catch {
        console.error('Erro ao limpar arquivo');
    }
}

async function pickJsonFile(): Promise<string | null> {
    const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
    }
    return result.assets[0].uri;
}

async function readJsonFile(uri: string): Promise<BackupData> {
    const file = new File(uri);
    const raw = await file.text();
    const sanitized = raw.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(sanitized);
}

function validateBackupStructure(data: unknown): data is BackupData {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
}

function getCompatibleTables(backupData: BackupData): string[] {
    const existing = getUserTableNames();
    return Object.keys(backupData).filter(table => existing.includes(table));
}

export const DatabaseBackupService = {
    async exportBackup(): Promise<BackupResult> {
        try {
            const tableNames = getUserTableNames();
            if (tableNames.length === 0) {
                return { success: false, message: 'Nenhuma tabela encontrada para exportar.' };
            }

            const backupData = extractAllData(tableNames);
            const file = saveJsonToCache(backupData);

            await shareFile(file);
            cleanupFile(file);

            return { success: true, message: 'Backup exportado com sucesso!' };
        } catch (error) {
            console.error('Export backup error:', error);
            return {
                success: false,
                message: `Erro ao exportar: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    },

    async importBackup(): Promise<BackupResult> {
        try {
            const fileUri = await pickJsonFile();
            if (!fileUri) {
                return { success: false, message: 'Nenhum arquivo selecionado.' };
            }

            let backupData: BackupData;
            try {
                backupData = await readJsonFile(fileUri);
            } catch (e) {
                const detail = e instanceof Error ? e.message : '';
                return { success: false, message: `Arquivo JSON inválido: ${detail}` };
            }

            if (!validateBackupStructure(backupData)) {
                return { success: false, message: 'Estrutura do backup inválida. Esperado um objeto com tabelas.' };
            }

            const compatibleTables = getCompatibleTables(backupData);
            if (compatibleTables.length === 0) {
                return { success: false, message: 'Nenhuma tabela compatível encontrada no arquivo de backup.' };
            }

            restoreData(backupData, compatibleTables);

            return {
                success: true,
                message: `Backup restaurado com sucesso! ${compatibleTables.length} tabela(s) restaurada(s).`,
            };
        } catch (error) {
            console.error('Import backup error:', error);
            return {
                success: false,
                message: `Erro ao restaurar: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    },
};
