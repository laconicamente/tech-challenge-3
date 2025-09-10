import { BytebankButton } from "../ui/Button";
import { BytebankCard } from "../ui/Card";
import { ColorsPalette } from "@/constants/Pallete";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Text } from "react-native";

export const CardBalance = () => {
    const palette = ColorsPalette.light;
    const cardColor = palette["background.gradient"];
    const [showBalance, setShowBalance] = useState(false);

    return (
        <BytebankCard bgcolor={cardColor} radius="lg" mode="contained">
            <LinearGradient
                colors={['#d4eb61', '#e3fd60', '#cae85f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 10, minHeight: 100 }}
            >

                <View style={{ padding: 10, minHeight: 100, display: 'flex', justifyContent: 'flex-start', gap: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Conta</Text>
                    <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: '500', fontSize: 22 }}>Saldo em conta</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 30 }}>
                                {showBalance ? "R$ 100,50" : "••••••"}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                <Feather
                                    name={showBalance ? "eye" : "eye-off"}
                                    size={28}
                                    color="black"
                                    onPress={() => setShowBalance(!showBalance)}
                                />
                            </Text>
                        </View>
                    </View>
                    <BytebankButton color={"secondary"} styles={{ backgroundColor: '#000'}} labelStyles={{ color: 'white' }}>Ver extrato completo</BytebankButton>
                </View>
            </LinearGradient>
        </BytebankCard>
    );
}