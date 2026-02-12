import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Crown } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { Colors, Spacing } from '../../constants/Colors';
import { appointmentDao, AppointmentWithDetails } from '../../storage/daos/appointmentDao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AgendaStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';

type Nav = NativeStackNavigationProp<AgendaStackParamList>;

export const AgendaScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<Nav>();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadAppointments = useCallback(async (dateStr: string) => {
        setIsLoading(true);
        try {
            // Buscamos agendamentos para o dia específico
            const start = `${dateStr}T00:00:00.000Z`;
            const end = `${dateStr}T23:59:59.999Z`;
            const data = await appointmentDao.getByDateRange(start, end);
            setAppointments(data || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAppointments(selectedDate);
        }, [selectedDate, loadAppointments])
    );

    const renderItem = ({ item }: { item: AppointmentWithDetails }) => {
        const time = new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    {
                        backgroundColor: theme.surface,
                        borderLeftColor: item.status === 'COMPLETED' ? theme.success : item.status === 'CANCELLED' ? theme.danger : theme.primary,
                        borderLeftWidth: 4
                    }
                ]}
                onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
            >
                <View style={[styles.itemTimeContainer, { borderRightColor: theme.border }]}>
                    <AppText variant="h3">{time}</AppText>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: item.status === 'COMPLETED' ? theme.success : item.status === 'CANCELLED' ? theme.danger : theme.primary }
                    ]} />
                </View>
                <View style={styles.itemContent}>
                    <AppText variant="h3">{item.petName}</AppText>
                    <AppText variant="body" color={theme.textSecondary}>{item.serviceType}</AppText>
                    <View style={styles.ownerRow}>
                        <AppText variant="caption" color={theme.textMuted}>{item.ownerName}</AppText>
                        {item.isClubinho && (
                            <View style={[styles.clubinhoBadge, { backgroundColor: theme.primary }]}>
                                <Crown size={10} color="#FFF" />
                                <AppText style={styles.clubinhoText}>Clubinho</AppText>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const markedDates = React.useMemo(() => ({
        [selectedDate]: {
            selected: true,
            selectedColor: theme.primary,
            selectedTextColor: 'white'
        }
    }), [selectedDate, theme.primary]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <AppText variant="h1">Agenda</AppText>
            </View>

            <View style={[styles.calendarContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <Calendar
                    onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                    markedDates={markedDates}
                    showSixWeeks={true}
                    enableSwipeMonths={true}
                    theme={{
                        backgroundColor: theme.background,
                        calendarBackground: theme.background,
                        textSectionTitleColor: theme.textSecondary,
                        selectedDayBackgroundColor: theme.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: theme.primary,
                        dayTextColor: theme.text,
                        textDisabledColor: theme.textMuted,
                        dotColor: theme.primary,
                        selectedDotColor: '#ffffff',
                        arrowColor: theme.primary,
                        monthTextColor: theme.text,
                        indicatorColor: theme.primary,
                        textDayFontWeight: '400',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 13
                    }}
                />
            </View>

            <View style={[styles.listHeader, { backgroundColor: theme.background }]}>
                <AppText variant="h2">
                    {format(new Date(selectedDate + 'T12:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </AppText>
            </View>

            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <AppText color={theme.textMuted}>Nenhum agendamento para este dia</AppText>
                    </View>
                )}
                refreshing={isLoading}
                onRefresh={() => loadAppointments(selectedDate)}
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                onPress={() => navigation.navigate('AddAppointment', { date: selectedDate })}
            >
                <Plus size={28} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    calendarContainer: {
        paddingBottom: Spacing.sm,
        borderBottomWidth: 1,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    listContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.lg * 2,
    },
    item: {
        borderRadius: 12,
        padding: Spacing.md,
        marginTop: Spacing.md,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemTimeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        borderRightWidth: 1,
        paddingRight: Spacing.md,
        width: 70,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    ownerRow: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clubinhoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
        gap: 3,
    },
    clubinhoText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    emptyContainer: {
        paddingTop: 40,
        alignItems: 'center',
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
});
