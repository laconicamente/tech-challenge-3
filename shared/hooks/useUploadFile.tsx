import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { Alert } from "react-native";
import { ProgressBar } from "react-native-paper";

const handleUploadFile = async (type: 'image' | 'file') => {
    if (type === 'image') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Conceda acesso à galeria para trocar a foto.');
            return;
        }
    }

    const file = (type === 'image') ? await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
    }) :
        await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (file.canceled) return;

    const selectedFile = file.assets?.[0] || file;
    if (!selectedFile || !selectedFile.uri) {
        Alert.alert("Erro", (type === 'image') ? "Não foi possível obter a imagem." : "Não foi possível obter o arquivo selecionado.");
        return;
    }

    return selectedFile;
}

export const useUploadFile = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProgressVisible, setIsProgressVisible] = useState(false);

    const uploadFile = async (type: 'image' | 'file', storageUrl: string) => {
        try {
            const selectedFile = await handleUploadFile(type);
            if (!selectedFile) return;

            setUploadProgress(0);
            setIsProgressVisible(true);

            const sourceUri = selectedFile?.uri;
            const storage = getStorage();
            const filename = sourceUri.substring(sourceUri.lastIndexOf('/') + 1);

            const uploadPath = `${storageUrl}/${Date.now()}-${filename}`;

            const referenceBlob = ref(storage, uploadPath);
            const response = await fetch(sourceUri);
            const blob = await response.blob();
            const task = uploadBytesResumable(referenceBlob, blob);

            task.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            });

            await task;
            return await getDownloadURL(referenceBlob);
        } catch (error: any) {
            if (error && error?.message?.includes('user canceled')) {
                console.log('Seleção de arquivo cancelada');
            } else {
                Alert.alert("Erro", "Não foi possível enviar o arquivo. Tente novamente.");
            }
        } finally {
            setUploadProgress(0);
            setIsProgressVisible(false);
        }
    }

    const UploadProgressBar = () => <ProgressBar progress={uploadProgress} visible={isProgressVisible} />;

    return { uploadProgress, isProgressVisible, uploadFile, UploadProgressBar };
}

