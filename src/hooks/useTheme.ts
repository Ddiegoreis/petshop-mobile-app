import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export const useTheme = () => {
    const colorScheme = useColorScheme();

    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return {
        theme,
        isDark: colorScheme === 'dark',
        colorScheme,
    };
};
