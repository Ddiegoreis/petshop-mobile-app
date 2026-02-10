import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { AppText } from './Typography';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    loading,
    style,
    disabled,
    ...props
}) => {
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={isOutline || isGhost ? Colors.light.primary : '#FFF'} />
            ) : (
                <AppText
                    variant="body"
                    style={[
                        styles.text,
                        { color: isOutline || isGhost ? Colors.light.primary : '#FFF' },
                        { fontWeight: '600' }
                    ]}
                >
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    primary: {
        backgroundColor: Colors.light.primary,
    },
    secondary: {
        backgroundColor: Colors.light.secondary,
    },
    danger: {
        backgroundColor: Colors.light.danger,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
    },
});
