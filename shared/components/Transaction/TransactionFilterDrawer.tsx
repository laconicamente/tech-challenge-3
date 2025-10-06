import { datePickerTheme } from '@/shared/classes/constants/Colors';
import { TransactionFilter } from '@/shared/classes/models/transaction';
import { parseCurrencyToNumber } from '@/shared/helpers/formatCurrency';
import { useCategories } from '@/shared/hooks/useCategories';
import { useMethods } from '@/shared/hooks/useMethods';
import { BytebankDrawer } from '@/shared/ui/Drawer';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import { BytebankSelectController } from '@/shared/ui/Select/SelectController';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

interface TransactionFilterDrawerProps {
    visible: boolean;
    onDismiss: () => void;
    onApplyFilter: (filters: TransactionFilter) => void;
}

export const TransactionFilterDrawer = ({
    visible,
    onDismiss,
    onApplyFilter,
}: TransactionFilterDrawerProps) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
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

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
    const onDateDismiss = () => setIsDatePickerVisible(false);
    const onDateConfirm = ({ startDate, endDate }: { startDate: string, endDate: string }) => {
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

    const handleApplyFilter = (data: { methodId: string; categoryId: string; startDate: string; endDate: string; minValue: string; maxValue: string; }) => {
        const filterData: TransactionFilter = {
            ...data,
            minValue: data.minValue ? parseCurrencyToNumber(data.minValue) * 100 : undefined,
            maxValue: data.maxValue ? parseCurrencyToNumber(data.maxValue) * 100 : undefined,
        };
        onApplyFilter(filterData);
        onDismiss();
    };

    return (
        <BytebankDrawer title='Filtros' confirmLabel='Filtrar' cancelLabel='Limpar' onDismiss={onDismiss} onCancel={handleClearFilters} onSubmit={handleSubmit(handleApplyFilter)} visible={visible}>
            <FormProvider {...formMethods}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionLabel}>Período</Text>
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} >
                        <View style={{ alignItems: 'flex-end', width: '100%' }}>
                            {watch('startDate') ? <Text style={{ fontWeight: 400, justifyContent: 'flex-end' }} >
                                {`${formatDate(watch('startDate'))} - ${formatDate(watch('endDate'))}`}
                            </Text> : <Text style={{ fontWeight: 'bold', justifyContent: 'flex-end' }} >Adicionar período</Text>}
                        </View>
                    </TouchableOpacity>
                    {watch('startDate') && <View style={{ alignItems: 'flex-end', width: '100%' }}>
                        <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} >
                            <Text style={{ fontWeight: 'bold', justifyContent: 'flex-end' }} >
                                Alterar período
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>
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
                    ) : (<SkeletonText style={{ height: 30 }} />)}
                <Text style={styles.sectionLabel}>Categoria</Text>

                {categories && categories.length > 0 ?
                    (<BytebankSelectController
                        name={"categoryId"}
                        label="Selecione a categoria"
                        items={categories.filter(c => c.id).map(c => ({ label: c.name, value: c.id! }))}
                        placeholder="Selecione a categoria"
                    />
                    ) : (<SkeletonText style={{ height: 30 }} />)}
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
        </BytebankDrawer>
    );
};

const styles = StyleSheet.create({
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
});