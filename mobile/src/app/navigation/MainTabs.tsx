import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Home, MapPin, Sparkles, User } from 'lucide-react-native';
import { colors } from '../../shared/theme/colors';
import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { MapScreen } from '../../features/containers/screens/MapScreen';
import { PointsScreen } from '../../features/points/screens/PointsScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';

export type MainTabParamList = {
  Inicio: undefined;
  Mapa: undefined;
  Puntos: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.brandTeal,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="Inicio"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size ?? 22} strokeWidth={2.25} />
          ),
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <MapPin color={color} size={(size ?? 22) + 1} strokeWidth={2.25} />
          ),
        }}
      />
      <Tab.Screen
        name="Puntos"
        component={PointsScreen}
        options={{
          title: 'Puntos',
          tabBarIcon: ({ color, size }) => (
            <Sparkles color={color} size={size ?? 22} strokeWidth={2.25} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size ?? 22} strokeWidth={2.25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
