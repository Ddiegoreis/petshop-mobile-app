import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgendaStackParamList } from '../types';
import { AgendaScreen } from '../../screens/Agenda/AgendaScreen';
import { AddAppointmentScreen } from '../../screens/Agenda/AddAppointmentScreen';
import { AppointmentDetailScreen } from '../../screens/Agenda/AppointmentDetailScreen';

const Stack = createNativeStackNavigator<AgendaStackParamList>();

export const AgendaStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AgendaList" component={AgendaScreen} />
        <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
        <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </Stack.Navigator>
);
