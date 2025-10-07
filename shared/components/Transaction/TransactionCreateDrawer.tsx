import { datePickerTheme } from "@/shared/classes/constants/Colors";
import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { formatDate, toDateFromFirestore } from "@/shared/helpers/formatDate";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Modal from 'react-native-modal';
import { Divider, PaperProvider, Portal } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { TransactionItemProps, TransactionType } from "../../classes/models/transaction";
import { useFinancial } from "../../contexts/financial/FinancialContext";
import { parseCurrencyToNumber } from "../../helpers/formatCurrency";
import { useCategories } from "../../hooks/useCategories";
import { useFeedbackAnimation } from "../../hooks/useFeedbackAnimation";
import { useMethods } from "../../hooks/useMethods";
import { BytebankButton } from "../../ui/Button";
import { FileUploadButton } from "../../ui/FileUploadButton";
import { BytebankInputController } from "../../ui/Input/InputController";
import { BytebankSelectController } from "../../ui/Select/SelectController";
import { BytebankTabSelector } from "../../ui/TabSelector";

const height = Dimensions.get("window").height;

interface TransactionCreateDrawerProps {
    visible: boolean;
    transaction: TransactionItemProps | null;
    onDismiss: () => void;
}

const TransactionCreateDrawer: React.FC<TransactionCreateDrawerProps> = ({
    visible,
    transaction = null,
    onDismiss,
}) => {
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const [title, setTitle] = useState<string>("");
    const [transactionType, setTransactionType] = useState<TransactionType>(transaction?.type || "income");
    const { user } = useAuth();
    const { refetch, refetchBalanceValue, editTransaction, addTransaction } = useFinancial();
    const { categories } = useCategories(transactionType);
    const { methods } = useMethods(transactionType);
    const [isLoading, setIsLoading] = useState(false);

    const formMethods = useForm({
        mode: "onChange",
        defaultValues: {
            methodId: transaction?.methodId || "",
            categoryId: transaction?.categoryId || "",
            createdAt: transaction?.createdAt || "",
            value: transaction?.value ? String(Number(transaction.value)) : null,
            type: transactionType,
            fileUrl: "",
        },
    });
    const { setValue, reset, control, handleSubmit, formState, watch } = formMethods;
    const { isValid } = formState;

    useEffect(() => {
        if (transaction) {
            setTransactionType(transaction.type);
            setTitle("Editar transação");
            reset({
                methodId: transaction.methodId || "",
                categoryId: transaction.categoryId || "",
                createdAt: transaction.createdAt ? toDateFromFirestore(transaction.createdAt) : "",
                value: transaction.value ? String(Number(transaction.value)) : null,
                type: transaction.type,
                fileUrl: transaction.fileUrl || "",
            });
        } else {
            setTransactionType("income");
            resetSettings(transactionType);
            setTitle("Nova transação");
        }
    }, [transaction, reset]);

    const resetSettings = (type: TransactionType = 'income') => reset({ methodId: "", categoryId: "", createdAt: "", value: "", type, fileUrl: "" });

    const handleTabChange = (type: string) => {
        const transactionType = type as TransactionType;
        setTransactionType(transactionType);
        setValue("type", transactionType);
        resetSettings(transactionType);
    }

    const onSubmit = async (data: TransactionItemProps) => {
        if (!user) {
            Alert.alert("Ocorreu um erro", "Usuário não autenticado.");
            router.replace("/(auth)/account-access");
            return;
        }

        setIsLoading(true);
        try {
        
            const isValueNaN = isNaN(parseFloat(String(data.value)));
            const newTransaction = { ...data, value: !isValueNaN ? transaction?.value ?? data.value : parseCurrencyToNumber(data.value) * 100, userId: user.uid };
            if (transaction?.id) {
                await editTransaction?.(transaction?.id, newTransaction);
            } else {
                await addTransaction?.(newTransaction);
            }

            showFeedback("success");
            onDismiss();
            refetch?.();
            refetchBalanceValue?.();
        } catch (error) {
            console.error("Erro ao adicionar transação: ", error);
            showFeedback("error");
        } finally {
            setIsLoading(false);
            resetSettings(transactionType);
        }
    };

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    const onDateDismiss = () => setIsDatePickerVisible(false);

    return (
        <Portal>
            <Modal
                isVisible={visible}
                onDismiss={onDismiss}
                style={styles.modal}
                onBackdropPress={onDismiss}
                backdropTransitionOutTiming={0}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={100}
                animationOutTiming={0}
                avoidKeyboard={true}
                swipeDirection="down"
                onSwipeComplete={onDismiss}
                propagateSwipe={true}
            >
                <View style={styles.card}>
                    <View style={styles.dragHandle} />
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <Divider />
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ display: 'flex', gap: 0 }}>
                            <FormProvider {...formMethods}>
                                <BytebankTabSelector
                                    tabs={[
                                        { label: "Entrada", name: "income" },
                                        { label: "Saída", name: "expense" },
                                    ]}
                                    activeTab={transactionType}
                                    disabled={transaction !== null}
                                    onTabChange={handleTabChange}
                                />
                                {methods && methods.length > 0 ?
                                    (<BytebankSelectController
                                        name={"methodId"}
                                        label="Tipo da transação"
                                        items={methods.map(c => ({ label: c.name, value: c.id }))}
                                        placeholder="Selecione o tipo da transação"
                                        rules={{ required: "Tipo da transação é obrigatório" }}
                                    />
                                    ) : (null)}
                                <View style={{ marginVertical: 20 }}>
                                    <Controller
                                        name="createdAt"
                                        control={control}
                                        rules={{ required: "Data da transação é obrigatória" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <View>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ marginLeft: 10, fontWeight: 500 }}>Data da transação</Text>
                                                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} >
                                                        <View style={{ alignItems: 'flex-end', width: '100%' }}>
                                                            {field.value ? <Text style={{ fontWeight: 400, justifyContent: 'flex-end' }} >
                                                                {formatDate(field.value)}
                                                            </Text> : <Text style={{ fontWeight: 'bold', justifyContent: 'flex-end' }} >Adicionar data</Text>}
                                                        </View>
                                                    </TouchableOpacity>
                                                    {field.value && <View style={{ alignItems: 'flex-end', width: '100%' }}>
                                                        <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} >
                                                            <Text style={{ fontWeight: 'bold', justifyContent: 'flex-end' }} >
                                                                Alterar data
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>}
                                                </View>
                                                {error?.message ? (
                                                    <Text style={{ color: '#d32f2f', fontSize: 12, marginLeft: 10, marginTop: 2 }}>
                                                        {error.message}
                                                    </Text>
                                                ) : null}
                                                <PaperProvider theme={datePickerTheme}>
                                                    <DatePickerModal
                                                        locale="pt-BR"
                                                        mode="single"
                                                        visible={isDatePickerVisible}
                                                        onDismiss={onDateDismiss}
                                                        onConfirm={({ date }) => {
                                                            setIsDatePickerVisible(false);
                                                            if (date) field.onChange(date);
                                                        }}
                                                        startDate={field.value as unknown as CalendarDate}
                                                        label="Selecione uma data"
                                                        startLabel="Data da transação"
                                                        saveLabel="Selecionar"
                                                    />
                                                </PaperProvider>
                                            </View>
                                        )}
                                    />
                                </View>
                                <BytebankInputController
                                    type='text'
                                    name="value"
                                    label="Valor"
                                    placeholder="R$ 0,00"
                                    maskType="currency"
                                    rules={{
                                        required: "Valor é obrigatório", validate: (v) => {
                                            const num = parseCurrencyToNumber(v);
                                            if (!num || num <= 0) return "O valor deve ser maior que zero";
                                            if (num > 1000000) return "O valor máximo é R$ 1.000.000";
                                            return true;
                                        }
                                    }}
                                    keyboardType="number-pad"
                                />
                                {categories && categories.length > 0 && (
                                    <BytebankSelectController
                                        name="categoryId"
                                        label="Categoria"
                                        items={categories.map(c => ({ label: c.name, value: c.id }))}
                                        placeholder="Selecione uma categoria"
                                        rules={{ required: "Categoria é obrigatória" }}
                                    />
                                )}
                                <View style={{ marginVertical: 20 }}>
                                    <Text style={{ fontWeight: 500, marginLeft: 10 }}>Se preferir, inclua o comprovante da transação: </Text>
                                    <Controller
                                        name="fileUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadButton label={field.value ? 'Comprovante adicionado' : 'Adicionar comprovante'} onFinished={(v) => { field.onChange(v); showFeedback('success'); }} />
                                        )}
                                    />
                                </View>
                            </FormProvider>
                        </View>
                    </ScrollView>
                    <View style={{ paddingVertical: 15 }}>
                        <BytebankButton
                            color="primary"
                            variant="contained"
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading || !isValid}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={ColorsPalette.light['lime.800']} />
                            ) : (
                                "Concluir"
                            )}
                        </BytebankButton>
                    </View>
                </View>
            </Modal>
            <FeedbackAnimation />
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: 'auto',
        zIndex: 999,
    },
    animatedView: {
        width: "100%",
        justifyContent: "flex-end",
    },
    card: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 90,
        width: "100%",
        minHeight: height * 0.9,
        display: "flex",
        alignContent: "space-between",
        flexDirection: "column",
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: "#ccc",
        borderRadius: 5,
        alignSelf: "center",
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
});

export default TransactionCreateDrawer;
