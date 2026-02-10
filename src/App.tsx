import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useDatabase } from './hooks/useDatabase';
import { AppNavigator } from './navigation/AppNavigator';
import { Colors } from './constants/Colors';
import { AppText } from './components/ui/Typography';

export default function App() {
  const { isReady, error } = useDatabase();

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <AppText variant="body" style={{ marginTop: 10 }}>Iniciando banco de dados...</AppText>
        </View>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <AppText variant="h3" color={Colors.light.error}>Erro ao carregar banco de dados</AppText>
          <AppText variant="body">{error.message}</AppText>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

