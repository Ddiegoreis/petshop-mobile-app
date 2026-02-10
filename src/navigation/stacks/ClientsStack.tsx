import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientsStackParamList } from '../types';
import { ClientsListScreen } from '../../screens/Clients/ClientsListScreen';

const Stack = createNativeStackNavigator<ClientsStackParamList>();

export const ClientsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientsList" component={ClientsListScreen} />
        {/* Future: ClientDetail, AddEditClient, PetDetail, AddEditPet */}
    </Stack.Navigator>
);
