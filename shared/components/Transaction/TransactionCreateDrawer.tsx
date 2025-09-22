import { firestore } from "@/firebaseConfig";
import { datePickerTheme } from "@/shared/classes/constants/Colors";
import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Card, Divider, Modal, PaperProvider, Portal } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
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
    onDismiss: () => void;
}

const TransactionCreateDrawer: React.FC<TransactionCreateDrawerProps> = ({
    visible,
    onDismiss,
}) => {
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const [transactionType, setTransactionType] = useState<TransactionType>("income");
    const { user } = useAuth();
    const { refetch, refetchBalanceValue } = useFinancial();
    const { categories } = useCategories(transactionType);
    const { methods } = useMethods(transactionType);
    const [isLoading, setIsLoading] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const formMethods = useForm({
        mode: "onChange",
        defaultValues: {
            methodId: "",
            categoryId: "",
            createdAt: "",
            value: "",
            type: transactionType,
            fileUrl: null,
        },
    });
    const { setValue, reset, control, handleSubmit, watch, formState: { errors } } = formMethods;

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
            fileUrl: null
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
            const newTransaction = { ...data, value: parseCurrencyToNumber(data.value), userId: user.uid };
            const docRef = await addDoc(
                collection(firestore, "transactions"),
                newTransaction
            );
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
    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <Animated.View
                    style={[
                        styles.animatedView,
                        { transform: [{ translateY: slideAnim }, { translateY: pan.y }] },
                    ]}
                    {...(!isInteracting ? gestureHandler.panHandlers : {})}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <SafeAreaView edges={["bottom"]}>
                                <FormProvider {...formMethods}>
                                    <Card style={styles.card}>
                                        <View style={styles.dragHandle} />
                                        <View style={styles.header}>
                                            <Text style={styles.title}>Nova transação</Text>
                                        </View>
                                        <Divider />
                                        <ScrollView keyboardShouldPersistTaps="handled">
                                            <View style={{ display: "flex", gap: 0 }}>
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
                                                        label="Selecione o período"
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
                                                    keyboardType="numeric"
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
                                                    <ActivityIndicator color="#999" />
                                                ) : (
                                                    "Concluir"
                                                )}
                                            </BytebankButton>
                                        </View>
                                    </Card>
                                </FormProvider>
                            </SafeAreaView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Animated.View>
            </Modal>
            <FeedbackAnimation />
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "flex-end",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 3,
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
