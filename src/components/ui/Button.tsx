import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { AppText } from './Typography';
import { useTheme } from '../../hooks/useTheme';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    loading,
    style,
    textStyle,
    disabled,
    ...props
}) => {
    const { theme } = useTheme();
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary': return { backgroundColor: theme.primary };
            case 'secondary': return { backgroundColor: theme.secondary };
            case 'danger': return { backgroundColor: theme.danger };
            case 'outline': return { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.primary };
            case 'ghost': return { backgroundColor: 'transparent' };
            default: return { backgroundColor: theme.primary };
        }
    };

    const getTextColor = () => {
        if (isOutline || isGhost) return theme.primary;
        return theme.textOnPrimary;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getVariantStyle(),
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <AppText
                    variant="body"
                    style={[
                        styles.text,
                        { color: getTextColor() },
                        { fontWeight: '600' },
                        textStyle
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
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
    },
});
