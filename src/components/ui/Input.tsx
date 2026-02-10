import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { AppText } from './Typography';

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
    return (
        <View style={styles.wrapper}>
            {label && (
                <AppText variant="caption" style={styles.label}>{label}</AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={Colors.light.textMuted}
                {...props}
            />
            {error && (
                <AppText variant="caption" color={Colors.light.error} style={styles.errorText}>
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
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.light.surface,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.light.text,
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    errorText: {
        marginTop: Spacing.xs,
    },
});
