
// shared/auth/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Importe a instância do auth

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Observa mudanças no estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
            setIsAuthenticated(!!currentUser);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true; // Login bem-sucedido
        } catch (error) {
            console.error("Erro de login:", error);
            return false; // Login falhou
        }
    };

    const signUp = async (name: string, email: string, password: string): Promise<void> => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Opcional: Atualizar o perfil do usuário com o nome
            // await updateProfile(auth.currentUser, { displayName: name });
        } catch (error) {
            console.error("Erro de cadastro:", error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        await signOut(auth);
    };

    const value = {
        user,
        isLoading,
        login,
        signUp,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};