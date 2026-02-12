import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography } from '../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';

export const AppText: React.FC<TextProps & { variant?: keyof typeof Typography; color?: string }> = ({
    style,
    variant = 'body',
    color,
    ...props
}) => {
    const { theme } = useTheme();

    return (
        <Text
            style={[
                Typography[variant],
                { color: color || theme.text },
                style
            ]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({});
