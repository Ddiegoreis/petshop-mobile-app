import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../../components/ui/Typography';
import { AppButton } from '../../components/ui/Button';
import { AppCard } from '../../components/ui/Card';
import { Colors, Spacing } from '../../constants/Colors';
import { appointmentDao, AppointmentWithDetails } from '../../storage/daos/appointmentDao';
import { AgendaStackParamList } from '../../navigation/types';
import { ArrowLeft } from 'lucide-react-native';

type Nav = NativeStackNavigationProp<AgendaStackParamList>;
type Route = RouteProp<AgendaStackParamList, 'AppointmentDetail'>;

export const AppointmentDetailScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { appointmentId } = route.params;
    const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointment();
    }, [appointmentId]);

    const loadAppointment = async () => {
        setLoading(true);
        const data = await appointmentDao.getById(appointmentId);
        if (data) {
            setAppointment(data);
        } else {
            Alert.alert('Erro', 'Agendamento não encontrado.');
            navigation.goBack();
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (status: 'COMPLETED' | 'CANCELLED') => {
        try {
            await appointmentDao.update(appointmentId, { status });
            Alert.alert('Sucesso', `Agendamento ${status === 'COMPLETED' ? 'concluído' : 'cancelado'}!`);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível atualizar o agendamento.');
        }
    };

    if (loading || !appointment) {
        return (
            <SafeAreaView style={styles.container}>
                <AppText>Carregando...</AppText>
            </SafeAreaView>
        );
    }

    const dateFormatted = new Date(appointment.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeFormatted = new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ArrowLeft size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <AppText variant="h1">Detalhes</AppText>
                </View>

                <AppCard style={styles.card}>
                    <View style={styles.row}>
                        <AppText variant="caption" color={Colors.light.textSecondary}>Data</AppText>
                        <AppText variant="h3">{dateFormatted} às {timeFormatted}</AppText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <AppText variant="caption" color={Colors.light.textSecondary}>Serviço</AppText>
                        <AppText variant="body">{appointment.serviceType}</AppText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <AppText variant="caption" color={Colors.light.textSecondary}>Pet</AppText>
                        <AppText variant="body">{appointment.petName} ({appointment.ownerName})</AppText>
                    </View>

                    {appointment.notes && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.row}>
                                <AppText variant="caption" color={Colors.light.textSecondary}>Notas</AppText>
                                <AppText variant="body">{appointment.notes}</AppText>
                            </View>
                        </>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <AppText variant="caption" color={Colors.light.textSecondary}>Status</AppText>
                        <AppText
                            variant="h3"
                            color={appointment.status === 'COMPLETED' ? Colors.light.success : appointment.status === 'CANCELLED' ? Colors.light.danger : Colors.light.primary}
                        >
                            {appointment.status === 'PENDING' ? 'Agendado' : appointment.status === 'COMPLETED' ? 'Concluído' : 'Cancelado'}
                        </AppText>
                    </View>
                </AppCard>

                {appointment.status === 'PENDING' && (
                    <View style={styles.actions}>
                        <AppButton
                            title="Concluir Atendimento"
                            onPress={() => handleUpdateStatus('COMPLETED')}
                            style={{ backgroundColor: Colors.light.success, marginBottom: Spacing.md }}
                        />
                        <AppButton
                            title="Cancelar Agendamento"
                            onPress={() => Alert.alert('Cancelar', 'Tem certeza?', [
                                { text: 'Não', style: 'cancel' },
                                { text: 'Sim', style: 'destructive', onPress: () => handleUpdateStatus('CANCELLED') }
                            ])}
                            variant="outline"
                            style={{ borderColor: Colors.light.danger }}
                            textStyle={{ color: Colors.light.danger }}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.light.background },
    content: { padding: Spacing.lg },
    card: { padding: Spacing.md },
    row: { marginBottom: Spacing.sm },
    divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.sm },
    actions: { marginTop: Spacing.xl },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: Spacing.md,
    },
    backBtn: {
        padding: 4,
        marginLeft: -4,
    },
});
