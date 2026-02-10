import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Calendar, DollarSign } from 'lucide-react-native';
import { RootTabParamList } from './types';
import { HomeStack } from './stacks/HomeStack';
import { ClientsStack } from './stacks/ClientsStack';
import { AgendaStack } from './stacks/AgendaStack';
import { FinanceStack } from './stacks/FinanceStack';
import { Colors } from '../constants/Colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.light.primary,
            tabBarInactiveTintColor: Colors.light.textMuted,
            tabBarStyle: {
                backgroundColor: Colors.light.surface,
                borderTopColor: Colors.light.border,
                borderTopWidth: 1,
                paddingTop: 6,
                paddingBottom: 8,
                height: 64,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            },
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
                tabBarLabel: 'Início',
                tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
        />
        <Tab.Screen
            name="Clients"
            component={ClientsStack}
            options={{
                tabBarLabel: 'Clientes',
                tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
            }}
        />
        <Tab.Screen
            name="Agenda"
            component={AgendaStack}
            options={{
                tabBarLabel: 'Agenda',
                tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
            }}
        />
        <Tab.Screen
            name="Finance"
            component={FinanceStack}
            options={{
                tabBarLabel: 'Finanças',
                tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
            }}
        />
    </Tab.Navigator>
);
