import { Link } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';

export default function Login() {
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const theme = useTheme();


    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: theme.colors.background }}>
            <Text variant={'headlineMedium'} style={{ marginBottom: 16 }}>Login</Text>
            <TextInput
                placeholder="Digite seu e-mail"
                label={'E-mail'}
                mode='outlined'
                style={{ marginBottom: 16 }}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Digite sua senha"
                label={'Senha'}
                mode='outlined'
                secureTextEntry
                style={{ marginBottom: 16 }}
                value={password}
                onChangeText={setPassword}
            />

            <Button mode="contained" labelStyle={{ color: theme.colors.surface }} onPress={() => {

                const isAuthenticated = login(email, password)
                if (isAuthenticated) {
                    router.replace('/(protected)/profile')
                }

            }}> Login</Button>
            <Link href="/signup" style={{ marginTop: 16 }}>Não tem uma conta? Crie uma agora!</Link>
        </ThemedView>
    );
}