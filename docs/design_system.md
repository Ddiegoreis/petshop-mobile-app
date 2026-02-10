# Design System - Gerente Cão Carioca

This document defines the visual standards and component usage for the project. All AI agents must adhere to these patterns to ensure a premium and consistent UI.

## 1. Color Palette (src/constants/Colors.ts)

The theme is based on a vibrant purple and teal palette with soft "glassmorphism" tendencies.

### Core Colors
- **Primary**: `#AB27A7` (Vibrant Purple) - Used for main actions.
- **Secondary**: `#FFA5FF` (Soft Pink) - Used for accents.
- **Tertiary**: `#14BEBB` (Teal) - Used for success and secondary actions.
- **Neutral**: `#FEFEDF` (Warm Cream/Light Pinkish) - App background.

### Semantic Colors
- **Success**: `#14BEBB`
- **Error**: `#D32F2F`
- **Danger**: `#E94560` (Filled background for destructive actions like delete)
- **Warning**: `#F5A623`

---

## 2. Typography (src/components/ui/Typography.tsx)

Always use the `AppText` component. Never use the raw `Text` from `react-native`.

| Variant   | Usage                      | Size/Weight     |
| --------- | -------------------------- | --------------- |
| `h1`      | Screen Titles              | 28px / Bold     |
| `h2`      | Section Titles             | 24px / SemiBold |
| `h3`      | Card Headlines / Subtitles | 20px / SemiBold |
| `body`    | Main content text          | 16px / Regular  |
| `caption` | Labels, notes, small text  | 14px / Regular  |

---

## 3. Spacing System (src/constants/Colors.ts)

Use the predefined `Spacing` tokens for margins and padding.

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

---

## 4. Base Components (src/components/ui/)

### AppButton
Reusable button with variants.
- `primary`: Filled purple (main).
- `secondary`: Filled pink.
- `danger`: Filled cherry-red (for delete/caution).
- `outline`: Bordered with primary color.
- `ghost`: No background/border.

### AppCard
Used for grouping content. 
- **Style**: White background, 16px border-radius, subtle shadow (elevation 3).
- **Usage**: Grid items, list items, info blocks.

### AppInput
Styled form input.
- Always include `label` prop.
- Use `error` prop for validation feedback.

---

## 5. UI Layout Principles
1. **Safe Areas**: All screens must start with `SafeAreaView` from `react-native-safe-area-context`.
2. **Rounded Corners**: Modern feel using `borderRadius: 12` for buttons/inputs and `16` for cards.
3. **Icons**: Use `lucide-react-native`.
   - Primary icons should use `Colors.light.primary` or `Colors.light.secondaryDark`.
4. **Empty States**: Use the `PawPrint` icon from Lucide for empty lists to maintain the petshop branding.
