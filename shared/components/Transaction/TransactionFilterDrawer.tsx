import { datePickerTheme } from '@/shared/classes/constants/Colors';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { TransactionFilter } from '@/shared/classes/models/transaction';
import { parseCurrencyToNumber } from '@/shared/helpers/formatCurrency';
import { useCategories } from '@/shared/hooks/useCategories';
import { useMethods } from '@/shared/hooks/useMethods';
import { BytebankButton } from '@/shared/ui/Button';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import { BytebankSelectController } from '@/shared/ui/Select/SelectController';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaperProvider, Portal } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TransactionFilterDrawerProps {
    visible: boolean;
    onDismiss: () => void;
    onApplyFilter: (filters: TransactionFilter) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const TransactionFilterDrawer = ({
    visible,
    onDismiss,
    onApplyFilter,
}: TransactionFilterDrawerProps) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const [mounted, setMounted] = useState(visible);
    const { categories } = useCategories();
    const { methods } = useMethods();

    const formMethods = useForm({
        mode: "onChange",
        defaultValues: {
            methodId: "",
            categoryId: "",
            startDate: "",
            endDate: "",
            minValue: "",
            maxValue: "",
        },
    });
    const { setValue, reset, watch, control, handleSubmit, formState: { errors } } = formMethods;

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

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
    const onDateDismiss = () => setIsDatePickerVisible(false);
    const onDateConfirm = ({ startDate, endDate }: { startDate: string, endDate: string}) => {
        setIsDatePickerVisible(false);
        setValue('startDate', startDate, { shouldDirty: true });
        setValue('endDate', endDate, { shouldDirty: true });
    };

    const handleClearFilters = () => {
        reset({
            methodId: "",
            categoryId: "",
            startDate: "",
            endDate: "",
            minValue: "",
            maxValue: "",
        });
        onApplyFilter({});
        onDismiss();
    };

    const handleApplyFilter = (data: TransactionFilter) => {
        const filterData = { ...data, ...{ minValue: data.minValue ? parseCurrencyToNumber(data.minValue) : undefined, maxValue: data.maxValue ? parseCurrencyToNumber(data.maxValue) : undefined } };
        onApplyFilter(filterData);
        onDismiss();
    };

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
                        <Text style={styles.headerTitle}>Filtros</Text>
                        <TouchableOpacity onPress={onDismiss}>
                            <MaterialIcons name="close" size={28} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <FormProvider {...formMethods}>
                            <Text style={styles.sectionLabel}>Período</Text>
                            <BytebankButton
                                mode="outlined"
                                color="primary"
                                onPress={() => setIsDatePickerVisible(true)}
                                style={{ marginBottom: 12 }}
                                styles={{ backgroundColor: ColorsPalette.light['lime.900'], padding: 5, borderRadius: 10 }}
                                labelStyles={{ color: ColorsPalette.light['lime.50'], fontSize: 16 }}
                            >
                                {watch('startDate')
                                    ? `${formatDate(watch('startDate'))} - ${formatDate(watch('endDate'))}`
                                    : 'Adicionar datas'}
                            </BytebankButton>
                            <PaperProvider theme={datePickerTheme}>
                            <DatePickerModal
                                locale="pt-BR"
                                mode="range"
                                visible={isDatePickerVisible}
                                onDismiss={onDateDismiss}
                                onConfirm={onDateConfirm}
                                startDate={watch('startDate') as unknown as CalendarDate}
                                endDate={watch('endDate') as unknown as CalendarDate}
                                label="Selecione o período"
                                startLabel="Data inicial"
                                endLabel="Data final"
                                saveLabel="Aplicar"
                            />
                            </PaperProvider>
                            <Text style={styles.sectionLabel}>Tipo de transação</Text>
                            {methods && methods.length > 0 ?
                                (<BytebankSelectController
                                    name={"methodId"}
                                    label="Selecione o tipo da transação"
                                    items={methods.map(c => ({ label: c.name, value: c.id }))}
                                    placeholder="Selecione o tipo da transação"
                                />
                                ) : (<SkeletonText style={{height:30}}/>)}
                            <Text style={styles.sectionLabel}>Categoria</Text>

                            {categories && categories.length > 0 ?
                                (<BytebankSelectController
                                    name={"categoryId"}
                                    label="Selecione a categoria"
                                    items={categories.map(c => ({ label: c.name, value: c.id }))}
                                    placeholder="Selecione a categoria"
                                />
                                ) : (<SkeletonText style={{height:30}} />)}
                            <Text style={styles.sectionLabel}>Valores</Text>
                            <View style={styles.amountContainer}>
                                <View style={styles.amount}>
                                    <BytebankInputController
                                        label="Valor Mínimo"
                                        placeholder="R$ 0,00"
                                        maskType="currency"
                                        name="minValue"
                                    />
                                </View>
                                <View style={styles.amount}>
                                    <BytebankInputController
                                        label="Valor Máximo"
                                        placeholder="R$ 0,00"
                                        maskType="currency"
                                        name="maxValue"
                                    />
                                </View>
                            </View>
                        </FormProvider>
                    </ScrollView>

                    <View style={styles.footerButtons}>
                        <BytebankButton
                            onPress={handleClearFilters}
                            mode="contained-tonal"
                            color="tertiary"
                            style={styles.footerBtn}
                            styles={{ backgroundColor: '#FFF' }}
                        >
                            Limpar
                        </BytebankButton>
                        <BytebankButton
                            onPress={handleSubmit(handleApplyFilter)}
                            mode="contained"
                            color="primary"
                            style={styles.footerBtn}
                        >
                            Filtrar
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
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 16,
        color: '#333',
    },
    amountContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    amount: {
        flex: 1,
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