import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../types';
import { FinanceScreen } from '../../screens/Finance/FinanceScreen';

const Stack = createNativeStackNavigator<FinanceStackParamList>();

export const FinanceStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FinanceScreen" component={FinanceScreen} />
        {/* Future: PaymentDetail, AddEditPayment */}
    </Stack.Navigator>
);
