import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { Dog, Users, Clock } from 'lucide-react-native';
import { appointmentDao, AppointmentWithDetails } from '../../storage/daos/appointmentDao';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [todayAppointments, setTodayAppointments] = React.useState<AppointmentWithDetails[]>([]);
    const [loading, setLoading] = React.useState(true);

    const loadTodayData = React.useCallback(async () => {
        try {
            const now = new Date();
            const startStr = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
            const endStr = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

            const data = await appointmentDao.getByDateRange(startStr, endStr);
            setTodayAppointments(data);
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadTodayData();
        }, [loadTodayData])
    );

    const navigateToTab = (tabName: string) => {
        navigation.navigate(tabName);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <AppText variant="h1">Gerente Cão Carioca</AppText>
                    <AppText variant="body" color={Colors.light.textMuted}>Bem-vindo de volta!</AppText>
                </View>

                <AppCard padding="lg" style={styles.cta}>
                    <View style={styles.ctaHeader}>
                        <AppText variant="h3">Atendimento de Hoje</AppText>
                    </View>

                    {todayAppointments.length > 0 ? (
                        <View style={styles.appointmentList}>
                            {todayAppointments.slice(0, 3).map((app) => {
                                const time = new Date(app.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <View key={app.id} style={styles.miniItem}>
                                        <View style={styles.miniTime}>
                                            <Clock size={12} color={Colors.light.textSecondary} />
                                            <AppText variant="caption" style={{ marginLeft: 4 }}>{time}</AppText>
                                        </View>
                                        <AppText variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
                                            {app.petName} <AppText variant="caption" color={Colors.light.textMuted}>({app.serviceType})</AppText>
                                        </AppText>
                                    </View>
                                );
                            })}
                            {todayAppointments.length > 3 && (
                                <AppText variant="caption" color={Colors.light.textMuted} style={{ marginTop: Spacing.sm }}>
                                    + {todayAppointments.length - 3} outros atendimentos...
                                </AppText>
                            )}
                        </View>
                    ) : (
                        <>
                            <AppText variant="caption" style={{ marginBottom: Spacing.md, marginTop: Spacing.sm }}>
                                {loading ? 'Carregando agendamentos...' : 'Nenhum atendimento agendado para hoje.'}
                            </AppText>
                            <AppButton title="Agendar Novo" variant="primary" onPress={() => navigation.navigate('Agenda', { screen: 'AddAppointment' })} />
                        </>
                    )}
                </AppCard>

                <View style={styles.grid}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateToTab('Clients')} style={styles.menuTouchable}>
                        <AppCard style={styles.menuItem}>
                            <Users size={32} color={Colors.light.primary} />
                            <AppText variant="h3" style={styles.menuLabel}>Tutores</AppText>
                        </AppCard>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigateToTab('Pets')} style={styles.menuTouchable}>
                        <AppCard style={styles.menuItem}>
                            <Dog size={32} color={Colors.light.primary} />
                            <AppText variant="h3" style={styles.menuLabel}>Pets</AppText>
                        </AppCard>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scroll: {
        padding: Spacing.lg,
    },
    header: {
        marginBottom: Spacing.xl,
        marginTop: Spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuTouchable: {
        width: '48%',
    },
    menuLabel: {
        marginTop: Spacing.sm,
    },
    cta: {
        marginTop: Spacing.md,
    },
    ctaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    appointmentList: {
        marginTop: Spacing.xs,
    },
    miniItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    miniTime: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        width: 60,
    },
});
