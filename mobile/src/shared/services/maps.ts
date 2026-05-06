import { Alert, Linking, Platform } from 'react-native';

export type MapsApp = 'google' | 'apple' | 'waze';

export function openDirections(
  lat: number,
  lng: number,
  label?: string,
  app: MapsApp = 'google',
): void {
  const encodedLabel = label ? encodeURIComponent(label) : '';
  let url = '';
  if (app === 'waze') {
    url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  } else if (app === 'apple' && Platform.OS === 'ios') {
    url = `http://maps.apple.com/?ll=${lat},${lng}&q=${encodedLabel}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  Linking.openURL(url).catch(() => {
    Alert.alert('Mapas', 'No se pudo abrir la aplicación de mapas.');
  });
}

export function showMapsPicker(lat: number, lng: number, label?: string): void {
  Alert.alert('Abrir en mapas', 'Elige una app', [
    { text: 'Google Maps', onPress: () => openDirections(lat, lng, label, 'google') },
    ...(Platform.OS === 'ios'
      ? [{ text: 'Apple Maps', onPress: () => openDirections(lat, lng, label, 'apple') }]
      : []),
    { text: 'Waze', onPress: () => openDirections(lat, lng, label, 'waze') },
    { text: 'Cancelar', style: 'cancel' },
  ]);
}
