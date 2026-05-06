import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}>
      <Tab.Screen
        name="Inicio"
        component={DashboardScreen}
        options={{
          tabBarIcon: () => <TabIcon label="🏠" />,
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          tabBarIcon: () => <TabIcon label="📍" />,
        }}
      />
      <Tab.Screen
        name="Puntos"
        component={PointsScreen}
        options={{
          tabBarIcon: () => <TabIcon label="⭐" />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <TabIcon label="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}
