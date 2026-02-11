import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppInput } from '../../components/ui/Input';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { petDao } from '../../storage/daos/petDao';
import { ownerDao } from '../../storage/daos/ownerDao';
import { PetsStackParamList } from '../../navigation/types';
import { Owner } from '../../storage/schema';
import { Picker } from '@react-native-picker/picker';

type Route = RouteProp<PetsStackParamList, 'AddEditPet'>;

export const AddEditPetScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<Route>();
    const { petId, ownerId: initialOwnerId } = route.params || {};
    const isEditing = !!petId;

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [dob, setDob] = useState(''); // Simple text for now, could be DatePicker later
    const [notes, setNotes] = useState('');
    const [selectedOwnerId, setSelectedOwnerId] = useState<number | undefined>(initialOwnerId);
    const [owners, setOwners] = useState<Owner[]>([]);

    const [errors, setErrors] = useState<{ name?: string; owner?: string }>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load owners for the picker
        const loadOwners = async () => {
            const allOwners = await ownerDao.getAll();
            setOwners(allOwners);
        };
        loadOwners();

        // Load pet data if editing
        if (isEditing && petId) {
            const loadPet = async () => {
                const pet = await petDao.getById(petId);
                if (pet) {
                    setName(pet.name);
                    setBreed(pet.breed || '');
                    setDob(pet.dob || '');
                    setNotes(pet.notes || '');
                    setSelectedOwnerId(pet.ownerId);
                }
            };
            loadPet();
        }
    }, [petId, isEditing]);

    const validate = (): boolean => {
        const newErrors: { name?: string; owner?: string } = {};
        if (!name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!selectedOwnerId) newErrors.owner = 'Tutor é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate() || !selectedOwnerId) return;

        setSaving(true);
        try {
            if (isEditing && petId) {
                await petDao.update(petId, {
                    name: name.trim(),
                    breed: breed.trim() || null,
                    dob: dob.trim() || null,
                    notes: notes.trim() || null,
                    ownerId: selectedOwnerId,
                });
            } else {
                await petDao.create({
                    name: name.trim(),
                    ownerId: selectedOwnerId,
                    breed: breed.trim() || null,
                    dob: dob.trim() || null,
                    notes: notes.trim() || null,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o pet.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <AppText variant="h2">{isEditing ? 'Editar Pet' : 'Novo Pet'}</AppText>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.form}>
                    {/* Owner Selection */}
                    <View style={styles.pickerContainer}>
                        <AppText variant="caption" style={styles.label}>Tutor *</AppText>
                        <View style={[styles.pickerWrapper, errors.owner ? styles.errorBorder : null]}>
                            <Picker
                                selectedValue={selectedOwnerId}
                                onValueChange={(itemValue: number | undefined) => setSelectedOwnerId(itemValue)}
                                enabled={!initialOwnerId || isEditing}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione um tutor..." value={undefined} />
                                {owners.map((owner) => (
                                    <Picker.Item key={owner.id} label={owner.name} value={owner.id} />
                                ))}
                            </Picker>
                        </View>
                        {errors.owner && <AppText variant="caption" color={Colors.light.error}>{errors.owner}</AppText>}
                        {(!isEditing && initialOwnerId) && <AppText variant="caption" color={Colors.light.textMuted} style={{ marginTop: 4 }}>Tutor fixado pelo contexto.</AppText>}
                    </View>

                    <AppInput
                        label="Nome do Pet *"
                        placeholder="Ex: Rex"
                        value={name}
                        onChangeText={setName}
                        error={errors.name}
                    />

                    <AppInput
                        label="Raça"
                        placeholder="Ex: Poodle"
                        value={breed}
                        onChangeText={setBreed}
                    />

                    <AppInput
                        label="Data de Nascimento (Texto)"
                        placeholder="Ex: 10/10/2020"
                        value={dob}
                        onChangeText={setDob}
                    />

                    <AppInput
                        label="Observações"
                        placeholder="Ex: Alérgico a ..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    <View style={styles.actions}>
                        <AppButton
                            title={isEditing ? 'Salvar Alterações' : 'Cadastrar Pet'}
                            onPress={handleSave}
                            loading={saving}
                        />
                        <AppButton
                            title="Cancelar"
                            variant="ghost"
                            onPress={() => navigation.goBack()}
                            style={{ marginTop: Spacing.sm }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    form: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: 40,
    },
    label: {
        marginBottom: Spacing.xs,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    pickerContainer: {
        marginBottom: Spacing.md,
    },
    pickerWrapper: {
        borderWidth: 1.5,
        borderColor: Colors.light.border,
        borderRadius: 12,
        backgroundColor: Colors.light.surface,
        overflow: 'hidden', // for borderRadius
    },
    picker: {
        // Styles for picker if needed
    },
    errorBorder: {
        borderColor: Colors.light.error,
    },
    actions: {
        marginTop: Spacing.lg,
    },
});
