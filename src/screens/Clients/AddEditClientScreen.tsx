import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components/ui/Typography';
import { AppInput } from '../../components/ui/Input';
import { AppButton } from '../../components/ui/Button';
import { Colors, Spacing } from '../../constants/Colors';
import { ownerDao } from '../../storage/daos/ownerDao';
import { ClientsStackParamList } from '../../navigation/types';
import { formatPhone, formatCurrency } from '../../utils/format';
import { useTheme } from '../../hooks/useTheme';
import { ClientService } from '../../services/ClientService';

type Route = RouteProp<ClientsStackParamList, 'AddEditClient'>;

export const AddEditClientScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<Route>();
    const ownerId = route.params?.ownerId;
    const isEditing = !!ownerId;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isClubinho, setIsClubinho] = useState(false);
    const [clubinhoMonthlyFee, setClubinhoMonthlyFee] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; clubinhoMonthlyFee?: string }>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditing && ownerId) {
            const load = async () => {
                const owner = await ownerDao.getById(ownerId);
                if (owner) {
                    setName(owner.name);
                    setPhone(owner.phone);
                    setAddress(owner.address);
                    setIsClubinho(owner.isClubinho);
                    setClubinhoMonthlyFee(owner.clubinhoMonthlyFee > 0 ? formatCurrency(owner.clubinhoMonthlyFee.toFixed(2)) : '');
                }
            };
            load();
        }
    }, [ownerId, isEditing]);

    const validate = (): boolean => {
        const newErrors: { name?: string; phone?: string; address?: string; clubinhoMonthlyFee?: string } = {};
        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        }
        if (!address.trim()) {
            newErrors.address = 'Endereço é obrigatório';
        }
        if (isClubinho) {
            const numericFee = Number(clubinhoMonthlyFee.replace(/\./g, '').replace(',', '.'));
            if (!clubinhoMonthlyFee.trim()) {
                newErrors.clubinhoMonthlyFee = 'Valor mensal é obrigatório para clubinho';
            } else if (Number.isNaN(numericFee) || numericFee <= 0) {
                newErrors.clubinhoMonthlyFee = 'Informe um valor válido maior que zero';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhone(text);
        if (formatted.length <= 15) { // (XX) XXXXX-XXXX = 15 chars
            setPhone(formatted);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
        }
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            const parsedFee = Number(clubinhoMonthlyFee.replace(/\./g, '').replace(',', '.'));
            const payload = {
                name,
                phone,
                address,
                isClubinho,
                clubinhoMonthlyFee: isClubinho ? parsedFee : 0,
            };

            if (isEditing && ownerId) {
                await ClientService.updateOwner(ownerId, payload);
            } else {
                await ClientService.createOwner(payload);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o tutor.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <AppText variant="h2">{isEditing ? 'Editar Tutor' : 'Novo Tutor'}</AppText>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.form}>
                    <AppInput
                        label="Nome *"
                        placeholder="Nome completo do tutor"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        error={errors.name}
                        autoCapitalize="words"
                    />

                    <AppInput
                        label="Telefone *"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        error={errors.phone}
                        keyboardType="phone-pad"
                        maxLength={15}
                    />

                    <AppInput
                        label="Endereço *"
                        placeholder="Rua, número, bairro"
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text);
                            if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                        }}
                        error={errors.address}
                        multiline
                    />

                    <View style={[styles.switchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View>
                            <AppText variant="body" style={{ fontWeight: '600' }}>Clubinho</AppText>
                            <AppText variant="caption" color={theme.textMuted}>Cliente Premium</AppText>
                        </View>
                        <Switch
                            value={isClubinho}
                            onValueChange={(value) => {
                                setIsClubinho(value);
                                if (!value) {
                                    setClubinhoMonthlyFee('');
                                    setErrors((prev) => ({ ...prev, clubinhoMonthlyFee: undefined }));
                                }
                            }}
                            trackColor={{ false: theme.border, true: theme.primaryDark }}
                            thumbColor={theme.primary}
                        />
                    </View>

                    {isClubinho && (
                        <AppInput
                            label="Valor mensal do clubinho *"
                            placeholder="Ex: 120,00"
                            value={clubinhoMonthlyFee}
                            onChangeText={(text) => {
                                const formatted = formatCurrency(text);
                                setClubinhoMonthlyFee(formatted);
                                if (errors.clubinhoMonthlyFee) {
                                    setErrors((prev) => ({ ...prev, clubinhoMonthlyFee: undefined }));
                                }
                            }}
                            error={errors.clubinhoMonthlyFee}
                            keyboardType="decimal-pad"
                        />
                    )}

                    <View style={styles.actions}>
                        <AppButton
                            title={isEditing ? 'Salvar Alterações' : 'Cadastrar Tutor'}
                            variant="primary"
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
    actions: {
        marginTop: Spacing.lg,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: Spacing.md,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
    },
});
