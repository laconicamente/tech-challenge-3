import React, { useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    Animated,
    Dimensions,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, Portal, Card, Divider } from "react-native-paper";
import { BytebankButton } from "../ui/Button";
import { BytebankTabSelector } from "../ui/TabSelector";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { router } from "expo-router";
import { useBottomSheetHandler } from "../hooks/useBottomSheetHandler";
import { useBottomSheetAnimation } from "../hooks/useBottomSheetAnimation";
import { FileUploadButton } from "../ui/FileUploadButton";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { BytebankInputController } from "../ui/Input/InputController";
import { BytebankSelectController } from "../ui/Select/SelectController";
import { useFeedbackAnimation } from "../hooks/useFeedbackAnimation";

const height = Dimensions.get("window").height;

interface CreateTransactionModalProps {
    visible: boolean;
    onDismiss: () => void;
    onFinished: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
    visible,
    onDismiss,
    onFinished,
}) => {
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const { user } = useAuth();
    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            methodId: "",
            categoryId: "",
            createdAt: "",
            value: "",
            type: "income",
            fileUrl: null,
        },
    });
    const { setValue, reset, control, handleSubmit, formState: { errors } } = methods;


    const [transactionType, setTransactionType] = useState("income");

    const [isLoading, setIsLoading] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const pan = useRef(new Animated.ValueXY()).current;
    const gestureHandler = useBottomSheetHandler(pan, onDismiss);

    const slideAnim = useRef(new Animated.Value(height)).current;
    useBottomSheetAnimation(visible, slideAnim, pan);

    const transactionCategories = [
        { label: "Pix", value: "pix" },
        { label: "Boleto bancário", value: "boleto" },
        { label: "Transferência bancária", value: "transferencia" },
        { label: "Dinheiro em espécie", value: "dinheiro" },
    ];

    const handleTabChange = (name: string) => {
        setTransactionType(name);
        setValue("type", name);
        reset({
            methodId: "",
            categoryId: "",
            createdAt: "",
            value: "",
            type: name,
            fileUrl: null
        })
    }

    const onSubmit = async (data: any) => {
        console.log(data);
        if (!user) {
            Alert.alert("Ocorreu um erro", "Usuário não autenticado.");
            router.replace("/(auth)/account-access");
            return;
        }

        setIsLoading(true);
        try {
            const newTransaction = { ...data };
            const docRef = await addDoc(
                collection(firestore, "transactions"),
                newTransaction
            );
            console.log("Transação adicionada com ID: ", docRef.id);
            showFeedback("success");
            onFinished();
            onDismiss();
        } catch (error) {
            console.error("Erro ao adicionar transação: ", error);
            Alert.alert(
                "Ocorreu um erro",
                "Não foi possível salvar a transação. Tente novamente por favor."
            );
        } finally {
            setIsLoading(false);
        }
    };

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
                                <FormProvider {...methods}>
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

                                                <BytebankSelectController
                                                    name={"methodId"}
                                                    label="Selecione o tipo da transação"
                                                    items={transactionCategories}
                                                    placeholder="Selecione o tipo da transação"
                                                    onOpen={() => setIsInteracting(true)}
                                                    onClose={() => setIsInteracting(false)} />
                                                <BytebankInputController
                                                    type='text'
                                                    name="createdAt"
                                                    label="Data da transação"
                                                    placeholder="DD/MM/AAAA"
                                                    maskType="date"
                                                    rules={{ required: "Data obrigatória" }}
                                                />
                                                <BytebankInputController
                                                    type='text'
                                                    name="value"
                                                    label="Valor"
                                                    placeholder="R$ 0,00"
                                                    maskType="currency"
                                                    rules={{ required: "Valor obrigatório" }}
                                                    keyboardType="numeric"
                                                />
                                                <BytebankSelectController
                                                    name={"categoryId"}
                                                    label="Selecione uma categoria"
                                                    items={transactionCategories}
                                                    placeholder="Selecione uma categoria"
                                                    onOpen={() => setIsInteracting(true)}
                                                    onClose={() => setIsInteracting(false)}
                                                />
                                                <View style={{ marginBottom: 10 }}>
                                                    <Controller
                                                        name="fileUrl"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FileUploadButton label='Adicionar comprovante' onFinished={(v) => { field.onChange(v); console.log('Upload finalizado', v); }} />
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
        height: "100%",
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

export default CreateTransactionModal;
