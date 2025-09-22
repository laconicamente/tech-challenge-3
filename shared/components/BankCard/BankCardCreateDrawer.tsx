import { firestore } from '@/firebaseConfig';
import { BankCardProps, CardFlag } from '@/shared/classes/models/bank-card';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { BytebankDrawer } from '@/shared/ui/Drawer';
import { BytebankInputController } from '@/shared/ui/Input/InputController';
import { BytebankSelectController } from '@/shared/ui/Select/SelectController';
import { SkeletonText } from '@/shared/ui/Skeleton/SkeletonText';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

interface BankCardCreateDrawerProps {
    visible: boolean;
    onDismiss: () => void;
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
            flag: CardFlag.Visa
        },
    });
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    const [isLoading, setIsLoading] = useState(false);

    const { reset, handleSubmit, formState: { errors } } = formMethods;

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
            flag: CardFlag.Visa
        });
        onDismiss();
    };

    const handleCreateCard = async (data: BankCardProps) => {
        const cardData: BankCardProps = { ...data };
        setIsLoading(true);
        try {
            await addDoc(
                collection(firestore, "cards"),
                cardData
            );
            showFeedback("success");
            onDismiss();
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
            <BytebankDrawer title='Adicionar cartão' confirmLabel='Salvar' onDismiss={onDismiss} onCancel={handleClearForm} onSubmit={handleSubmit(handleCreateCard)} visible={visible}>
                <FormProvider {...formMethods} >
                    <View style={styles.sectionInput}>
                        {types.length > 0 ?
                            (<BytebankSelectController
                                name={"methodId"}
                                label="Selecione o tipo do cartão"
                                items={types.map(type => ({ label: type, value: type }))}
                                placeholder="Selecione o tipo do cartão"
                            />
                            ) : (<SkeletonText style={{ height: 30 }} />)}
                    </View>
                    <View style={styles.sectionInput}>
                        <BytebankInputController
                            label="Apelido do cartão"
                            placeholder="Digite o apelido do cartão"
                            name="name"
                        />
                    </View>
                    <View>
                        <BytebankInputController
                            label="Número do cartão"
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            name="number"
                        />
                    </View>
                    <View style={styles.amountContainer}>
                        <View style={styles.amount}>
                            <BytebankInputController
                                label="Expira em"
                                placeholder="MM/AA"
                                maskType='date'
                                name="expiredAt"
                            />
                        </View>
                        <View style={styles.amount}>
                            <BytebankInputController
                                label="CVV"
                                placeholder="Digite o CVV"
                                name="cvv"
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
    amountContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    amount: {
        flex: 1,
    },
});