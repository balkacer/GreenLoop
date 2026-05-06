import { Platform } from 'react-native';

/** Host machine from Android emulator */
const ANDROID_EMULATOR_HOST = '10.0.2.2';

export const API_PORT = 4000;

export const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? `http://${ANDROID_EMULATOR_HOST}:${API_PORT}`
    : `http://localhost:${API_PORT}`
  : 'https://api.greenloop.do';
