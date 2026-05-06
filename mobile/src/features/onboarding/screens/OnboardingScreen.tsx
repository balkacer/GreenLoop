import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppButton,
  AppScreen,
} from '../../../shared/components';
import { spacing } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { useUiStore } from '../../../app/store/uiStore';

const SLIDES = [
  {
    key: '1',
    title: 'Recicla tu material',
    accent: 'material',
    body: 'Separa bien tus envases y acércate a contenedores inteligentes para ganar GreenPoints en RD.',
    image: 'https://picsum.photos/seed/gl-onb1/400/280',
  },
  {
    key: '2',
    title: 'Gana GreenPoints',
    accent: 'GreenPoints',
    body: 'Acumula puntos por depósitos correctos y canjéalos en aliados o dona a causas ambientales.',
    image: 'https://picsum.photos/seed/gl-onb2/400/280',
  },
  {
    key: '3',
    title: 'Impacto en comunidad',
    accent: 'comunidad',
    body: 'Invita amigos, participa en eventos y mide tu impacto desde una app clara y amigable.',
    image: 'https://picsum.photos/seed/gl-onb3/400/280',
  },
];

const { width: SCREEN_W } = Dimensions.get('window');

export function OnboardingScreen() {
  const navigation = useNavigation();
  const setDone = useUiStore(s => s.setOnboardingCompleted);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  return (
    <AppScreen style={styles.screenBg}>
      <LinearGradient
        colors={[colors.limeWash, colors.mintSoft, colors.background]}
        locations={[0, 0.45, 1]}
        style={styles.gradient}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          onMomentumScrollEnd={e => {
            const i = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            setIndex(i);
          }}
          renderItem={({ item }) => {
            const parts = item.title.split(item.accent);
            return (
              <View style={[styles.slide, { width: SCREEN_W }]}>
                <Image source={{ uri: item.image }} style={styles.img} />
                <Text style={styles.title}>
                  {parts[0]}
                  <Text style={styles.titleAccent}>{item.accent}</Text>
                  {parts[1] ?? ''}
                </Text>
                <Text style={styles.body}>{item.body}</Text>
              </View>
            );
          }}
        />
      </LinearGradient>
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index ? styles.dotActive : null]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <AppButton
          title={index < SLIDES.length - 1 ? 'Siguiente' : 'Comenzar'}
          onPress={() => {
            if (index < SLIDES.length - 1) {
              listRef.current?.scrollToOffset({
                offset: SCREEN_W * (index + 1),
                animated: true,
              });
            } else {
              setDone(true);
              navigation.navigate('Login' as never);
            }
          }}
        />
        <AppButton
          title="Saltar"
          variant="outline"
          onPress={() => {
            setDone(true);
            navigation.navigate('Login' as never);
          }}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: colors.background },
  gradient: { flex: 1 },
  slide: { paddingHorizontal: spacing.md },
  img: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  titleAccent: { color: colors.brandGreen },
  body: { fontSize: 16, lineHeight: 22, color: colors.textMuted },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.brandTeal,
    width: 22,
    borderRadius: 6,
  },
  footer: { padding: spacing.md, gap: spacing.sm },
});
