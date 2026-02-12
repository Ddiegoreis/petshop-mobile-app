import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    SectionList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search, ChevronRight, PawPrint, ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { Colors, Spacing } from '../../constants/Colors';
import { petDao, PetWithOwner } from '../../storage/daos/petDao';
import { PetsStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';

type Nav = NativeStackNavigationProp<PetsStackParamList>;
type Route = RouteProp<PetsStackParamList, 'PetsList'>;

export const PetsListScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const filterOwnerId = route.params?.ownerId;

    const [pets, setPets] = useState<PetWithOwner[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadPets = useCallback(async () => {
        try {
            setLoading(true);
            let data: PetWithOwner[] = [];
            if (filterOwnerId) {
                // Fetch only for this owner
                data = (await petDao.getByOwnerId(filterOwnerId)) as PetWithOwner[];
            } else {
                // Fetch all
                data = await petDao.getAll();
            }
            setPets(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os pets.');
        } finally {
            setLoading(false);
        }
    }, [filterOwnerId]);

    useFocusEffect(
        useCallback(() => {
            // Force reload when ownerId changes or screen is focused
            loadPets();
        }, [loadPets])
    );

    const filtered = pets.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // If showing all pets, group by Owner Name
    const sections = filterOwnerId
        ? []
        : Object.values(
            filtered.reduce((acc, pet) => {
                const key = pet.ownerName || 'Sem Tutor';
                if (!acc[key]) acc[key] = { title: key, data: [] };
                acc[key].data.push(pet);
                return acc;
            }, {} as Record<string, { title: string; data: PetWithOwner[] }>)
        ).sort((a, b) => a.title.localeCompare(b.title));

    const renderPetItem = ({ item }: { item: PetWithOwner }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
        >
            <AppCard padding="md" style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.row}>
                        <View style={[styles.avatar, { backgroundColor: theme.surfaceAlt }]}>
                            <PawPrint size={20} color={theme.primary} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <AppText variant="h3">{item.name}</AppText>
                            {item.breed && (
                                <AppText variant="caption" color={theme.textMuted}>{item.breed}</AppText>
                            )}
                        </View>
                    </View>
                    <ChevronRight size={20} color={theme.textMuted} />
                </View>
            </AppCard>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <AppText variant="caption" style={[styles.sectionTitle, { color: theme.primary }]}>{title}</AppText>
        </View>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.center}>
                    <AppText>Carregando...</AppText>
                </View>
            );
        }

        if (pets.length === 0) {
            return (
                <View style={styles.empty}>
                    <PawPrint size={48} color={theme.border} />
                    <AppText variant="body" color={theme.textMuted} style={{ marginTop: Spacing.md }}>
                        Nenhum pet encontrado.
                    </AppText>
                </View>
            );
        }

        if (filterOwnerId) {
            // Flat list for single owner
            return (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPetItem}
                    contentContainerStyle={styles.list}
                />
            );
        }

        // Section list for global view
        return (
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPetItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.list}
                stickySectionHeadersEnabled={false}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    {filterOwnerId && (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <ArrowLeft size={24} color={theme.text} />
                        </TouchableOpacity>
                    )}
                    <AppText variant="h1">Pets</AppText>
                </View>
                {filterOwnerId && <AppText variant="caption" color={theme.textSecondary}>Deste tutor</AppText>}
            </View>

            <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Search size={18} color={theme.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Buscar pet..."
                    placeholderTextColor={theme.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {renderContent()}

            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AddEditPet', { ownerId: filterOwnerId })}
            >
                <Plus size={28} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backBtn: {
        padding: 4,
        marginLeft: -4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
    card: {
        marginBottom: Spacing.sm,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeader: {
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    fab: {
        position: 'absolute',
        right: Spacing.lg,
        bottom: Spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
