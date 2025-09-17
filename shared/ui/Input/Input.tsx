import React, { useId } from "react";
import { View, StyleSheet, Text, KeyboardTypeOptions } from "react-native";
import { TextInput, TextInputProps, useTheme } from "react-native-paper";
import MaskInput, { Masks } from 'react-native-mask-input';

export type InputMask = "currency" | "date";

export type BytebankInputProps = {
    label: string;
    value?: string;
    type?: string;
    placeholder?: string;
    error?: boolean;
    helperText?: string;
    autoComplete?: string;
    color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "error"
    | "warning"
    variant?: "contained" | "text" | "outlined";
    maskType?: InputMask;
    onChangeText?: (masked: string, unmasked: string) => void;
} & TextInputProps;

const currencyMask = Masks.BRL_CURRENCY;

const dateMask = Masks.DATE_DDMMYYYY;


export function BytebankInput({
    value,
    label,
    type = "text",
    placeholder,
    error = false,
    helperText = "",
    autoComplete,
    maskType,
    color,
    onChangeText,
    ...props
}: BytebankInputProps & TextInputProps) {
    const theme = useTheme();
    const reactId = useId();
    const inputId = `input-${reactId}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const baseInputStyle = {
        ...styles.input,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    };
    const maskInputStyle = {
        ...baseInputStyle,
        height: 50,
        fontSize: 16,
        paddingHorizontal: 15,
    };

    if (maskType) {
        let mask = maskType === 'currency' ? currencyMask : dateMask;
        let keyboardType: KeyboardTypeOptions = (maskType === 'currency' || maskType === 'date') ? 'numeric' : 'default';

        return (
            <View className="bytebank-input">
                <Text style={styles.inputLabel}>{label}</Text>
                <MaskInput
                    value={value}
                    onChangeText={onChangeText}
                    mask={mask}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    style={maskInputStyle}
                />
            </View>
        );
    }



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
