import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgendaStackParamList } from '../types';
import { AgendaScreen } from '../../screens/Agenda/AgendaScreen';

const Stack = createNativeStackNavigator<AgendaStackParamList>();

export const AgendaStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
        {/* Future: AddEditAppointment */}
    </Stack.Navigator>
);
