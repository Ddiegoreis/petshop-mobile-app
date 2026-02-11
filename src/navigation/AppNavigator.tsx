import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Users, Calendar, DollarSign, Dog } from 'lucide-react-native';
import { RootTabParamList } from './types';
import { HomeStack } from './stacks/HomeStack';
import { ClientsStack } from './stacks/ClientsStack';
import { PetsStack } from './stacks/PetsStack';
import { AgendaStack } from './stacks/AgendaStack';
import { FinanceStack } from './stacks/FinanceStack';
import { Colors } from '../constants/Colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: Colors.light.textMuted,
                tabBarStyle: {
                    backgroundColor: Colors.light.surface,
                    borderTopColor: Colors.light.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    height: 60 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 4,
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
                    tabBarLabel: 'Tutores',
                    tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Pets"
                component={PetsStack}
                options={{
                    tabBarLabel: 'Pets',
                    tabBarIcon: ({ color, size }) => <Dog size={size} color={color} />,
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
            {/* <Tab.Screen
            name="Finance"
            component={FinanceStack}
            options={{
                tabBarLabel: 'Finanças',
                tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
            }}
        /> */}
        </Tab.Navigator>
    );
};
