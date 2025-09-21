import { useFinancial } from "@/shared/contexts/financial/FinancialContext";
import { formatCurrency } from "@/shared/helpers/formatCurrency";
import { SkeletonText } from "@/shared/ui/Skeleton/SkeletonText";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { BytebankButton } from "../../ui/Button";

export const BalanceResume = ({ showMinified = false }) => {
    const { balanceValue, isLoadingBalance, isBalanceVisible, setBalanceVisible } = useFinancial();

    return (
        <View style={{ padding: 10, minHeight: 100, display: 'flex', justifyContent: 'flex-start', gap: 15 }}>
            {!showMinified ? <Text style={{ fontSize: 16, fontWeight: '500' }}>Conta</Text> : null}
            <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontWeight: '500', fontSize: 22, marginBottom: 5 }}>Saldo em conta</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 30 }}>
                        {isLoadingBalance ? <SkeletonText style={{ width: '70%', height: 30 }} /> : (isBalanceVisible ? `${formatCurrency(balanceValue)}` : "••••••")}
                    </Text>
                </View>
                <View>
                    <Text>
                        <Feather
                            name={isBalanceVisible ? "eye" : "eye-off"}
                            size={28}
                            color="black"
                            onPress={() => setBalanceVisible(!isBalanceVisible)}
                        />
                    </Text>
                </View>
            </View>
            {!showMinified ? (<BytebankButton color={"secondary"} styles={{ backgroundColor: '#000' }} labelStyles={{ color: 'white' }} onPress={() => router.navigate('/(protected)/transactions')}>Ver extrato completo</BytebankButton>) : null}
        </View>
    );
}