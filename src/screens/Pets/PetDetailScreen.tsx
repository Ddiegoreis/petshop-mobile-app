import React, { useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Pencil, User, Calendar, FileText, PawPrint } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { petDao, PetWithOwner } from '../../storage/daos/petDao';
import { PetsStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<PetsStackParamList>;
type Route = RouteProp<PetsStackParamList, 'PetDetail'>;

export const PetDetailScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { petId } = route.params;
    const [pet, setPet] = useState<PetWithOwner | null>(null);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const data = await petDao.getById(petId);
                if (data) setPet(data);
            };
            load();
        }, [petId])
    );

    const handleDelete = () => {
        Alert.alert(
            'Excluir Pet',
            `Deseja realmente excluir "${pet?.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await petDao.delete(petId);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    if (!pet) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <AppText variant="h2">{pet.name}</AppText>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditPet', { petId: pet.id, ownerId: pet.ownerId })}
                    style={styles.iconBtn}
                >
                    <Pencil size={20} color={Colors.light.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppCard padding="lg">
                    <View style={styles.infoRow}>
                        <PawPrint size={18} color={Colors.light.secondaryDark} />
                        <AppText variant="body" style={styles.infoText}>{pet.breed || 'Raça não informada'}</AppText>
                    </View>

                    {pet.dob && (
                        <View style={styles.infoRow}>
                            <Calendar size={18} color={Colors.light.secondaryDark} />
                            <AppText variant="body" style={styles.infoText}>Nasc: {pet.dob}</AppText>
                        </View>
                    )}

                    <View style={styles.infoRow}>
                        <User size={18} color={Colors.light.secondaryDark} />
                        <AppText variant="body" style={styles.infoText}>Tutor: {pet.ownerName}</AppText>
                    </View>

                    {pet.notes && (
                        <View style={styles.infoRow}>
                            <FileText size={18} color={Colors.light.secondaryDark} />
                            <AppText variant="body" style={styles.infoText}>{pet.notes}</AppText>
                        </View>
                    )}
                </AppCard>

                <View style={styles.deleteSection}>
                    <AppButton
                        title="Excluir Pet"
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
    deleteSection: {
        marginTop: Spacing.xl,
    },
});
