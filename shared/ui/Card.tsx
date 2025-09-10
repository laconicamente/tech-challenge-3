import { ColorsPalette } from "@/constants/Pallete";
import { JSX } from "react";
import { Card } from "react-native-paper";

export interface BytebankCardProps {
    bgcolor?: string;
    radius?: 'sm' | 'md' | 'lg';
    mode?: "elevated" | "outlined" | 'contained' | undefined;
    className?: string;
    children?: React.ReactNode;
    styles?: React.Attributes;
}

export enum BytebankCardRadius {
    sm = '5px',
    md = '10px',
    lg = '14px',
}

export function BytebankCard({
    bgcolor,
    radius = 'md',
    mode = 'outlined',
    children,
    className,
    styles
}: BytebankCardProps): JSX.Element {
    const palette = ColorsPalette.light;
    const cardColor = bgcolor ?? palette["background.card"];

    return (
        <Card
            mode={mode}
            style={{ backgroundColor: cardColor, borderRadius: BytebankCardRadius[radius], ...styles }}
            className={`${className}`}
        >
            {children}
        </Card>
    );
}