import { Animated, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Button, ButtonProps, useTheme } from "react-native-paper";


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
    labelStyles = {}
}: BytebankButtonProps) {
    const theme = useTheme();

    return (
        <Button
            mode={variant}
            buttonColor={theme.colors[color]}
            onPress={onPress}
            style={{ 
                ...buttonStyles.button, 
                ...(styles && typeof styles === 'object' ? styles : {}), 
                ...(borderRadius ? { borderRadius: Number(borderRadius) } : {}) 
            }}
            labelStyle={{ 
                ...buttonStyles.buttonText, 
                ...(labelStyles && typeof labelStyles === 'object' ? labelStyles : {}) 
            }}
        >
            {children}
        </Button>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        borderRadius: 30,
        padding: 10
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        display: 'flex',
    },
});
