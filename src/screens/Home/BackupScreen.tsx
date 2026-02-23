import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Download, Upload, Database, ShieldCheck } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppButton } from '../../components/ui/Button';
import { AppCard } from '../../components/ui/Card';
import { Spacing } from '../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';
import { DatabaseBackupService } from '../../services/DatabaseBackupService';

export const BackupScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const result = await DatabaseBackupService.exportBackup();
            Alert.alert(
                result.success ? 'Sucesso' : 'Erro',
                result.message
            );
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro inesperado ao exportar.');
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async () => {
        Alert.alert(
            'Restaurar Backup',
            'Atenção: todos os dados atuais serão substituídos pelos dados do backup selecionado. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sim, restaurar',
                    style: 'destructive',
                    onPress: async () => {
                        setImporting(true);
                        try {
                            const result = await DatabaseBackupService.importBackup();
                            Alert.alert(
                                result.success ? 'Sucesso' : 'Erro',
                                result.message
                            );
                        } catch (error) {
                            Alert.alert('Erro', 'Ocorreu um erro inesperado ao restaurar.');
                        } finally {
                            setImporting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <AppText variant="h1">Backup & Restauração</AppText>
            </View>

            <View style={styles.content}>
                {/* Info Card */}
                <AppCard padding="lg" style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <ShieldCheck size={24} color={theme.success} />
                        <View style={styles.infoText}>
                            <AppText variant="h3">Proteja seus dados</AppText>
                            <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: 4 }}>
                                Exporte um backup em JSON para salvar no Google Drive, enviar por WhatsApp ou guardar onde preferir.
                            </AppText>
                        </View>
                    </View>
                </AppCard>

                {/* Export Section */}
                <AppCard padding="lg" style={styles.actionCard}>
                    <View style={styles.actionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                            <Upload size={24} color={theme.primary} />
                        </View>
                        <View style={styles.actionText}>
                            <AppText variant="h3">Fazer Backup</AppText>
                            <AppText variant="caption" color={theme.textSecondary}>
                                Exporta todos os dados do app em um arquivo JSON.
                            </AppText>
                        </View>
                    </View>
                    <AppButton
                        title={exporting ? 'Exportando...' : 'Exportar Backup'}
                        variant="primary"
                        onPress={handleExport}
                        loading={exporting}
                        disabled={exporting || importing}
                        style={{ marginTop: Spacing.md }}
                    />
                </AppCard>

                {/* Import Section */}
                <AppCard padding="lg" style={styles.actionCard}>
                    <View style={styles.actionHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.danger + '20' }]}>
                            <Download size={24} color={theme.danger} />
                        </View>
                        <View style={styles.actionText}>
                            <AppText variant="h3">Restaurar Backup</AppText>
                            <AppText variant="caption" color={theme.textSecondary}>
                                Selecione um arquivo JSON de backup para restaurar seus dados.
                            </AppText>
                        </View>
                    </View>
                    <AppButton
                        title={importing ? 'Restaurando...' : 'Restaurar Backup'}
                        variant="outline"
                        onPress={handleImport}
                        loading={importing}
                        disabled={exporting || importing}
                        style={{ marginTop: Spacing.md }}
                    />
                </AppCard>

                {/* Warning */}
                <View style={[styles.warningBox, { backgroundColor: theme.warning + '15', borderColor: theme.warning + '40' }]}>
                    <Database size={16} color={theme.warning} />
                    <AppText variant="caption" color={theme.textSecondary} style={{ flex: 1, marginLeft: 8 }}>
                        A restauração substituirá todos os dados atuais. Faça um backup antes de restaurar.
                    </AppText>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: Spacing.lg,
        paddingBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backBtn: {
        padding: 4,
        marginLeft: -4,
    },
    content: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    infoCard: {
        marginBottom: Spacing.xs,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoText: {
        flex: 1,
    },
    actionCard: {},
    actionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    actionText: {
        flex: 1,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: 10,
        borderWidth: 1,
    },
});
