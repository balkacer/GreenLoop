import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import {
  useStartDepositMutation,
} from '../../../api/greenloopApi';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppButton,
  AppInput,
  AppScreen,
} from '../../../shared/components';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function ScanQrScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [manualId, setManualId] = useState('');
  const [startDeposit, { isLoading }] = useStartDepositMutation();

  const begin = async (containerId: string) => {
    const id = containerId.trim();
    if (!id) {
      Alert.alert('QR', 'Identificador vacío.');
      return;
    }
    try {
      const res = await startDeposit(id).unwrap();
      navigation.replace('DepositFlow', {
        containerId: id,
        sessionId: res.sessionId,
        containerName: res.container.name,
      });
    } catch (e) {
      Alert.alert('Contenedor', getErrorMessage(e));
    }
  };

  return (
    <AppScreen>
      <Text style={styles.help}>
        Apunta al código del contenedor. En pruebas también puedes escribir el
        ID (ej. c1).
      </Text>
      <View style={styles.camera}>
        <Camera
          style={StyleSheet.absoluteFill}
          scanBarcode
          showFrame
          laserColor={colors.primary}
          frameColor={colors.primary}
          onReadCode={event =>
            begin(event.nativeEvent.codeStringValue)
          }
        />
      </View>
      <View style={styles.manual}>
        <AppInput
          label="ID manual / pegar texto del QR"
          value={manualId}
          onChangeText={setManualId}
          autoCapitalize="none"
        />
        <AppButton
          title="Iniciar depósito simulado"
          loading={isLoading}
          onPress={() => begin(manualId)}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  help: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.textMuted,
  },
  camera: { height: 280, borderRadius: 16, overflow: 'hidden', margin: spacing.md },
  manual: { padding: spacing.md, gap: spacing.sm },
});
