import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import { BytebankTabSelector } from '@/shared/ui/TabSelector';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { TextInput } from 'react-native-paper';

const AccountAccessScreen = () => {
    const { login, signUp, user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loginForm = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const registerForm = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            registerEmail: "",
            registerPassword: "",
        }
    });

    useEffect(() => {
        if (user && !authLoading) {
            router.replace('/(protected)/dashboard');
        }
    }, [user, authLoading]);

    const handleLogin = async (data: {email: string; password: string}) => {
        setIsLoading(true);
        const success = await login(data.email, data.password);
        setIsLoading(false);

        if (!success) {
            Alert.alert("Erro de Login", "Verifique seu e-mail e senha e tente novamente.");
        }
    };

    const handleRegister = async (data: {name: string; registerEmail: string; registerPassword: string}) => {
        setIsLoading(true);
        try {
            await signUp(data.name, data.registerEmail, data.registerPassword);
            setActiveTab('login');
            registerForm.reset();
        } catch (_) {
            Alert.alert("Ocorreu um erro", "Verifique os dados e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (name: string) => {
        setActiveTab(name);
        loginForm.reset();
        registerForm.reset();
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
                        <FormProvider {...loginForm} key="login-form">
                            <View style={styles.formContainer}>
                                <BytebankInputController
                                    name="email"
                                    label="Digite o seu e-mail"
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    rules={{
                                        required: "E-mail obrigatório",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "E-mail é inválido"
                                        }
                                    }}
                                />
                                <BytebankInputController
                                    name="password"
                                    label="Digite a sua senha"
                                    placeholder="********"
                                    secureTextEntry={!showPassword}
                                    type="password"
                                    rules={{ required: "Senha é obrigatória" }}
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
                                    onPress={loginForm.handleSubmit(handleLogin)}
                                    disabled={isLoading || !loginForm.formState.isValid}>
                                    {isLoading ? <ActivityIndicator color="#fff" /> : "Entrar"}
                                </BytebankButton>
                            </View>
                        </FormProvider>
                    ) : (
                        <FormProvider {...registerForm} key="register-form">
                            <View style={styles.formContainer}>
                                <BytebankInputController
                                    name="name"
                                    label="Nome"
                                    placeholder="Seu nome"
                                    rules={{ required: "Nome é obrigatório" }}
                                />
                                <BytebankInputController
                                    name="registerEmail"
                                    label="Digite o e-mail"
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    rules={{
                                        required: "E-mail é obrigatório",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "E-mail é inválido"
                                        }
                                    }}
                                />
                                <BytebankInputController
                                    name="registerPassword"
                                    label="Digite a senha"
                                    placeholder="********"
                                    secureTextEntry={!showRegisterPassword}
                                    type="password"
                                    rules={{ required: "Senha é obrigatória" }}
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
                                    onPress={registerForm.handleSubmit(handleRegister)}
                                    disabled={isLoading || !registerForm.formState.isValid}>
                                    {isLoading ? <ActivityIndicator color={ColorsPalette.light['lime.700']} /> : "Criar conta"}
                                </BytebankButton>
                            </View>
                        </FormProvider>
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