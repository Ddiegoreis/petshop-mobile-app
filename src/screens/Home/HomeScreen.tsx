import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { Dog, Calendar, DollarSign, Users } from 'lucide-react-native';

export const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <AppText variant="h1">Petshop Manager</AppText>
                    <AppText variant="body" color={Colors.light.textMuted}>Bem-vindo de volta!</AppText>
                </View>

                <AppCard padding="lg" style={styles.cta}>
                    <AppText variant="h3">Atendimento de Hoje</AppText>
                    <AppText variant="caption" style={{ marginBottom: Spacing.md }}>Nenhum atendimento agendado para hoje.</AppText>
                    <AppButton title="Agendar Novo" variant="primary" />
                </AppCard>

                <View style={styles.grid}>
                    <AppCard style={styles.menuItem}>
                        <Users size={32} color={Colors.light.primary} />
                        <AppText variant="h3" style={styles.menuLabel}>Clientes</AppText>
                    </AppCard>

                    <AppCard style={styles.menuItem}>
                        <Dog size={32} color={Colors.light.primary} />
                        <AppText variant="h3" style={styles.menuLabel}>Pets</AppText>
                    </AppCard>

                    <AppCard style={styles.menuItem}>
                        <Calendar size={32} color={Colors.light.primary} />
                        <AppText variant="h3" style={styles.menuLabel}>Agenda</AppText>
                    </AppCard>

                    <AppCard style={styles.menuItem}>
                        <DollarSign size={32} color={Colors.light.primary} />
                        <AppText variant="h3" style={styles.menuLabel}>Pagamentos</AppText>
                    </AppCard>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scroll: {
        padding: Spacing.lg,
    },
    header: {
        marginBottom: Spacing.xl,
        marginTop: Spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '48%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        marginTop: Spacing.sm,
    },
    cta: {
        marginTop: Spacing.md,
    },
});
