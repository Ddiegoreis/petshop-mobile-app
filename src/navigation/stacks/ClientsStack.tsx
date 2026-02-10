import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientsStackParamList } from '../types';
import { ClientsListScreen } from '../../screens/Clients/ClientsListScreen';
import { ClientDetailScreen } from '../../screens/Clients/ClientDetailScreen';
import { AddEditClientScreen } from '../../screens/Clients/AddEditClientScreen';
import { PetsListScreen } from '../../screens/Pets/PetsListScreen';
import { PetDetailScreen } from '../../screens/Pets/PetDetailScreen';
import { AddEditPetScreen } from '../../screens/Pets/AddEditPetScreen';

const Stack = createNativeStackNavigator<ClientsStackParamList>();

export const ClientsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientsList" component={ClientsListScreen} />
        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
        <Stack.Screen name="AddEditClient" component={AddEditClientScreen} />
        <Stack.Screen name="PetsList" component={PetsListScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="AddEditPet" component={AddEditPetScreen} />
    </Stack.Navigator>
);
