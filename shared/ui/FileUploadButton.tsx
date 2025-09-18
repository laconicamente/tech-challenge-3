import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/shared/contexts/auth/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ColorsPalette } from '../classes/constants/Pallete';

interface FileUploadButtonProps {
  label: string,
  onFinished: (url: string) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ label, onFinished }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleDocumentPick = async () => {
    if (!user) {
      Alert.alert("Erro de autenticação", "Usuário não está logado.");
      return;
    }

    try {
      const file = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
      if (file.canceled) {
        return;
      }

      const selectedFile = file.assets?.[0];
      if (!selectedFile || !selectedFile.uri) {
        Alert.alert("Erro", "Não foi possível obter o arquivo selecionado.");
        return;
      }
      const uri = selectedFile.uri;
      const filename = uri.split('/').pop() || 'unknown';
      const uploadPath = `files/${user.uid}/${filename}`;

      setIsUploading(true);

      const storage = getStorage();
      const reference = ref(storage, uploadPath);
      const response = await fetch(uri);
      const blob = await response.blob();
      const task = uploadBytesResumable(reference, blob);

      task.on('state_changed', (_) => onProgress(true));

      await task;
      const downloadURL = await getDownloadURL(reference);

      setIsUploading(false);
      onFinished(downloadURL);
      setIsFinished(true);
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
      style={[styles.button, { backgroundColor: isFinished ? ColorsPalette.light['grey.50'] : ColorsPalette.light['lime.100'], borderColor: isFinished ? ColorsPalette.light['grey.200'] : ColorsPalette.light['lime.300'] }]}
      onPress={handleDocumentPick}
      disabled={isUploading}
    >
      {isUploading ? (
        <ActivityIndicator color={ColorsPalette.light['lime.700']} />
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
    borderStyle: 'dashed',
    borderWidth: 2,
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