import { BytebankButton } from "../ui/Button";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

export const BalanceResume = ({showMinified = false}) => {
    const [showBalance, setShowBalance] = useState(false);

    return (
        <View style={{ padding: 10, minHeight: 100, display: 'flex', justifyContent: 'flex-start', gap: 15 }}>
            {!showMinified ? <Text style={{ fontSize: 16, fontWeight: '500' }}>Conta</Text> : null}
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
            {!showMinified ? <BytebankButton color={"secondary"} styles={{ backgroundColor: '#000' }} labelStyles={{ color: 'white' }} onPress={() => router.replace('/(protected)/transactions')}>Ver extrato completo</BytebankButton> : null}
        </View>
    );
}