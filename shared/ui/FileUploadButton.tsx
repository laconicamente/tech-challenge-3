import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import {pick, keepLocalCopy} from '@react-native-documents/picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ColorsPalette } from '../classes/constants/Pallete';

interface FileUploadButtonProps {
  label: string,
  onFinished: (url: string) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({label, onFinished }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentPick = async () => {
    if (!user) {
      Alert.alert("Erro de autenticação", "Usuário não está logado.");
      return;
    }

    try {
      const file = await pick({type: ['image/*', 'application/pdf']});
      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file[0].uri,
            fileName: file[0].name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      const filename = localCopy.sourceUri.substring(localCopy.sourceUri.lastIndexOf('/') + 1);
      const uploadPath = `files/${user.uid}/${filename}`;
      
      setIsUploading(true);

      const storage = getStorage();
      const reference = ref(storage, uploadPath);
      const response = await fetch(localCopy.sourceUri);
      const blob = await response.blob();
      const task = uploadBytesResumable(reference, blob);

      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso: ${progress.toFixed(2)}%`);
      });

      await task;
      const downloadURL = await getDownloadURL(reference);
      
      setIsUploading(false);
      Alert.alert("Sucesso", "Arquivo enviado com sucesso!");
      onFinished(downloadURL);

    } catch (err: any) {
      setIsUploading(false);
      console.log(err)
      if (err && err?.message?.includes('user canceled')) {
        console.log('Seleção de arquivo cancelada');
      } else {
        Alert.alert("Erro", "Não foi possível enviar o arquivo. Tente novamente.");
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleDocumentPick}
      disabled={isUploading}
    >
      {isUploading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <MaterialIcons name="cloud-upload" size={24} color={ColorsPalette.light['lime.700']} style={styles.icon} />
          <Text style={styles.buttonText}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorsPalette.light['lime.100'],
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: ColorsPalette.light['lime.300'],
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: ColorsPalette.light['lime.700'],
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
});