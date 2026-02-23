import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { HomeScreen } from '../../screens/Home/HomeScreen';
import { BackupScreen } from '../../screens/Home/BackupScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Backup" component={BackupScreen} />
    </Stack.Navigator>
);
