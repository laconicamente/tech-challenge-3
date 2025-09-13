import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import Logo from '../../assets/images/logo.svg';

export const AppHeader = ({ title }: { title: string }) => {
      const theme = useTheme();
    
    const handleLogout = () => {      
      Alert.alert("Sair", "Você tem certeza que deseja sair da aplicação?", [
        { text: "Cancelar" },
        { text: "Sair", onPress: () => {
          router.replace('/account-access')
        }}
      ]);
    };

    return (
      <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#d0d0d078',
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}>
        <Logo width={130} height={30} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{title}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color={theme.colors.shadow} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    );
  };