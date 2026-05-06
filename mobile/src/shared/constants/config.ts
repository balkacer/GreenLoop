import { Platform } from 'react-native';

/** Host machine from Android emulator */
const ANDROID_EMULATOR_HOST = '10.0.2.2';

export const API_PORT = 4000;

export const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? `http://${ANDROID_EMULATOR_HOST}:${API_PORT}`
  : Platform.OS === 'ios'
    ? 'https://xkvglcrj-4000.use2.devtunnels.ms'
    : `http://localhost:${API_PORT}` // For web, we assume the backend is proxied at the same origin.
  : 'api.greenloop.do'; // Production URL
