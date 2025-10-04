import { Animated, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Button, ButtonProps, useTheme } from "react-native-paper";
import { ColorsPalette } from "../classes/constants/Pallete";


export interface BytebankButtonProps extends ButtonProps {
    color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    borderRadius?: string;
    variant?: 'contained' | 'text' | 'outlined';
    onPress?: () => void;
    styles?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    labelStyles?:  StyleProp<TextStyle>;
}

export function BytebankButton({
    color,
    variant = 'contained',
    borderRadius,
    onPress,
    children,
    styles = {},
    labelStyles = {},
    disabled
}: BytebankButtonProps) {
    const theme = useTheme();

    return (
        <Button
            mode={variant}
            buttonColor={theme.colors[color]}
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
            style={{ 
                ...buttonStyles.button, 
                ...(styles && typeof styles === 'object' ? styles : {}), 
                ...(borderRadius ? { borderRadius: Number(borderRadius) } : {}),
                ...(disabled ? { backgroundColor: ColorsPalette.light['grey.200'] } : {})
            }}
            labelStyle={{ 
                ...buttonStyles.buttonText, 
                ...(labelStyles && typeof labelStyles === 'object' ? labelStyles : {}),
                ...(disabled ? { color: ColorsPalette.light['grey.500'] } : {})
            }}
        >
            {children}
        </Button>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        borderRadius: 30,
    },
    buttonText: {
        color: ColorsPalette.light['lime.800'],
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
        padding: 8
    },
});
