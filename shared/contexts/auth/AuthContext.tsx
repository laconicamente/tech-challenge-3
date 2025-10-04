import { auth, firestore } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
    isAuthenticated: boolean;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUserDoc = async (currentUser: User) => {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...currentUser, ...userData });
        } else {
            setUser(currentUser);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await fetchUserDoc(currentUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
            setIsAuthenticated(!!currentUser);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Erro de login:", error);
            return false;
        }
    };

    const signUp = async (name: string, email: string, password: string): Promise<void> => {
        try {
            const createdUser = await createUserWithEmailAndPassword(auth, email, password);

            if (createdUser.user) {
                await updateProfile(createdUser.user, { displayName: name });

                await setDoc(
                    doc(firestore, 'users', createdUser.user.uid),
                    {
                        uid: createdUser.user.uid,
                        name,
                        email: createdUser.user.email,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                );

            }
        } catch (error) {
            console.error("Erro de cadastro:", error);
            throw error;
        }
    };

    const reloadUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.reload();
            const refreshedUser = auth.currentUser;
            if (refreshedUser) {
                await fetchUserDoc(refreshedUser);
            }
        }
    };

    const logout = async (): Promise<void> => {
        await signOut(auth);
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Usuário não autenticado.");

            if (currentUser) {
                await updateProfile(currentUser, userData);
            }

            await setDoc(
                doc(firestore, 'users', currentUser.uid), userData,
                { merge: true }
            );

            await reloadUser();
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    };

    const value = { user, isLoading, login, signUp, logout, updateUser, isAuthenticated, reloadUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('O hook useAuth() deve ser usado dentro de um AuthProvider.');
    }
    return context;
};