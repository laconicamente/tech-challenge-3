import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth/AuthContext';
import { router } from 'expo-router';
import { BytebankButton } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

const AccountAccessScreen = () => {
    const { login, signUp } = useAuth();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Cadastro
    const [name, setName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);


    const handleLogin = () => {
        console.log('Tentativa de login com:', email, password);
        const isAuthenticated = login(email, password);
        if (!isAuthenticated) {
            router.replace('/(protected)/profile');
        }
    };

    const handleRegister = () => {
        signUp(name, registerEmail, registerPassword);
        setActiveTab('login');
        setName('');
        setRegisterEmail('');
        setRegisterPassword('');
    };

    const handleTabChange = (name: 'login' | 'register') => {
        setActiveTab(name);
        
        if (name === 'register') {
            setName('');
            setRegisterEmail('');
            setRegisterPassword('');
        } else if (name === 'login') {
            setEmail('');
            setPassword('');
        }
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

                    <View style={styles.tabSelector}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'login' && styles.tabActive]}
                            onPress={() => handleTabChange('login')}
                        >
                            <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'register' && styles.tabActive]}
                            onPress={() => handleTabChange('register')}
                        >
                            <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>Crie uma conta</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'login' ? (
                        <View style={styles.formContainer}>
                            <Text style={styles.inputLabel}>Digite o seu e-mail</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                keyboardType={'email-address'}
                                mode="outlined"
                                placeholder="email@example.com"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'gray' } }}
                            />

                            <Text style={styles.inputLabel}>Digite a sua senha</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                keyboardType={'visible-password'}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                placeholder="********"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'gray' } }}
                                right={
                                    <TextInput.Icon
                                        icon={() => <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                            <BytebankButton color="primary" variant="contained" onPress={handleLogin}>
                                Entrar
                            </BytebankButton>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <Text style={styles.inputLabel}>Nome</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                placeholder="Seu nome"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'gray' } }}
                            />

                            <Text style={styles.inputLabel}>E-mail</Text>
                            <TextInput
                                value={registerEmail}
                                onChangeText={setRegisterEmail}
                                keyboardType={'email-address'}
                                mode="outlined"
                                placeholder="email@example.com"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'gray' } }}
                            />

                            <Text style={styles.inputLabel}>Senha</Text>
                            <TextInput
                                value={registerPassword}
                                onChangeText={setRegisterPassword}
                                keyboardType={'visible-password'}
                                mode="outlined"
                                secureTextEntry={!showRegisterPassword}
                                placeholder="********"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'gray' } }}
                                right={
                                    <TextInput.Icon
                                        icon={() => <Feather name={showRegisterPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                        onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                                    />
                                }
                            />
                            <BytebankButton color="primary" variant="contained" onPress={handleRegister}>
                                Criar conta
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
    tabSelector: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 50,
        padding: 5,
        width: width * 0.85,
        marginBottom: 30,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    tabTextActive: {
        color: '#000',
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: '500',
    },
    input: {
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    },
    inputOutline: {
        borderRadius: 10,
        borderWidth: 0,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 40,
    },
});

export default AccountAccessScreen;