import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppScreen,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../shared/components';
import { useGetFoundationsQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function FoundationsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, isError, refetch } = useGetFoundationsQuery();

  if (isLoading) {
    return (
      <AppScreen>
        <LoadingState />
      </AppScreen>
    );
  }
  if (isError) {
    return (
      <AppScreen>
        <ErrorState message="No se pudieron cargar las fundaciones." onRetry={refetch} />
      </AppScreen>
    );
  }

  const list = data?.foundations ?? [];
  if (list.length === 0) {
    return (
      <AppScreen>
        <EmptyState title="Sin fundaciones" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('FoundationDetail', {
                foundationId: item.id,
              })
            }>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.mission}>{item.mission}</Text>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  img: { width: '100%', height: 140 },
  title: {
    fontSize: 17,
    fontWeight: '800',
    padding: spacing.sm,
    color: colors.text,
  },
  mission: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
  },
});
