import { BytebankButton } from '@/shared/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BytebankrDrawerProps {
    title: string;
    visible: boolean;
    onDismiss: () => void;
    onCancel: () => void;
    onSubmit: () => void;
    children?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const BytebankDrawer = ({
    title,
    visible,
    onDismiss,
    onCancel,
    onSubmit,
    confirmLabel = "Salvar",
    cancelLabel = "Cancelar",
    children,
}: BytebankrDrawerProps) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const [mounted, setMounted] = useState(visible);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 260,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();

        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_WIDTH,
                duration: 220,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setMounted(false);
            });
        }
    }, [visible, slideAnim]);

    if (!mounted) return null;

    return (
        <Portal>
            <View style={styles.root} pointerEvents="box-none">
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.backdrop, { opacity: visible ? 1 : 0 }]}
                    onPress={onDismiss}
                />
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <SafeAreaView />
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <TouchableOpacity onPress={onDismiss}>
                            <MaterialIcons name="close" size={28} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>

                    <View style={styles.footerButtons}>
                        <BytebankButton
                            onPress={onCancel}
                            mode="contained-tonal"
                            color="tertiary"
                            style={styles.footerBtn}
                            styles={{ backgroundColor: '#FFF' }}
                        >
                            {cancelLabel}
                        </BytebankButton>
                        <BytebankButton
                            onPress={onSubmit}
                            mode="contained"
                            color="primary"
                            style={styles.footerBtn}
                        >
                            {confirmLabel}
                        </BytebankButton>
                    </View>
                </Animated.View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '92%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 40,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: -4, height: 0 },
        shadowRadius: 12,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
    },
    footerBtn: {
        flex: 1,
    },
});