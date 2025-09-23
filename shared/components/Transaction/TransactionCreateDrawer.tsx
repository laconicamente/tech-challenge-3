import { datePickerTheme } from "@/shared/classes/constants/Colors";
import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { formatDate, toDateFromFirestore } from "@/shared/helpers/formatDate";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Modal from 'react-native-modal';
import { Divider, PaperProvider, Portal } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { TransactionItemProps, TransactionType } from "../../classes/models/transaction";
import { useFinancial } from "../../contexts/financial/FinancialContext";
import { parseCurrencyToNumber } from "../../helpers/formatCurrency";
import { useBottomSheetAnimation } from "../../hooks/useBottomSheetAnimation";
import { useBottomSheetHandler } from "../../hooks/useBottomSheetHandler";
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
    const [isInteracting, setIsInteracting] = useState(false);

    const formMethods = useForm({
        mode: "onChange",
        defaultValues: {
            methodId: transaction?.methodId || "",
            categoryId: transaction?.categoryId || "",
            createdAt: transaction?.createdAt || "",
            value: transaction?.value || "",
            type: transactionType,
            fileUrl: "",
        },
    });
    const { setValue, reset, control, handleSubmit, watch, formState: { errors } } = formMethods;

    useEffect(() => {
        if (transaction) {
            setTransactionType(transaction.type);
            setTitle("Editar transação");
            reset({
                methodId: transaction.methodId || "",
                categoryId: transaction.categoryId || "",
                createdAt: transaction.createdAt ? toDateFromFirestore(transaction.createdAt) : "",
                value: transaction.value ? String(Number(transaction.value)) : "",
                type: transaction.type,
                fileUrl: transaction.fileUrl || "",
            });
        } else {
            reset({
                methodId: "",
                categoryId: "",
                createdAt: "",
                value: "",
                type: "income",
                fileUrl: "",
            });
            setTransactionType("income");
            setTitle("Nova transação");
        }
    }, [transaction, reset]);

    const pan = useRef(new Animated.ValueXY()).current;
    const gestureHandler = useBottomSheetHandler(pan, onDismiss);

    const slideAnim = useRef(new Animated.Value(height)).current;
    useBottomSheetAnimation(visible, slideAnim, pan);

    const resetSettings = (type: TransactionType = 'income') => {
        reset({
            methodId: "",
            categoryId: "",
            createdAt: "",
            value: "",
            type,
            fileUrl: ""
        })
    }

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
            const newTransaction = { ...data, value: parseCurrencyToNumber(data.value) * 100, userId: user.uid };
            if (transaction?.id) {
                editTransaction?.(transaction?.id, newTransaction);
            } else {
                addTransaction?.(newTransaction);
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
    const onDateConfirm = (params: { date: string }) => {
        const { date: createdAt } = params;
        setIsDatePickerVisible(false);
        if (createdAt) {
            setValue('createdAt', createdAt, { shouldDirty: true });
        }
    };

    return (
        <Portal>
            <Modal
                isVisible={visible}
                onDismiss={onDismiss}
                style={styles.modal}
                onBackdropPress={onDismiss}
                onBackButtonPress={onDismiss}
                backdropTransitionOutTiming={0}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={300}
                animationOutTiming={300}
                avoidKeyboard={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                        onTabChange={handleTabChange}
                                    />
                                    {methods && methods.length > 0 ?
                                        (<BytebankSelectController
                                            name={"methodId"}
                                            label="Selecione o tipo da transação"
                                            items={methods.map(c => ({ label: c.name, value: c.id }))}
                                            placeholder="Selecione o tipo da transação"
                                            onOpen={() => setIsInteracting(true)}
                                            onClose={() => setIsInteracting(false)} />
                                        ) : (null)}
                                    <View style={{ marginVertical: 15 }}>

                                        <Text style={{ marginLeft: 10, marginBottom: 5 }}>Data da transação</Text>
                                        <BytebankButton
                                            mode="outlined"
                                            color="primary"
                                            onPress={() => setIsDatePickerVisible(true)}
                                            styles={{ backgroundColor: ColorsPalette.light['lime.900'], padding: 5, borderRadius: 10 }}
                                            labelStyles={{ color: ColorsPalette.light['lime.50'], fontSize: 16 }}
                                        >
                                            {watch('createdAt')
                                                ? `${formatDate(watch('createdAt'))}`
                                                : 'Adicionar data'}
                                        </BytebankButton>
                                        <PaperProvider theme={datePickerTheme}>
                                            <DatePickerModal
                                                locale="pt-BR"
                                                mode="single"
                                                visible={isDatePickerVisible}
                                                onDismiss={onDateDismiss}
                                                onConfirm={onDateConfirm}
                                                startDate={watch('createdAt') as unknown as CalendarDate}
                                                label="Selecione uma data"
                                                startLabel="Data da transação"
                                                saveLabel="Selecionar"
                                            />
                                        </PaperProvider>
                                    </View>
                                    <BytebankInputController
                                        type='text'
                                        name="value"
                                        label="Valor"
                                        placeholder="R$ 0,00"
                                        maskType="currency"
                                        rules={{ required: "Valor obrigatório" }}
                                        keyboardType="number-pad"
                                        onPress={() => setIsInteracting(true)}
                                    />
                                    {categories && categories.length > 0 && (
                                        <BytebankSelectController
                                            name="categoryId"
                                            label="Selecione uma categoria"
                                            items={categories.map(c => ({ label: c.name, value: c.id }))}
                                            placeholder="Selecione uma categoria"
                                            onOpen={() => setIsInteracting(true)}
                                            onClose={() => setIsInteracting(false)}
                                        />
                                    )}
                                    <View style={{ marginBottom: 10 }}>
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
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    "Concluir"
                                )}
                            </BytebankButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
