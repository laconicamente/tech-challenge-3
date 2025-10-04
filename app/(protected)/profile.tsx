import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { maskPhone } from '@/shared/helpers/maskPhone';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { useUploadFile } from '@/shared/hooks/useUploadFile';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInput } from '@/shared/ui/Input/Input';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
    const { user, updateUser } = useAuth();
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const { UploadProgressBar, uploadFile } = useUploadFile();
    
    const [isEditing, setIsEditing] = useState(false);

    const formMethods = useForm({
        mode: 'onChange',
        defaultValues: {
            name: user?.displayName || '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
        }
    });

    useEffect(() => { 
        formMethods.reset({
            name: user?.displayName || '',
            email: user?.email || '',
            phone: user?.phoneNumber ? maskPhone(user.phoneNumber) : '',
        });
    }, [user]);
    
    const handleEditProfileImage = async () => {
        try {
            const downloadURL = await uploadFile('image', `users/${user?.uid}`);
            if (!downloadURL) return;

            await updateUser({ photoURL: downloadURL });
            showFeedback("success");
        } catch (error) {
            console.error('Erro ao atualizar a foto:', error);
            showFeedback("error");
        }
    };

    const handleSaveProfile = async (data: { name: string, email: string, phone: string }) => {
        const unmaskedPhone = data.phone.replace(/\D/g, '');
        updateUser({ displayName: data.name, email: data.email, phoneNumber: unmaskedPhone }).then(() => {
            showFeedback("success");
        }).catch(_ => {
            showFeedback("error");
        });

        setIsEditing(false);
    };

    return (
        <>
            <SafeAreaView style={styles.container} >
                <UploadProgressBar />
                <View style={styles.header}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Perfil</Text>
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.profileSection}>
                        <TouchableOpacity onPress={handleEditProfileImage}>
                            <View style={styles.profileImage}>
                                {user && user.photoURL ? <Image source={{ uri: user.photoURL }} style={{ width: 120, height: 120, borderRadius: 60 }} /> : <MaterialIcons name="camera-enhance" size={50} color={ColorsPalette.light['lime.200']} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.userName}>{formMethods.watch('name')}</Text>
                    </View>

                    <FormProvider {...formMethods}>
                        <View style={styles.formSection}>
                            <BytebankInputController
                                name="name"
                                label={'Nome completo'}
                                placeholder="Seu nome"
                                editable={isEditing}
                                rules={{ required: 'Nome é obrigatório' }}
                            />
                            <BytebankInputController
                                name="email"
                                label={'E-mail'}
                                placeholder="email@example.com"
                                editable={isEditing}
                                rules={{
                                    required: "E-mail obrigatório",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "E-mail é inválido"
                                    }
                                }}
                            />
                            <Controller
                                control={formMethods.control}
                                name="phone"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <BytebankInput
                                        label={'Telefone'}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={(text) => onChange(maskPhone(text))}
                                        placeholder="(00) 00000-0000"
                                        editable={isEditing}
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                    />
                                )}
                            />
                        </View>
                    </FormProvider>

                    <View style={styles.actionsSection}>
                        {isEditing ? (
                            <BytebankButton color="primary" variant="contained" onPress={formMethods.handleSubmit(handleSaveProfile)}>
                                Salvar alterações
                            </BytebankButton>
                        ) : (
                            <BytebankButton color="secondary" variant="outlined" onPress={() => setIsEditing(true)}>
                                Permitir edição da conta
                            </BytebankButton>
                        )}
                    </View>
                </ScrollView>
                <FeedbackAnimation />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorsPalette.light['lime.900'],
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 15,
        color: '#333',
    },
    formSection: {
        paddingHorizontal: 20,
        gap: 0,
    },
    actionsSection: {
        padding: 20,
        marginTop: 'auto',
    },
});

export default ProfileScreen;