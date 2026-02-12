import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    CalendarProvider,
    ExpandableCalendar,
    Timeline
} from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { Spacing } from '../../constants/Colors';
import { appointmentDao, AppointmentWithDetails } from '../../storage/daos/appointmentDao';
import { format, addHours, parseISO } from 'date-fns';
import { AgendaStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';

type Nav = NativeStackNavigationProp<AgendaStackParamList>;

export const AgendaScreen = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<Nav>();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);

    const loadAppointments = useCallback(async (dateStr: string) => {
        try {
            const start = `${dateStr}T00:00:00.000Z`;
            const end = `${dateStr}T23:59:59.999Z`;
            const data = await appointmentDao.getByDateRange(start, end);
            setAppointments(data || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAppointments(selectedDate);
        }, [selectedDate, loadAppointments])
    );

    const events = useMemo(() => {
        return appointments.map(app => {
            const startDate = parseISO(app.date);
            const endDate = addHours(startDate, 1);

            let color = theme.primary;
            if (app.status === 'COMPLETED') color = theme.success;
            if (app.status === 'CANCELLED') color = theme.danger;

            return {
                id: app.id.toString(),
                start: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
                end: format(endDate, 'yyyy-MM-dd HH:mm:ss'),
                title: app.petName,
                summary: `${app.serviceType}${app.isClubinho ? '👑' : ''}`,
                color: color,
                appointmentId: app.id,
            };
        });
    }, [appointments, theme]);

    const onDateChanged = useCallback((date: string) => {
        setSelectedDate(date);
    }, []);

    const onEventPress = useCallback((event: any) => {
        navigation.navigate('AppointmentDetail', { appointmentId: event.appointmentId });
    }, [navigation]);

    const calendarTheme = useMemo(() => ({
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
        textDayFontWeight: '400' as const,
        textMonthFontWeight: 'bold' as const,
        textDayHeaderFontWeight: '600' as const,
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 13,
        agendaDayTextColor: theme.textSecondary,
        agendaDayNumColor: theme.text,
        agendaTodayColor: theme.primary,
        agendaKnobColor: theme.primary,
    }), [theme]);

    const timelineTheme = useMemo(() => ({
        ...calendarTheme,
        eventTitle: {
            color: '#ffffff',
            fontWeight: 'bold' as const,
            fontSize: 14
        },
        eventSummary: {
            color: '#ffffff',
            fontSize: 12
        },
        eventTimes: {
            color: '#ffffff',
            fontSize: 10
        },
        line: {
            backgroundColor: theme.border,
            width: 1
        },
        verticalLine: {
            backgroundColor: theme.border,
            width: 1
        },
        nowIndicatorLine: {
            backgroundColor: theme.danger,
            height: 1
        },
        nowIndicatorKnob: {
            backgroundColor: theme.danger,
            width: 7,
            height: 7,
            borderRadius: 4
        },
        timeLabel: {
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: '400' as const
        }
    }), [calendarTheme, theme.border, theme.danger, theme.textSecondary]);

    const markedDates = useMemo(() => ({
        [selectedDate]: { selected: true, marked: appointments.length > 0 }
    }), [selectedDate, appointments.length]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <AppText variant="h1">Agenda</AppText>
            </View>

            <CalendarProvider
                key={isDark ? 'dark' : 'light'}
                date={selectedDate}
                onDateChanged={onDateChanged}
                theme={calendarTheme}
            >
                <ExpandableCalendar
                    firstDay={1}
                    markedDates={markedDates}
                    theme={calendarTheme}
                />

                <View style={styles.timelineContainer}>
                    <Timeline
                        date={selectedDate}
                        format24h={true}
                        events={events}
                        onEventPress={onEventPress}
                        scrollToFirst={true}
                        start={0}
                        end={24}
                        theme={timelineTheme}
                    />
                </View>
            </CalendarProvider>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary, zIndex: 10 }]}
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
    timelineContainer: {
        flex: 1,
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
