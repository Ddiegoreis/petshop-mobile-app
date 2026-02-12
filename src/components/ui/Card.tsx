import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';

export const AppCard: React.FC<ViewProps & { padding?: keyof typeof Spacing }> = ({
    children,
    style,
    padding = 'md',
    ...props
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, padding: Spacing[padding] }, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: Spacing.md,
    },
});
