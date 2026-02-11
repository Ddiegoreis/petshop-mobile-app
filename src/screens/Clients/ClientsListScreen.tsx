import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search, Phone, ChevronRight, PawPrint, Crown } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppCard } from '../../components/ui/Card';
import { Colors, Spacing } from '../../constants/Colors';
import { ownerDao } from '../../storage/daos/ownerDao';
import { Owner } from '../../storage/schema';
import { ClientsStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ClientsStackParamList>;

export const ClientsListScreen = () => {
    const navigation = useNavigation<Nav>();
    const [owners, setOwners] = useState<Owner[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const loadOwners = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ownerDao.getAll();
            setOwners(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os tutores.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadOwners();
        }, [loadOwners])
    );

    const filtered = owners.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }: { item: Owner }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ClientDetail', { ownerId: item.id })}
        >
            <AppCard padding="md" style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.cardInfo}>
                        <AppText variant="h3" style={styles.ownerName}>{item.name}</AppText>

                        <View style={styles.tagsRow}>
                            {item.isClubinho && (
                                <View style={styles.clubinhoTag}>
                                    <Crown size={12} color={Colors.light.primary} />
                                    <AppText variant="caption" style={styles.clubinhoTagText}>Clubinho</AppText>
                                </View>
                            )}
                        </View>
                        {item.phone && (
                            <View style={styles.phoneRow}>
                                <Phone size={14} color={Colors.light.textMuted} />
                                <AppText variant="caption" color={Colors.light.textMuted} style={{ marginLeft: 6 }}>
                                    {item.phone}
                                </AppText>
                            </View>
                        )}
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={styles.petsBtn}
                            onPress={() => navigation.navigate('PetsList', { ownerId: item.id })}
                        >
                            <PawPrint size={16} color={Colors.light.primary} />
                            <AppText variant="caption" color={Colors.light.primary} style={{ marginLeft: 4, fontWeight: '600' }}>
                                Pets
                            </AppText>
                        </TouchableOpacity>
                        <ChevronRight size={20} color={Colors.light.textMuted} />
                    </View>
                </View>
            </AppCard>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppText variant="h1">Tutores</AppText>
                <AppText variant="caption" color={Colors.light.textSecondary}>
                    {owners.length} cadastrado{owners.length !== 1 ? 's' : ''}
                </AppText>
            </View>

            <View style={styles.searchContainer}>
                <Search size={18} color={Colors.light.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar tutor..."
                    placeholderTextColor={Colors.light.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <PawPrint size={48} color={Colors.light.border} />
                        <AppText variant="body" color={Colors.light.textMuted} style={{ marginTop: Spacing.md }}>
                            {loading ? 'Carregando...' : 'Nenhum tutor cadastrado'}
                        </AppText>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AddEditClient', {})}
            >
                <Plus size={28} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        borderRadius: 12,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.light.text,
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
    },
    ownerName: {
        fontSize: 18,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    clubinhoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surfaceAlt,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
        borderWidth: 1,
        borderColor: Colors.light.primary + '33',
    },
    clubinhoTagText: {
        color: Colors.light.primary,
        fontSize: 11,
        fontWeight: '700',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    petsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surfaceAlt,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
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
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
