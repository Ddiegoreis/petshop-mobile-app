import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { AppText } from './Typography';
import { useTheme } from '../../hooks/useTheme';

interface AppInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.wrapper}>
            {label && (
                <AppText variant="caption" style={[styles.label, { color: theme.textSecondary }]}>{label}</AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        color: theme.text
                    },
                    error ? { borderColor: theme.error } : null,
                    style,
                ]}
                placeholderTextColor={theme.textMuted}
                {...props}
            />
            {error && (
                <AppText variant="caption" color={theme.error} style={styles.errorText}>
                    {error}
                </AppText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.md,
    },
    label: {
        marginBottom: Spacing.xs,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        fontSize: 16,
    },
    errorText: {
        marginTop: Spacing.xs,
    },
});
