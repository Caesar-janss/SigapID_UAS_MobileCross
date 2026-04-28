import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, Text } from 'react-native';

// Import ini disesuaikan dengan folder 'theme' dan 'constants' Anda
import { colors } from '@/theme'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = colors.primary; // Menggunakan warna primary dari theme Anda

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>, // Icon sementara
        }}
      />
    </Tabs>
  );
}