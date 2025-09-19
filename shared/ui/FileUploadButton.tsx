import { useAuth } from '@/shared/contexts/auth/AuthContext';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ColorsPalette } from '../classes/constants/Pallete';
import { useUploadFile } from '../hooks/useUploadFile';

interface FileUploadButtonProps {
  label: string,
  onFinished: (url: string) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ label, onFinished }) => {
  const { user } = useAuth();
  const [isFinished, setIsFinished] = useState(false);
  const { isProgressVisible, uploadFile } = useUploadFile();
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const handleDocumentPick = async () => {
    if (!user) {
      Alert.alert("Erro de autenticação", "Usuário não está logado.");
      return;
    }

    try {
      const downloadURL = await uploadFile('file', `users/${user?.uid}`);
      if (!downloadURL) return;

      setDownloadURL(downloadURL);
      onFinished(downloadURL);
      setIsFinished(true);
    } catch (err: any) {
      if (err && err.message?.includes('user canceled')) {
        console.log('Seleção de arquivo cancelada');
      } else {
        Alert.alert("Erro", "Não foi possível enviar o arquivo. Tente novamente.");
      }
    } finally {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    setDisabled(isProgressVisible || downloadURL !== null);
  }, [isProgressVisible, downloadURL]);

  return (
    <TouchableOpacity
      style={[styles.button, { cursor: disabled ? 'not-allowed' as any : 'pointer', backgroundColor: downloadURL ? ColorsPalette.light['grey.50'] : ColorsPalette.light['lime.100'], borderColor: downloadURL ? ColorsPalette.light['grey.200'] : ColorsPalette.light['lime.300'] }]}
    onPress={handleDocumentPick}
      disabled={disabled}
    >
      {isProgressVisible ? (
        <ActivityIndicator color={ColorsPalette.light['lime.700']} />
      ) : (
        <>
          <MaterialIcons name="cloud-upload" size={24} color={downloadURL ? ColorsPalette.light['grey.500'] : ColorsPalette.light['lime.700']} style={styles.icon} />
          <Text style={[styles.buttonText, { color: downloadURL ? ColorsPalette.light['grey.500'] : ColorsPalette.light['lime.700'] }]}>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
});