import { Animated, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Button, ButtonProps, useTheme } from "react-native-paper";


export interface BytebankButtonProps extends ButtonProps {
    /**
     * A cor do botão
     */
    color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    /**
     * O estilo do botão
     */

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
    labelStyles = {}
}: BytebankButtonProps) {
    const theme = useTheme();

    return (
        <Button
            mode={variant}
            buttonColor={theme.colors[color]}
            onPress={onPress}
            style={{ ...styles, ...buttonStyles.button, ...(borderRadius ? { borderRadius: Number(borderRadius) } : {}) }}
            labelStyle={{ ...buttonStyles.buttonText, ...labelStyles }}
        >
            {children}
        </Button>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        width: '100%',
        borderRadius: 30,
        padding: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
