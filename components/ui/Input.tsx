import React, { useId } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, TextInputProps, useTheme } from "react-native-paper";


export type BytebankInputProps = {
    label: string;
    value?: string;
    type?: string;
    placeholder?: string;
    error?: boolean;
    helperText?: string;
    autoComplete?: string;
    mask?: "currency";
    color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "error"
    | "warning"
    variant?: "contained" | "text" | "outlined";

} & TextInputProps;

export function BytebankInput({
    value,
    label,
    type = "text",
    placeholder,
    error = false,
    helperText = "",
    autoComplete,
    mask,
    color,
    onChangeText,
    ...props
}: BytebankInputProps & TextInputProps) {
    const theme = useTheme();
    const reactId = useId();
    const inputId = `input-${reactId}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
        <View className="bytebank-input">
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                {...props}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={props?.keyboardType}
                mode="outlined"
                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: 'gray', onSurface: 'black' } }}
                aria-describedby={helperId}
                style={styles.input}
                outlineStyle={styles.inputOutline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: '500',
    },
    input: {
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    },
    inputOutline: {
        borderRadius: 10,
        borderWidth: 0,
    },
});
