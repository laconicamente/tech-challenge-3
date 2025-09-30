import { firestore } from '@/firebaseConfig';
import { BankCardFlag, BankCardProps } from '@/shared/classes/models/bank-card';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { BytebankDrawer } from '@/shared/ui/Drawer';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import { BytebankSelectController } from '@/shared/ui/Select/SelectController';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

interface BankCardCreateDrawerProps {
    visible: boolean;
    onDismiss: (value?: boolean) => void;
}

export const BankCardCreateDrawer = ({
    visible,
    onDismiss,
}: BankCardCreateDrawerProps) => {
    const { user } = useAuth();
    const types = ["Platinum", "Gold", "Black"];
    const formMethods = useForm({
        mode: "onChange",
        defaultValues: {
            userId: user?.uid,
            number: "",
            expiredAt: "",
            name: "",
            cvv: null,
            type: types[0],
            blocked: false,
            principal: false,
            flag: BankCardFlag.Visa
        },
    });
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const [isLoading, setIsLoading] = useState(false);

    const { reset, handleSubmit, formState: { errors } } = formMethods;
    const { isValid } = formMethods.formState;

    const handleClearForm = () => {
        reset({
            userId: user?.uid,
            number: "",
            expiredAt: "",
            name: "",
            cvv: null,
            type: types[0],
            blocked: false,
            principal: false,
            flag: BankCardFlag.Visa
        });
        onDismiss(false);
    };

    const handleCreateCard = async (data: BankCardProps) => {
        const cardData: BankCardProps = { ...data, createdAt: serverTimestamp(), };
        setIsLoading(true);
        try {
            await addDoc( collection(firestore, "cards"), cardData);

            showFeedback("success");
            onDismiss(true);
        } catch (error) {
            console.error("Erro ao adicionar cartão: ", error);
            showFeedback("error");
        } finally {
            setIsLoading(false);
            handleClearForm();
        }
    };

    return (
        <>
            <BytebankDrawer title='Adicionar cartão' confirmLabel='Salvar' onDismiss={handleClearForm} onCancel={handleClearForm} onSubmit={handleSubmit(handleCreateCard)} visible={visible} disabled={isLoading || !isValid}>
                <FormProvider {...formMethods} >
                    <View style={styles.sectionInput}>
                        {types.length > 0 ?
                            (<BytebankSelectController
                                name={"type"}
                                label="Selecione o tipo do cartão"
                                items={types.map(type => ({ label: type, value: type }))}
                                placeholder="Selecione o tipo do cartão"
                                rules={{ required: "Tipo do cartão é obrigatório" }}
                            />
                            ) : (<SkeletonText style={{ height: 30 }} />)}
                    </View>
                    <View style={styles.sectionInput}>
                        <BytebankInputController
                            label="Apelido do cartão"
                            placeholder="Digite o apelido do cartão"
                            name="name"
                            rules={{ required: "Apelido do cartão é obrigatório" }}
                        />
                    </View>
                    <View>
                        <BytebankInputController
                            label="Número do cartão"
                            placeholder="XXXX XXXX XXXX XXXX"
                            name="number"
                            keyboardType='number-pad'
                            maskType='card'
                            maxLength={19}
                            rules={{ required: "Número do cartão é obrigatório" }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.input}>
                            <BytebankInputController
                                label="Expira em"
                                placeholder="MM/AA"
                                name="expiredAt"
                                keyboardType='number-pad'
                                maxLength={5}
                                maskType='expiry'
                                rules={{ required: "Data de expiração é obrigatório" }}
                            />
                        </View>
                        <View style={styles.input}>
                            <BytebankInputController
                                label="CVV"
                                placeholder="Digite o CVV"
                                name="cvv"
                                keyboardType='number-pad'
                                maskType='cvv'
                                maxLength={4}
                                secureTextEntry
                                rules={{ required: "CVV é obrigatório" }}
                            />
                        </View>
                    </View>
                </FormProvider>
            </BytebankDrawer>
            <Portal>
                <FeedbackAnimation />
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    sectionInput: {
        marginTop: 16
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    input: {
        flex: 1,
    },
});