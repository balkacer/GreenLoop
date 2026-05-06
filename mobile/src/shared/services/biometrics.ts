import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export async function isBiometricAvailable(): Promise<boolean> {
  const { available } = await rnBiometrics.isSensorAvailable();
  return available;
}

export async function simplePrompt(reason: string): Promise<boolean> {
  const { success } = await rnBiometrics.simplePrompt({ promptMessage: reason });
  return success;
}

export async function saveCredentialsForBiometric(
  username: string,
  password: string,
): Promise<void> {
  await Keychain.setGenericPassword(username, password, {
    service: 'greenloop.auth',
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function loadCredentialsWithBiometric(): Promise<{
  username: string;
  password: string;
} | null> {
  const creds = await Keychain.getGenericPassword({
    service: 'greenloop.auth',
    authenticationPrompt: {
      title: 'GreenLoop',
      subtitle: 'Desbloquea para continuar',
    },
  });
  if (!creds || !creds.password) return null;
  return { username: creds.username, password: creds.password };
}

export async function clearSavedCredentials(): Promise<void> {
  await Keychain.resetGenericPassword({ service: 'greenloop.auth' });
}
