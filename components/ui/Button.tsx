import { StyleSheet } from "react-native";
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
}

export function BytebankButton({
    color,
    variant = 'contained',
    borderRadius,
    onPress,
    children
}: BytebankButtonProps) {
    const theme = useTheme();

    return (
        <Button
            mode={variant}
            buttonColor={theme.colors[color]}
            onPress={onPress}
            style={[styles.button, borderRadius ? { borderRadius: Number(borderRadius) } : {}]}
            labelStyle={styles.buttonText}
        >
            {children}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
