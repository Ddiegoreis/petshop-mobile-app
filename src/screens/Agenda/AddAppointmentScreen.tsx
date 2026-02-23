import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import * as Calendar from 'expo-calendar';
import { addMonths, addWeeks, format } from 'date-fns';

import { ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppButton } from '../../components/ui/Button';
import { AppInput } from '../../components/ui/Input';
import { Spacing } from '../../constants/Colors';
import { appointmentDao } from '../../storage/daos/appointmentDao';
import { ownerDao } from '../../storage/daos/ownerDao';
import { petDao } from '../../storage/daos/petDao';
import { Owner, Pet } from '../../storage/schema';
import { AgendaStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';

type Nav = NativeStackNavigationProp<AgendaStackParamList>;
type Route = RouteProp<AgendaStackParamList, 'AddAppointment'>;

export const AddAppointmentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();

    const [selectedOwnerId, setSelectedOwnerId] = useState<number | undefined>();
    const [selectedPetId, setSelectedPetId] = useState<number | undefined>(route.params?.petId);

    const [dateStr, setDateStr] = useState(route.params?.date || new Date().toISOString().split('T')[0]);
    const [timeStr, setTimeStr] = useState('09:00');

    const [serviceType, setServiceType] = useState('Banho e Tosa');
    const [notes, setNotes] = useState('');
    const [recurrence, setRecurrence] = useState<'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('NONE');

    const [owners, setOwners] = useState<Owner[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOwners();
        requestCalendarPermissions();
    }, []);

    useEffect(() => {
        if (selectedOwnerId) {
            loadPets(selectedOwnerId);
        } else {
            setPets([]);
        }
    }, [selectedOwnerId]);

    const loadOwners = async () => {
        const data = await ownerDao.getAll();
        setOwners(data);
    };

    const loadPets = async (ownerId: number) => {
        const data = await petDao.getByOwnerId(ownerId);
        setPets(data);
    };

    const requestCalendarPermissions = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso ao calendário para sincronizar.');
        }
    };

    const generateInstances = (baseDate: Date) => {
        const instances = [{
            petId: selectedPetId!,
            date: baseDate.toISOString(),
            serviceType,
            notes,
            status: 'PENDING' as const,
            recurrenceRule: recurrence !== 'NONE' ? recurrence : null,
        }];

        if (recurrence !== 'NONE') {
            let nextDate = baseDate;
            for (let i = 1; i < 12; i++) {
                if (recurrence === 'WEEKLY') nextDate = addWeeks(nextDate, 1);
                if (recurrence === 'BIWEEKLY') nextDate = addWeeks(nextDate, 2);
                if (recurrence === 'MONTHLY') nextDate = addMonths(nextDate, 1);

                instances.push({
                    petId: selectedPetId!,
                    date: nextDate.toISOString(),
                    serviceType,
                    notes,
                    status: 'PENDING' as const,
                    recurrenceRule: recurrence,
                });
            }
        }
        return instances;
    };

    const getCalendarId = async () => {
        try {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const defaultCalendar = calendars.find(c => c.isPrimary) || calendars[0];
            return defaultCalendar?.id;
        } catch (e) {
            console.error('Failed to get calendar ID', e);
            return null;
        }
    };

    const createCalendarEvent = async (calendarId: string, appointmentDate: string) => {
        try {
            return await Calendar.createEventAsync(calendarId, {
                title: `Petshop: ${serviceType}`,
                startDate: new Date(appointmentDate),
                endDate: new Date(new Date(appointmentDate).getTime() + 60 * 60 * 1000),
                notes: notes,
            });
        } catch (e) {
            console.error('Calendar sync error', e);
            return null;
        }
    };

    const handleSave = async () => {
        if (!selectedPetId || !dateStr || !timeStr || !serviceType) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            const fullDateObj = new Date(`${dateStr}T${timeStr}:00`);
            const appointmentsToCreate = generateInstances(fullDateObj);

            for (const app of appointmentsToCreate) {
                const hasConflict = await appointmentDao.checkConflict(app.petId, app.date);
                if (hasConflict) {
                    Alert.alert(
                        'Pet já possui agendamento',
                        `O pet já tem um compromisso marcado para este horário. Por favor, escolha outro horário.`
                    );
                    setLoading(false);
                    return;
                }
            }

            const calendarId = await getCalendarId();

            for (const app of appointmentsToCreate) {
                let calendarEventId = null;
                if (calendarId) {
                    calendarEventId = await createCalendarEvent(calendarId, app.date);
                }

                await appointmentDao.create({
                    ...app,
                    calendarEventId,
                });
            }

            NavHelper();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao salvar agendamento.');
        } finally {
            setLoading(false);
        }
    };

    const NavHelper = () => {
        Alert.alert('Sucesso', 'Agendamento(s) criado(s)!');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <AppText variant="h1">Novo Agendamento</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.form}>

                {/* Owner Selection */}
                <View style={styles.section}>
                    <AppText variant="caption" style={[styles.label, { color: theme.textSecondary }]}>Tutor *</AppText>
                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Picker
                            selectedValue={selectedOwnerId}
                            onValueChange={(v: number | undefined) => { setSelectedOwnerId(v); setSelectedPetId(undefined); }}
                            style={[styles.picker, { color: theme.text }]}
                            dropdownIconColor={theme.primary}
                        >
                            <Picker.Item label="Selecione..." value={undefined} color={theme.textMuted} />
                            {owners.map(o => <Picker.Item key={o.id} label={o.name} value={o.id} color={theme.textMuted} />)}
                        </Picker>
                    </View>
                </View>

                {/* Pet Selection */}
                <View style={styles.section}>
                    <AppText variant="caption" style={[styles.label, { color: theme.textSecondary }]}>Pet *</AppText>
                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Picker
                            selectedValue={selectedPetId}
                            onValueChange={(v: number | undefined) => setSelectedPetId(v)}
                            enabled={!!selectedOwnerId}
                            style={[styles.picker, { color: theme.text }]}
                            dropdownIconColor={theme.primary}
                        >
                            <Picker.Item label="Selecione..." value={undefined} color={theme.textMuted} />
                            {pets.map(p => <Picker.Item key={p.id} label={p.name} value={p.id} color={theme.textMuted} />)}
                        </Picker>
                    </View>
                </View>

                {/* Service Type */}
                <AppInput
                    label="Serviço *"
                    value={serviceType}
                    onChangeText={setServiceType}
                    placeholder="Ex: Banho, Tosa, Veterinário"
                />

                {/* Date & Time (Simplified for MVP) */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <AppInput
                            label="Data (AAAA-MM-DD) *"
                            value={dateStr}
                            onChangeText={setDateStr}
                            placeholder="2026-02-12"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppInput
                            label="Hora (HH:MM) *"
                            value={timeStr}
                            onChangeText={setTimeStr}
                            placeholder="14:30"
                        />
                    </View>
                </View>

                {/* Recurrence */}
                <View style={styles.section}>
                    <AppText variant="caption" style={[styles.label, { color: theme.textSecondary }]}>Repetição</AppText>
                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Picker
                            selectedValue={recurrence}
                            onValueChange={(v: any) => setRecurrence(v)}
                            style={[styles.picker, { color: theme.text }]}
                            dropdownIconColor={theme.primary}
                        >
                            <Picker.Item label="Não repetir" value="NONE" color={theme.textMuted} />
                            <Picker.Item label="Semanal" value="WEEKLY" color={theme.textMuted} />
                            <Picker.Item label="Quinzenal" value="BIWEEKLY" color={theme.textMuted} />
                            <Picker.Item label="Mensal" value="MONTHLY" color={theme.textMuted} />
                        </Picker>
                    </View>
                </View>

                <AppInput
                    label="Notas"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                />

                <AppButton
                    title="Agendar"
                    onPress={handleSave}
                    loading={loading}
                    style={{ marginTop: Spacing.lg }}
                />

            </ScrollView>
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
    form: { padding: Spacing.lg },
    section: { marginBottom: Spacing.md },
    label: { marginBottom: 4 },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: { height: 50 },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: Spacing.md,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
    },
});
