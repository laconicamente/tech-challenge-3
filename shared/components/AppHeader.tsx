import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/AntDesign";
import { useAuth } from "../contexts/auth/AuthContext";

export const AppHeader = ({ title = '' }: { title?: string }) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        Alert.alert("Sair", "Você tem certeza que deseja sair da aplicação?", [
            { text: "Cancelar" },
            {
                text: "Sair", onPress: () => {
                    logout().then(() => router.replace('/(auth)/account-access'));
                }
            }
        ]);
    };

    return (
        <SafeAreaView
            edges={['top']}
            style={{
                backgroundColor: ColorsPalette.light['lime.900'],
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 16,
            }}>
                <TouchableOpacity>
                    <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: ColorsPalette.light['lime.200'], borderRadius: 25, width: 50, height: 50}}>
                        <MaterialIcons name="user" size={25} color={ColorsPalette.light['lime.800']} />
                    </View>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: ColorsPalette.light['lime.50'] }}>{title}</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Feather name="log-out" size={24} color={ColorsPalette.light['lime.50']} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};