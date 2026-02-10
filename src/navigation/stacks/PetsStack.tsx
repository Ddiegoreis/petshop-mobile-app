import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetsStackParamList } from '../types';
import { PetsListScreen } from '../../screens/Pets/PetsListScreen';
import { PetDetailScreen } from '../../screens/Pets/PetDetailScreen';
import { AddEditPetScreen } from '../../screens/Pets/AddEditPetScreen';

const Stack = createNativeStackNavigator<PetsStackParamList>();

export const PetsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PetsList" component={PetsListScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="AddEditPet" component={AddEditPetScreen} />
    </Stack.Navigator>
);
