import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/Colors';

export const AppText: React.FC<TextProps & { variant?: keyof typeof Typography; color?: string }> = ({
    style,
    variant = 'body',
    color,
    ...props
}) => {
    return (
        <Text
            style={[
                Typography[variant],
                { color: color || Colors.light.text },
                style
            ]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({});
