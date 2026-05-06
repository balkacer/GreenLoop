import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import {
  useAbortDepositMutation,
  useCompleteDepositMutation,
} from '../../../api/greenloopApi';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useSessionStore } from '../../../app/store/sessionStore';
import { AppButton, AppCard, AppScreen } from '../../../shared/components';
import {
  createMockBleSession,
  runMockDepositSteps,
} from '../../../shared/services/mockBle';
import type { DepositFlowStep } from '../../../shared/types';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const STEP_LABELS: Record<DepositFlowStep, string> = {
  connecting: 'Conectando con contenedor…',
  validating: 'Validando contenedor…',
  waiting_deposit: 'Esperando depósito…',
  measuring_volume_weight: 'Midiendo volumen y peso…',
  detecting_material: 'Detectando tipo de material…',
  calculating_points: 'Calculando GreenPoints…',
  confirming_transaction: 'Confirmando transacción…',
};

type Props = NativeStackScreenProps<RootStackParamList, 'DepositFlow'>;

export function DepositFlowScreen({ route }: Props) {
  const { containerId, sessionId, containerName } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setUser = useSessionStore(s => s.setUser);

  const [step, setStep] = useState<DepositFlowStep | null>('connecting');
  const [running, setRunning] = useState(false);
  const mockSessionRef = useRef(createMockBleSession(containerId));

  const [completeDeposit] = useCompleteDepositMutation();
  const [abortDeposit] = useAbortDepositMutation();

  const label = useMemo(() => (step ? STEP_LABELS[step] : ''), [step]);

  React.useEffect(() => {
    let mounted = true;
    mockSessionRef.current.abortController = new AbortController();
    setRunning(true);

    (async () => {
      try {
        const measurement = await runMockDepositSteps(
          containerId,
          s => {
            if (mounted) setStep(s);
          },
          mockSessionRef.current.abortController.signal,
        );
        const res = await completeDeposit({
          id: containerId,
          depositSessionId: sessionId,
          volumeRange: measurement.volumeRange,
          estimatedWeightKg: measurement.estimatedWeightKg,
          materialType: measurement.materialType,
          materialQuality: measurement.materialQuality,
          isEventActive: measurement.isEventActive,
          bonuses: measurement.bonuses,
        }).unwrap();
        if (!mounted) return;
        const user = useSessionStore.getState().user;
        if (user) setUser({ ...user, balance: res.newBalance });
        navigation.replace('DepositSuccess', {
          containerId,
          containerName,
          transactionId: res.transactionId,
          pointsEarned: res.pointsEarned,
          newBalance: res.newBalance,
          calculation: res.calculation,
          completedAt: new Date().toISOString(),
        });
      } catch (e) {
        const aborted = e instanceof Error && e.message === 'aborted';
        if (aborted) {
          try {
            await abortDeposit({ id: containerId, sessionId }).unwrap();
          } catch {
            /* noop */
          }
          if (mounted) {
            Alert.alert(
              'Depósito cancelado',
              'Registramos el evento como abortado en tu historial.',
            );
          }
        } else if (mounted) {
          Alert.alert('Error', getErrorMessage(e));
        }
        if (mounted) navigation.goBack();
      } finally {
        if (mounted) {
          setRunning(false);
          setStep(null);
        }
      }
    })();

    return () => {
      mounted = false;
      mockSessionRef.current.abortController.abort();
    };
  }, [
    abortDeposit,
    completeDeposit,
    containerId,
    containerName,
    navigation,
    sessionId,
    setUser,
  ]);

  return (
    <AppScreen>
      <AppCard style={styles.card}>
        <Text style={styles.title}>Proceso de depósito</Text>
        <Text style={styles.step}>{label}</Text>
        <Text style={styles.meta}>
          {containerName ? `${containerName} · ` : ''}ID: {containerId}
        </Text>
      </AppCard>
      <AppButton
        title="Abortar depósito"
        variant="danger"
        disabled={!running}
        onPress={() => mockSessionRef.current.abortController.abort()}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: { margin: spacing.md },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  step: { marginTop: spacing.md, fontSize: 16, color: colors.textMuted },
  meta: { marginTop: spacing.sm, fontSize: 13, color: colors.textMuted },
});
