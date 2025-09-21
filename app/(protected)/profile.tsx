import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { useUploadFile } from '@/shared/hooks/useUploadFile';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInput } from '@/shared/ui/Input/Input';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
    const { user, updateUser } = useAuth();
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const { UploadProgressBar, uploadFile } = useUploadFile();
    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSaveProfile = async () => {
        updateUser({ displayName: name, email, phoneNumber: phone }).then(() => {
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
                        <Text style={styles.userName}>{name}</Text>
                    </View>

                    <View style={styles.formSection}>
                        <BytebankInput
                            label={'Nome completo'}
                            value={name}
                            onChangeText={setName}
                            placeholder="Seu nome"
                            editable={isEditing}
                        />
                        <BytebankInput
                            label={'E-mail'}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email@example.com"
                            editable={isEditing}
                        />
                        <BytebankInput
                            label={'Telefone'}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="(00) 00000-0000"
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.actionsSection}>
                        {isEditing ? (
                            <BytebankButton color="primary" variant="contained" onPress={handleSaveProfile}>
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