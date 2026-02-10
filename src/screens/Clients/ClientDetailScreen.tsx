import React from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Pencil, Trash2, Phone, MapPin, PawPrint, Calendar } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { ownerDao } from '../../storage/daos/ownerDao';
import { Owner } from '../../storage/schema';
import { ClientsStackParamList } from '../../navigation/types';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

type Nav = NativeStackNavigationProp<ClientsStackParamList>;
type Route = RouteProp<ClientsStackParamList, 'ClientDetail'>;

export const ClientDetailScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { ownerId } = route.params;
    const [owner, setOwner] = useState<Owner | null>(null);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const data = await ownerDao.getById(ownerId);
                if (data) setOwner(data);
            };
            load();
        }, [ownerId])
    );

    const handleDelete = () => {
        Alert.alert(
            'Excluir Tutor',
            `Deseja realmente excluir "${owner?.name}"? Todos os pets e agendamentos vinculados serão removidos.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await ownerDao.delete(ownerId);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    if (!owner) return null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <AppText variant="h2">{owner.name}</AppText>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditClient', { ownerId: owner.id })}
                    style={styles.iconBtn}
                >
                    <Pencil size={20} color={Colors.light.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Info Card */}
                <AppCard padding="lg">
                    {owner.phone && (
                        <View style={styles.infoRow}>
                            <Phone size={18} color={Colors.light.secondaryDark} />
                            <AppText variant="body" style={styles.infoText}>{owner.phone}</AppText>
                        </View>
                    )}
                    {owner.address && (
                        <View style={styles.infoRow}>
                            <MapPin size={18} color={Colors.light.secondaryDark} />
                            <AppText variant="body" style={styles.infoText}>{owner.address}</AppText>
                        </View>
                    )}
                    {owner.createdAt && (
                        <View style={styles.infoRow}>
                            <Calendar size={18} color={Colors.light.secondaryDark} />
                            <AppText variant="caption" color={Colors.light.textMuted} style={styles.infoText}>
                                Cadastrado em {new Date(owner.createdAt).toLocaleDateString('pt-BR')}
                            </AppText>
                        </View>
                    )}
                </AppCard>

                {/* Pets Section */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('PetsList', { ownerId: owner.id })}
                >
                    <AppCard padding="lg" style={styles.petsCard}>
                        <View style={styles.petsRow}>
                            <PawPrint size={24} color={Colors.light.primary} />
                            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                                <AppText variant="h3">Pets</AppText>
                                <AppText variant="caption" color={Colors.light.textMuted}>
                                    Gerenciar pets deste tutor
                                </AppText>
                            </View>
                            <View style={styles.petsBadge}>
                                <AppText variant="caption" color="#FFF" style={{ fontWeight: '700' }}>
                                    →
                                </AppText>
                            </View>
                        </View>
                    </AppCard>
                </TouchableOpacity>

                {/* Delete */}
                <View style={styles.deleteSection}>
                    <AppButton
                        title="Excluir Tutor"
                        variant="danger"
                        onPress={handleDelete}
                    />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        gap: 12,
    },
    backBtn: {
        padding: 4,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: Colors.light.surfaceAlt,
        borderRadius: 10,
    },
    content: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    infoText: {
        marginLeft: Spacing.md,
    },
    petsCard: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary,
    },
    petsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petsBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteSection: {
        marginTop: Spacing.xl,
    },
});
