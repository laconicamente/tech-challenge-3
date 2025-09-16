import { BytebankCard } from "../../ui/Card";
import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { LinearGradient } from "expo-linear-gradient";
import { BalanceResume } from "./BalanceResume";

export const CardBalance = () => {
    const palette = ColorsPalette.light;
    const cardColor = palette["background.gradient"];

    return (
        <BytebankCard bgcolor={cardColor} radius="lg" mode="contained">
            <LinearGradient
                colors={['#d4eb61', '#e3fd60', '#cae85f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 10, minHeight: 100 }}
            >
                <BalanceResume />
            </LinearGradient>
        </BytebankCard>
    );
}