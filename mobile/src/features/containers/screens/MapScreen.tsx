import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import {
  AppCard,
  AppScreen,
  ErrorState,
  LoadingState,
} from '../../../shared/components';
import { useGetNearbyContainersQuery } from '../../../api/greenloopApi';
import {
  getCurrentPosition,
  requestLocationPermission,
} from '../../../shared/services/location';
import { showMapsPicker } from '../../../shared/services/maps';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const DEFAULT_RD = {
  latitude: 18.4861,
  longitude: -69.9312,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export function MapScreen() {
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [permError, setPermError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await requestLocationPermission();
      if (!ok) {
        setPermError('Activa el permiso de ubicación para ver contenedores cercanos.');
        setCoords({ lat: DEFAULT_RD.latitude, lng: DEFAULT_RD.longitude });
        return;
      }
      try {
        const p = await getCurrentPosition();
        if (!cancelled) setCoords({ lat: p.latitude, lng: p.longitude });
      } catch {
        if (!cancelled) {
          setCoords({ lat: DEFAULT_RD.latitude, lng: DEFAULT_RD.longitude });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { data, isLoading, isError, refetch } = useGetNearbyContainersQuery(
    coords
      ? { lat: coords.lat, lng: coords.lng, radius: 8 }
      : { lat: DEFAULT_RD.latitude, lng: DEFAULT_RD.longitude, radius: 8 },
    { skip: false },
  );

  const list = data?.containers ?? [];
  const nearest = list[0];

  return (
    <AppScreen>
      {permError ? (
        <Text style={styles.warn}>{permError}</Text>
      ) : null}
      <MapView
        style={styles.map}
        region={{
          latitude: coords?.lat ?? DEFAULT_RD.latitude,
          longitude: coords?.lng ?? DEFAULT_RD.longitude,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        showsUserLocation>
        {coords ? (
          <Circle
            center={{ latitude: coords.lat, longitude: coords.lng }}
            radius={8000}
            strokeColor={colors.primary + '88'}
            fillColor={colors.accent + '22'}
          />
        ) : null}
        {list.map(c => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            title={c.name}
            description={c.address}
            onCalloutPress={() =>
              showMapsPicker(c.lat, c.lng, c.name)
            }
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState message="No se cargaron contenedores." onRetry={refetch} />
        ) : null}
        {nearest ? (
          <AppCard>
            <Text style={styles.nearTitle}>Más cercano</Text>
            <Text style={styles.nearName}>{nearest.name}</Text>
            <Text style={styles.meta}>
              {nearest.distanceKm != null
                ? `${nearest.distanceKm.toFixed(2)} km · `
                : ''}
              {nearest.address}
            </Text>
            <Text style={styles.meta}>Estado: {nearest.status}</Text>
          </AppCard>
        ) : !isLoading ? (
          <Text style={styles.meta}>No hay contenedores en el radio mostrado.</Text>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  panel: {
    padding: spacing.md,
    backgroundColor: colors.background,
    maxHeight: 220,
  },
  warn: {
    padding: spacing.sm,
    backgroundColor: colors.warning + '33',
    color: colors.text,
  },
  nearTitle: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  nearName: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  meta: { marginTop: 4, color: colors.textMuted, fontSize: 13 },
});
