/**
 * Premium Petshop Color Palette
 *
 * Base colors provided:
 *   Primary:   #AB27A7 (Vibrant Purple)
 *   Secondary: #FFA5FF (Soft Pink)
 *   Tertiary:  #14BEBB (Teal)
 *   Neutral:   #FEFEDF (Warm Cream)
 */

export const Colors = {
    light: {
        // Core
        primary: '#AB27A7',       // Vibrant Purple — main actions, active elements
        primaryLight: '#C94FC5',  // Lighter purple — hover/pressed states
        primaryDark: '#7E1C7B',   // Deeper purple — headers, emphasis

        secondary: '#FFA5FF',     // Soft Pink — badges, highlights, tags
        secondaryDark: '#E87CE8', // Muted pink — pressed state

        tertiary: '#14BEBB',      // Teal — secondary actions, links, icons
        tertiaryLight: '#5DD9D6', // Light teal — subtle backgrounds
        tertiaryDark: '#0E918F',  // Deep teal — text on light surfaces

        // Surfaces
        background: '#fef3ff',    // Warm Cream — app background
        surface: '#FFFFFF',       // White — cards, modals
        surfaceAlt: '#FFF5F9',    // Pinkish white — alternate surface (e.g. selected)

        // Text
        text: '#2D1035',          // Deep purple-black — primary text
        textSecondary: '#6B4E72', // Muted purple — secondary text
        textMuted: '#9E8BA3',     // Light purple-grey — captions, placeholders
        textOnPrimary: '#FFFFFF', // White — text on primary-colored backgrounds

        // Borders & Dividers
        border: '#E8D5EA',        // Soft lavender border
        divider: '#F0E6F1',       // Very light lavender

        // Semantic
        success: '#14BEBB',       // Teal — success states
        error: '#D32F2F',         // Red — errors
        danger: '#E94560',        // Premium attention color
        warning: '#F5A623',       // Amber — warnings
        info: '#AB27A7',          // Purple — informational

        // Shadows
        shadow: 'rgba(171, 39, 167, 0.08)',
    },

    dark: {
        // Core
        primary: '#D157CD',       // Lighter purple for dark bg visibility
        primaryLight: '#E87CE8',
        primaryDark: '#AB27A7',

        secondary: '#FFA5FF',
        secondaryDark: '#D76FD7',

        tertiary: '#5DD9D6',      // Brighter teal for dark bg
        tertiaryLight: '#7EE8E5',
        tertiaryDark: '#14BEBB',

        // Surfaces
        background: '#1A0E1E',    // Very dark purple
        surface: '#2A1830',       // Dark purple — cards
        surfaceAlt: '#351D3D',    // Slightly lighter — alternate surface

        // Text
        text: '#F5EEF6',          // Near-white with warm tint
        textSecondary: '#C4ABC8', // Muted lavender
        textMuted: '#8A7490',     // Dim purple-grey
        textOnPrimary: '#FFFFFF',

        // Borders & Dividers
        border: '#3D2545',        // Dark lavender border
        divider: '#2F1A36',

        // Semantic
        success: '#5DD9D6',
        error: '#EF5350',
        danger: '#FF4D6D',
        warning: '#FFB74D',
        info: '#D157CD',

        // Shadows
        shadow: 'rgba(0, 0, 0, 0.3)',
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
