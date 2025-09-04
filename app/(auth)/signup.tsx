import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { TextInput, Text, useTheme, Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';

export default function Signup() {
    const theme = useTheme();
    const { signUp } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: theme.colors.background }}>
            <Text variant={'headlineMedium'} style={{ marginBottom: 16 }}>Crie uma conta</Text>

            <TextInput
                placeholder="Digite seu nome"
                label={'Nome'}
                mode='outlined'
                style={{  marginBottom: 16 }}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="Digite seu e-mail"
                label={'E-mail'}
                mode='outlined'
                style={{ marginBottom: 16}}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={{ marginBottom: 16 }}
                value={password}
                onChangeText={setPassword}
            />

            <Button mode={'contained'} onPress={() => {
                signUp(name, email, password)
                router.replace('/login')

            }}>Criar conta</Button>
            <Link href="/login" style={{ marginTop: 16 }}>Already have an account? Log in</Link>
        </ThemedView>
    );
}