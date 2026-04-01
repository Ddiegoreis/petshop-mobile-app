import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Check, ChevronLeft, ChevronRight, Crown, Plus, Receipt, RotateCcw } from 'lucide-react-native';
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

type ModalState = {
    open: boolean;
    ownerId?: number;
    description: string;
    amount: string;
};

const initialModalState: ModalState = {
    open: false,
    description: '',
    amount: '',
};

export const FinanceScreen = () => {
    const { theme } = useTheme();
    const [referenceMonth, setReferenceMonth] = useState(FinanceService.getCurrentReferenceMonth());
    const [payments, setPayments] = useState<PaymentWithOwner[]>([]);
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [summary, setSummary] = useState({ total: 0, paid: 0, open: 0, cancelled: 0 });
    const [modal, setModal] = useState<ModalState>(initialModalState);

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
                FinanceService.getMonthlyPayments(referenceMonth),
            ]);
            setOwners(ownersData);
            setPayments(financeData.payments);
            setSummary(financeData.summary);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
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
        setModal({ ...initialModalState, open: true });
    };

    const handleCloseServiceModal = () => {
        setModal(initialModalState);
    };

    const handleCreateServicePayment = async () => {
        if (!modal.ownerId) {
            Alert.alert('Atenção', 'Selecione um tutor para lançar o serviço.');
            return;
        }

        if (!modal.description.trim()) {
            Alert.alert('Atenção', 'Informe a descrição do serviço.');
            return;
        }

        const amount = Number(modal.amount.replace(',', '.'));
        if (Number.isNaN(amount) || amount <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido maior que zero.');
            return;
        }

        try {
            await FinanceService.createServicePayment({
                ownerId: modal.ownerId,
                description: modal.description,
                amount,
                referenceMonth,
            });
            handleCloseServiceModal();
            await loadData();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível lançar o serviço.');
        }
    };

    const renderStatus = (status: PaymentWithOwner['status']) => {
        if (status === 'paid') return { label: 'Pago', color: theme.success };
        if (status === 'overdue') return { label: 'Atrasado', color: theme.warning };
        if (status === 'cancelled') return { label: 'Cancelado', color: theme.textMuted };
        return { label: 'Pendente', color: theme.info };
    };

    const renderItem = ({ item }: { item: PaymentWithOwner }) => {
        const status = renderStatus(item.status);
        return (
            <AppCard padding="md" style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.paymentTitleRow}>
                            {item.type === 'monthly_fee' ? <Crown size={14} color={theme.primary} /> : null}
                            <AppText variant="body" style={{ fontWeight: '600' }}>{item.description}</AppText>
                        </View>
                        <AppText variant="caption" color={theme.textMuted}>{item.ownerName}</AppText>
                    </View>
                    <AppText variant="h3">R$ {item.amount.toFixed(2).replace('.', ',')}</AppText>
                </View>

                <View style={styles.paymentFooter}>
                    <View style={[styles.statusTag, { borderColor: status.color + '55', backgroundColor: status.color + '16' }]}>
                        <AppText variant="caption" style={{ color: status.color, fontWeight: '700' }}>{status.label}</AppText>
                    </View>
                    {item.status !== 'paid' && item.status !== 'cancelled' && (
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

                    {item.status === 'paid' && (
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
                </View>

                {item.paidAt ? (
                    <AppText variant="caption" color={theme.textMuted}>
                        Pago em {new Date(item.paidAt).toLocaleDateString('pt-BR')}
                    </AppText>
                ) : null}
            </AppCard>
        );
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <AppText variant="h1">Pagamentos</AppText>
                        <AppText variant="caption" color={theme.textSecondary}>Controle mensal e recorrências</AppText>
                    </View>
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
                        <AppText variant="caption" color={theme.textMuted}>Total do mês</AppText>
                        <AppText variant="h3">R$ {summary.total.toFixed(2).replace('.', ',')}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Recebido</AppText>
                        <AppText variant="h3" color={theme.success}>R$ {summary.paid.toFixed(2).replace('.', ',')}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Em aberto</AppText>
                        <AppText variant="h3" color={theme.warning}>R$ {summary.open.toFixed(2).replace('.', ',')}</AppText>
                    </AppCard>
                    <AppCard padding="md" style={styles.summaryCard}>
                        <AppText variant="caption" color={theme.textMuted}>Cancelado</AppText>
                        <AppText variant="h3" color={theme.textMuted}>R$ {summary.cancelled.toFixed(2).replace('.', ',')}</AppText>
                    </AppCard>
                </View>

                <FlatList
                    style={{ flex: 1 }}
                    data={payments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshing={loading}
                    onRefresh={loadData}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Plus size={28} color={theme.border} />
                            <AppText variant="body" color={theme.textMuted} style={{ marginTop: Spacing.sm }}>
                                {loading ? 'Carregando pagamentos...' : 'Nenhum pagamento neste mês'}
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
                            <AppText variant="h3" style={{ marginBottom: Spacing.sm }}>Novo serviço</AppText>

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

                            <AppInput
                                label="Descrição"
                                value={modal.description}
                                onChangeText={(description) => setModal((current) => ({ ...current, description }))}
                                placeholder="Ex: Banho e tosa"
                            />
                            <AppInput
                                label="Valor"
                                value={modal.amount}
                                onChangeText={(amount) => setModal((current) => ({ ...current, amount: amount.replace(/[^0-9,.]/g, '') }))}
                                placeholder="Ex: 80,00"
                                keyboardType="decimal-pad"
                            />

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
    currentMonthShortcut: {
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
    modalActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
});
