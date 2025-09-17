import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { AppHeader } from '@/shared/components/AppHeader';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInput } from '@/shared/ui/Input/Input';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
    // Dados iniciais do usuário para o estado
    const [name, setName] = useState('João da Silva');
    const [email, setEmail] = useState('joao.silva@bytebank.com');
    const [phone, setPhone] = useState('(11) 99876-5432');
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveProfile = () => {
        // Lógica para salvar as alterações do perfil
        console.log('Perfil salvo:', { name, email, phone });
        setIsEditing(false); // Sai do modo de edição
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Perfil</Text>
            </View>
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.profileSection}>
                    <TouchableOpacity>
                        <View style={styles.profileImage}>
                            <MaterialIcons name="camera-enhance" size={50} color={ColorsPalette.light['lime.200']} />
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
                            Salvar Alterações
                        </BytebankButton>
                    ) : (
                        <BytebankButton color="secondary" variant="outlined" onPress={() => setIsEditing(true)}>
                            Editar Perfil
                        </BytebankButton>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
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