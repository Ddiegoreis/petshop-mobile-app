import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';

export const AppCard: React.FC<ViewProps & { padding?: keyof typeof Spacing }> = ({
    children,
    style,
    padding = 'md',
    ...props
}) => {
    return (
        <View style={[styles.card, { padding: Spacing[padding] }, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.surface,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: Spacing.md,
    },
});
