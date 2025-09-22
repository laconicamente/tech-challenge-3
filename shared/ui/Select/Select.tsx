import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type SelectOption = {
    label: string;
    value: string;
};

interface BytebankSelectProps extends Partial<PickerSelectProps> {
    label: string;
    value?: string;
    items: SelectOption[];
    onSelect: ((value?: string) => void);
    placeholder?: string;
}

export const BytebankSelect = ({
    label,
    value,
    items,
    onSelect,
    onOpen,
    onClose,
    placeholder,
}: BytebankSelectProps) => {

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <RNPickerSelect
            onOpen={onOpen}
            onClose={onClose}
                style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    iconContainer: {
                        top: 10,
                        right: 10,
                    },
                }}
                onValueChange={(value) => onSelect(value)}
                items={items.map((item) => ({
                    label: item.label,
                    value: item.value,
                    key: item.value,
                }))}
                placeholder={
                    placeholder
                        ? { label: placeholder, value: null, color: '#333' }
                        : {}
                }
                value={value}
                useNativeAndroidPickerStyle={false}
                doneText='Selecionar'
                fixAndroidTouchableBug={true}
                Icon={() => {
                    return <MaterialIcons name={'keyboard-arrow-down'} size={30} color="gray" />;
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
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
        paddingHorizontal: 15,
        width: '100%'
    },
    inputOutline: {
        borderRadius: 10,
        borderWidth: 0,
    },
});