import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/shared/auth/AuthContext';
import { router } from 'expo-router';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInput } from '@/shared/ui/Input';
import { BytebankTabSelector } from '@/shared/ui/TabSelector';

const AccountAccessScreen = () => {
    const { login, signUp, user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            router.replace('/(protected)/dashboard');
        }
    }, [user, authLoading]);

    const handleLogin = async () => {
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);

        if (!success) {
            Alert.alert("Erro de Login", "Verifique seu e-mail e senha e tente novamente.");
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            await signUp(name, registerEmail, registerPassword);
            setActiveTab('login');
            Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
            setName('');
            setRegisterEmail('');
            setRegisterPassword('');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
                Alert.alert("Ocorreu um erro", "Verifique os dados e tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleTabChange = (name: string) => {
        setActiveTab(name);
        setEmail('');
        setPassword('');
        setName('');
        setRegisterEmail('');
        setRegisterPassword('');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={require('@/assets/images/logo-auth.png')}
                        style={{ width: 100, height: 111, marginTop: 20, marginBottom: 30 }}
                    />
                    <Text style={styles.title}>Experimente mais liberdade no controle da sua vida financeira.</Text>

                    <BytebankTabSelector tabs={[{ label: 'Login', name: 'login' }, { label: 'Crie uma conta', name: 'register' }]} activeTab={activeTab} onTabChange={handleTabChange} />
                    {activeTab === 'login' ? (
                        <View style={styles.formContainer}>
                            <BytebankInput
                                label={'Digite o seu e-mail'}
                                value={email}
                                onChangeText={setEmail}
                                type={'email-address'}
                                placeholder="email@example.com" />

                            <BytebankInput
                                label={'Digite a sua senha'}
                                value={password}
                                onChangeText={setPassword}
                                type={'visible-password'}
                                secureTextEntry={!showPassword}
                                placeholder="********"
                                right={
                                    <TextInput.Icon
                                        icon={() => <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                            <BytebankButton
                                color="primary"
                                variant="contained"
                                onPress={handleLogin}
                                disabled={isLoading}>
                                {isLoading ? <ActivityIndicator color="#fff" /> : "Entrar"}
                            </BytebankButton>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <BytebankInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Seu nome"
                                label={'Nome'} />


                            <BytebankInput
                                label={'Digite o e-mail'}
                                value={registerEmail}
                                onChangeText={setRegisterEmail}
                                keyboardType={'email-address'}
                                mode="outlined"
                                placeholder="email@example.com"
                            />

                            <BytebankInput
                                label={'Digite a senha'}
                                value={registerPassword}
                                onChangeText={setRegisterPassword}
                                keyboardType={'visible-password'}
                                mode="outlined"
                                secureTextEntry={!showRegisterPassword}
                                placeholder="********"
                                right={
                                    <TextInput.Icon
                                        icon={() => <Feather name={showRegisterPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                        onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                                    />
                                }
                            />
                            <BytebankButton
                                color="primary"
                                variant="contained"
                                onPress={handleRegister}
                                disabled={isLoading}>
                                {isLoading ? <ActivityIndicator color="#fff" /> : "Criar conta"}
                            </BytebankButton>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        alignItems: 'center',
        paddingTop: 100,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
});

export default AccountAccessScreen;