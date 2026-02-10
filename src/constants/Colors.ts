/**
 * Premium Petshop Color Palette
 * Using a sophisticated blend of deep teals, warm sand neutrals, and soft accent colors.
 */

export const Colors = {
    light: {
        primary: '#1A5F7A', // Deep Teal
        secondary: '#159895', // Muted Cyan
        accent: '#F2BE22', // Golden Sun (for alerts/buttons)
        background: '#F9F7F3', // Soft Sand
        surface: '#FFFFFF',
        text: '#0E2954', // Dark Navy
        textMuted: '#576CBC',
        border: '#DDE6ED',
        success: '#3F979B',
        error: '#D21312',
        warning: '#F2BE22',
    },
    dark: {
        primary: '#159895',
        secondary: '#1A5F7A',
        accent: '#F2BE22',
        background: '#0E2954',
        surface: '#1A374D',
        text: '#F9F7F3',
        textMuted: '#576CBC',
        border: '#1A5F7A',
        success: '#3F979B',
        error: '#D21312',
        warning: '#F2BE22',
    },
};

export const Typography = {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '600' as const },
    h3: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};
