import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/Typography';
import { Spacing } from '../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';

export const FinanceScreen = () => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <AppText variant="h1">Finanças</AppText>
                <AppText variant="body" color={theme.textSecondary}>
                    Controle de pagamentos mensal
                </AppText>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: Spacing.lg },
});
