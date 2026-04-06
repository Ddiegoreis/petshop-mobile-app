import React, { useCallback, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowDownRight, Check, ChevronLeft, ChevronRight, Crown, Eye, EyeOff, Plus, Receipt, RotateCcw } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { AppButton } from '../../components/ui/Button';
import { AppInput } from '../../components/ui/Input';
import { Spacing } from '../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';
import { FinanceService } from '../../services/FinanceService';
import { ownerDao } from '../../storage/daos/ownerDao';
import { type Owner } from '../../storage/schema';
import { type PaymentWithOwner } from '../../storage/daos/paymentDao';
import { type ExpenseStatus } from '../../storage/daos/expenseDao';
import { type FinanceEntry } from '../../services/FinanceService';

type ModalState = {
    open: boolean;
    mode: 'service' | 'expense';
    ownerId?: number;
    description: string;
    amount: string;
    expenseStatus: ExpenseStatus;
};

const initialModalState: ModalState = {
    open: false,
    mode: 'service',
    description: '',
    amount: '',
    expenseStatus: 'pending',
};

export const FinanceScreen = () => {
    const { theme } = useTheme();
    const [referenceMonth, setReferenceMonth] = useState(FinanceService.getCurrentReferenceMonth());
    const [entries, setEntries] = useState<FinanceEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [summary, setSummary] = useState({ revenue: 0, expenses: 0, balance: 0, paid: 0, open: 0, cancelled: 0 });
    const [modal, setModal] = useState<ModalState>(initialModalState);
    const [hideValues, setHideValues] = useState(false);

    const monthLabel = useMemo(
        () => FinanceService.formatReferenceMonthLabel(referenceMonth),
        [referenceMonth]
    );
    const isCurrentMonth = referenceMonth === FinanceService.getCurrentReferenceMonth();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [ownersData, financeData] = await Promise.all([
                ownerDao.getAll(),
                FinanceService.getMonthlyFinance(referenceMonth),
            ]);
            setOwners(ownersData);
            setEntries(financeData.entries);
            setSummary(financeData.summary);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível carregar as finanças.';
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    }, [referenceMonth]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const goPrevMonth = () => {
        setReferenceMonth((current) => FinanceService.getPreviousReferenceMonth(current));
    };

    const goNextMonth = () => {
        setReferenceMonth((current) => FinanceService.getNextReferenceMonth(current));
    };

    const goCurrentMonth = () => {
        setReferenceMonth(FinanceService.getCurrentReferenceMonth());
    };

    const handleMarkAsPaid = async (paymentId: number) => {
        try {
            await FinanceService.markPaymentAsPaid(paymentId);
            await loadData();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível marcar este pagamento como pago.');
        }
    };

    const handleMarkAsOpen = async (paymentId: number) => {
        try {
            await FinanceService.markPaymentAsOpen(paymentId);
            await loadData();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível reabrir este pagamento.');
        }
    };

    const handleGenerateReceipt = async (payment: PaymentWithOwner) => {
        try {
            await FinanceService.generateAndShareReceipt(payment);
            await loadData();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível gerar o recibo.';
            Alert.alert('Erro', message);
        }
    };

    const confirmReopenPayment = (payment: PaymentWithOwner) => {
        if (!payment.receiptIssuedAt) {
            handleMarkAsOpen(payment.id);
            return;
        }

        Alert.alert(
            'Confirmar desfazer pagamento',
            'Este serviço já teve um recibo emitido. Deseja realmente desfazer o pagamento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Desfazer',
                    style: 'destructive',
                    onPress: () => handleMarkAsOpen(payment.id),
                },
            ]
        );
    };

    const handleOpenServiceModal = () => {
        setModal({ ...initialModalState, open: true, mode: 'service' });
    };

    const handleOpenExpenseModal = () => {
        setModal({ ...initialModalState, open: true, mode: 'expense' });
    };

    const handleCloseServiceModal = () => {
        setModal(initialModalState);
    };

    const handleCreateServicePayment = async () => {
        if (!modal.description.trim()) {
            Alert.alert('Atenção', modal.mode === 'service' ? 'Informe a descrição do serviço.' : 'Informe a descrição da saída.');
            return;
        }

        const amount = Number(modal.amount.replace(',', '.'));
        if (Number.isNaN(amount) || amount <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido maior que zero.');
            return;
        }

        try {
            if (modal.mode === 'service') {
                if (!modal.ownerId) {
                    Alert.alert('Atenção', 'Selecione um tutor para lançar o serviço.');
                    return;
                }

                await FinanceService.createServicePayment({
                    ownerId: modal.ownerId,
                    description: modal.description,
                    amount,
                    referenceMonth,
                });
            } else {
                await FinanceService.createExpense({
                    description: modal.description,
                    amount,
                    status: modal.expenseStatus,
                    referenceMonth,
                });
            }
            handleCloseServiceModal();
            await loadData();
        } catch (error) {
            Alert.alert('Erro', modal.mode === 'service' ? 'Não foi possível lançar o serviço.' : 'Não foi possível lançar a saída.');
        }
    };

    const renderStatus = (status: PaymentWithOwner['status'] | ExpenseStatus) => {
        if (status === 'paid') return { label: 'Pago', color: theme.success };
        if (status === 'overdue') return { label: 'Atrasado', color: theme.warning };
        if (status === 'cancelled') return { label: 'Cancelado', color: theme.textMuted };
        return { label: 'Pendente', color: theme.info };
    };

    const renderMoney = (value?: number | null, negative = false) => {
        if (hideValues) return '••••••';
        const safeValue = Number(value ?? 0);
        if (!Number.isFinite(safeValue)) {
            return 'R$ 0,00';
        }
        const prefix = negative ? '- ' : '';
        return `${prefix}R$ ${safeValue.toFixed(2).replace('.', ',')}`;
    };

    const renderItem = ({ item }: { item: FinanceEntry }) => {
        const isExpense = item.kind === 'expense';
        const status = renderStatus(item.status);
        return (
            <AppCard padding="md" style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.paymentTitleRow}>
                            {isExpense ? <ArrowDownRight size={14} color={theme.warning} /> : item.type === 'monthly_fee' ? <Crown size={14} color={theme.primary} /> : null}
                            <AppText variant="body" style={{ fontWeight: '600' }}>{item.description}</AppText>
                        </View>
                        {isExpense ? (
                            <AppText variant="caption" color={theme.textMuted}>Saída da loja</AppText>
                        ) : (
                            <AppText variant="caption" color={theme.textMuted}>{item.ownerName}</AppText>
                        )}
                    </View>
                    <AppText variant="h3" color={isExpense ? theme.warning : undefined}>{renderMoney(item.amount, isExpense)}</AppText>
                </View>

                <View style={styles.paymentFooter}>
                    <View style={styles.footerLeft}>
                        <View style={[styles.statusTag, { borderColor: status.color + '55', backgroundColor: status.color + '16' }]}>
                            <AppText variant="caption" style={{ color: status.color, fontWeight: '700' }}>{status.label}</AppText>
                        </View>
                        {isExpense ? (
                            <View style={[styles.expenseTag, { borderColor: theme.warning + '40', backgroundColor: theme.warning + '12' }]}>
                                <AppText variant="caption" style={{ color: theme.warning, fontWeight: '700' }}>Saída</AppText>
                            </View>
                        ) : null}
                    </View>
                    {!isExpense && item.status !== 'paid' && item.status !== 'cancelled' && (
                        <TouchableOpacity
                            style={[styles.payButton, { backgroundColor: theme.success }]}
                            onPress={() => handleMarkAsPaid(item.id)}
                        >
                            <Check size={14} color="#fff" />
                            <AppText variant="caption" color="#fff" style={{ fontWeight: '700' }}>
                                Marcar como pago
                            </AppText>
                        </TouchableOpacity>
                    )}

                    {!isExpense && item.status === 'paid' && (
                        <View style={styles.paidActionsRow}>
                            <TouchableOpacity
                                style={[styles.payButton, { backgroundColor: theme.tertiary }]}
                                onPress={() => handleGenerateReceipt(item)}
                            >
                                <Receipt size={14} color="#fff" />
                                <AppText variant="caption" color="#fff" style={{ fontWeight: '700' }}>
                                    Recibo
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.payButton, { backgroundColor: theme.warning }]}
                                onPress={() => confirmReopenPayment(item)}
                            >
                                <RotateCcw size={14} color="#fff" />
                                <AppText variant="caption" color="#fff" style={{ fontWeight: '700' }}>
                                    Reabrir
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isExpense && item.status !== 'paid' && (
                        <TouchableOpacity
                            style={[styles.payButton, { backgroundColor: theme.warning }]}
                            onPress={() => FinanceService.markExpenseAsPaid(item.id).then(loadData).catch(() => Alert.alert('Erro', 'Não foi possível marcar esta saída como paga.'))}
                        >
                            <Check size={14} color="#fff" />
                            <AppText variant="caption" color="#fff" style={{ fontWeight: '700' }}>
                                Marcar como paga
                            </AppText>
                        </TouchableOpacity>
                    )}

                    {isExpense && item.status === 'paid' && (
                        <TouchableOpacity
                            style={[styles.payButton, { backgroundColor: theme.textSecondary }]}
                            onPress={() => FinanceService.markExpenseAsOpen(item.id).then(loadData).catch(() => Alert.alert('Erro', 'Não foi possível reabrir esta saída.'))}
                        >
                            <RotateCcw size={14} color="#fff" />
                            <AppText variant="caption" color="#fff" style={{ fontWeight: '700' }}>
                                Reabrir
                            </AppText>
                        </TouchableOpacity>
                    )}
                </View>

                {!isExpense && item.paidAt ? (
                    <AppText variant="caption" color={theme.textMuted}>
                        Pago em {new Date(item.paidAt).toLocaleDateString('pt-BR')}
                    </AppText>
                ) : null}
            </AppCard>
        );
    };

    const serviceEntries = entries.filter((entry): entry is Extract<FinanceEntry, { kind: 'service' }> => entry.kind === 'service');
    const expenseEntries = entries.filter((entry): entry is Extract<FinanceEntry, { kind: 'expense' }> => entry.kind === 'expense');

    const sections = [
        { title: 'Serviços', data: serviceEntries },
        { title: 'Saídas', data: expenseEntries },
    ].filter((section) => section.data.length > 0);

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <AppText variant="h1">Finanças</AppText>
                        <AppText variant="caption" color={theme.textSecondary}>Controle mensal, receitas e despesas</AppText>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            onPress={() => setHideValues((current) => !current)}
                            style={[
                                styles.currentMonthShortcut,
                                {
                                    borderColor: theme.border,
                                    backgroundColor: theme.surface,
                                },
                            ]}
                        >
                            {hideValues ? <EyeOff size={16} color={theme.text} /> : <Eye size={16} color={theme.text} />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={goCurrentMonth}
                            disabled={isCurrentMonth}
                            style={[
                                styles.currentMonthShortcut,
                                {
                                    borderColor: theme.primary + '40',
                                    backgroundColor: isCurrentMonth ? theme.surfaceAlt : theme.primary + '15',
                                    opacity: isCurrentMonth ? 0.65 : 1,
                                },
                            ]}
                        >
                            <AppText variant="caption" color={theme.primary} style={{ fontWeight: '700' }}>
                                Mês atual
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.monthSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <TouchableOpacity onPress={goPrevMonth} style={styles.monthBtn}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <AppText variant="h3" style={{ textTransform: 'capitalize' }}>{monthLabel}</AppText>
                    <TouchableOpacity onPress={goNextMonth} style={styles.monthBtn}>
                        <ChevronRight size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryGrid}>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Receitas</AppText>
                        <AppText variant="h3" color={theme.success}>{renderMoney(summary.revenue ?? 0)}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Despesas</AppText>
                        <AppText variant="h3" color={theme.warning}>{renderMoney(summary.expenses ?? 0, true)}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Saldo final</AppText>
                        <AppText variant="h3" color={(summary.balance ?? 0) >= 0 ? theme.success : theme.warning}>{renderMoney(Math.abs(summary.balance ?? 0), (summary.balance ?? 0) < 0)}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Em aberto</AppText>
                        <AppText variant="h3" color={theme.warning}>{renderMoney(summary.open ?? 0)}</AppText>
                    </AppCard>
                </View>

                <SectionList
                    style={{ flex: 1 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshing={loading}
                    onRefresh={loadData}
                    sections={sections}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <AppText variant="caption" color={theme.textMuted} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                                {section.title}
                            </AppText>
                        </View>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Plus size={28} color={theme.border} />
                            <AppText variant="body" color={theme.textMuted} style={{ marginTop: Spacing.sm }}>
                                {loading ? 'Carregando finanças...' : 'Nenhum lançamento neste mês'}
                            </AppText>
                        </View>
                    }
                />

                <Modal
                    visible={modal.open}
                    transparent
                    animationType="fade"
                    onRequestClose={handleCloseServiceModal}
                >
                    <KeyboardAvoidingView
                        style={styles.modalOverlay}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseServiceModal} />
                        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.modalTitleRow}>
                                <AppText variant="h3">{modal.mode === 'service' ? 'Novo serviço' : 'Nova saída'}</AppText>
                                <View style={[styles.modePill, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
                                    <TouchableOpacity
                                        onPress={() => setModal((current) => ({ ...current, mode: 'service' }))}
                                        style={[styles.modePillButton, modal.mode === 'service' && { backgroundColor: theme.primary }]}
                                    >
                                        <AppText variant="caption" style={{ fontWeight: '700' }} color={modal.mode === 'service' ? '#fff' : theme.text}>Serviço</AppText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setModal((current) => ({ ...current, mode: 'expense' }))}
                                        style={[styles.modePillButton, modal.mode === 'expense' && { backgroundColor: theme.warning }]}
                                    >
                                        <AppText variant="caption" style={{ fontWeight: '700' }} color={modal.mode === 'expense' ? '#fff' : theme.text}>Saída</AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {modal.mode === 'service' ? (
                                <>
                                    <View style={styles.ownerChips}>
                                        {owners.map((owner) => {
                                            const selected = owner.id === modal.ownerId;
                                            return (
                                                <TouchableOpacity
                                                    key={owner.id}
                                                    style={[
                                                        styles.ownerChip,
                                                        {
                                                            borderColor: selected ? theme.primary : theme.border,
                                                            backgroundColor: selected ? theme.primary + '1A' : theme.surface,
                                                        },
                                                    ]}
                                                    onPress={() => setModal((current) => ({ ...current, ownerId: owner.id }))}
                                                >
                                                    <AppText
                                                        variant="caption"
                                                        style={{ fontWeight: '600' }}
                                                        color={selected ? theme.primary : theme.text}
                                                    >
                                                        {owner.name}
                                                    </AppText>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            ) : null}

                            <AppInput
                                label="Descrição"
                                value={modal.description}
                                onChangeText={(description) => setModal((current) => ({ ...current, description }))}
                                placeholder={modal.mode === 'service' ? 'Ex: Banho e tosa' : 'Ex: Compra de materiais'}
                            />
                            <AppInput
                                label="Valor"
                                value={modal.amount}
                                onChangeText={(amount) => setModal((current) => ({ ...current, amount: amount.replace(/[^0-9,.]/g, '') }))}
                                placeholder="Ex: 80,00"
                                keyboardType="decimal-pad"
                            />

                            {modal.mode === 'expense' ? (
                                <View style={styles.expenseStatusRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusChoice,
                                            {
                                                borderColor: modal.expenseStatus === 'pending' ? theme.warning : theme.border,
                                                backgroundColor: modal.expenseStatus === 'pending' ? theme.warning + '14' : theme.surface,
                                            },
                                        ]}
                                        onPress={() => setModal((current) => ({ ...current, expenseStatus: 'pending' }))}
                                    >
                                        <AppText variant="caption" style={{ fontWeight: '700' }} color={modal.expenseStatus === 'pending' ? theme.warning : theme.text}>Pendente</AppText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusChoice,
                                            {
                                                borderColor: modal.expenseStatus === 'paid' ? theme.success : theme.border,
                                                backgroundColor: modal.expenseStatus === 'paid' ? theme.success + '14' : theme.surface,
                                            },
                                        ]}
                                        onPress={() => setModal((current) => ({ ...current, expenseStatus: 'paid' }))}
                                    >
                                        <AppText variant="caption" style={{ fontWeight: '700' }} color={modal.expenseStatus === 'paid' ? theme.success : theme.text}>Paga</AppText>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            <View style={styles.modalActions}>
                                <AppButton title="Cancelar" variant="ghost" onPress={handleCloseServiceModal} style={{ flex: 1 }} />
                                <AppButton title="Salvar" onPress={handleCreateServicePayment} style={{ flex: 1 }} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary, zIndex: 10 }]}
                onPress={handleOpenServiceModal}
            >
                <Plus size={28} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.secondaryFab, { backgroundColor: theme.warning, shadowColor: theme.warning, zIndex: 10 }]}
                onPress={handleOpenExpenseModal}
            >
                <ArrowDownRight size={24} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: 10,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        flex: 1,
    },
    currentMonthShortcut: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    fab: {
        position: 'absolute',
        right: Spacing.lg,
        bottom: Spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondaryFab: {
        position: 'absolute',
        right: Spacing.lg,
        bottom: Spacing.lg + 72,
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    monthSwitcher: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    monthBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    summaryCard: {
        width: '48%',
        marginBottom: 0,
    },
    list: {
        paddingTop: Spacing.md,
        paddingBottom: 130,
    },
    sectionHeader: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
    },
    paymentCard: {
        marginBottom: Spacing.sm,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: Spacing.sm,
    },
    paymentTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paymentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    statusTag: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    expenseTag: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    paidActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        padding: Spacing.lg,
    },
    modalCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: Spacing.md,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: Spacing.sm,
    },
    modePill: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 999,
        padding: 4,
        gap: 4,
    },
    modePillButton: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    ownerChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: Spacing.sm,
    },
    ownerChip: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    expenseStatusRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: Spacing.xs,
    },
    statusChoice: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
});
