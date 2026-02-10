import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/Typography';
import { Colors, Spacing } from '../../constants/Colors';

export const ClientsListScreen = () => (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <AppText variant="h1">Clientes</AppText>
            <AppText variant="body" color={Colors.light.textSecondary}>
                Lista de tutores cadastrados
            </AppText>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.light.background },
    content: { padding: Spacing.lg },
});
