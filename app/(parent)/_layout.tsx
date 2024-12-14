import { Redirect, Tabs } from "expo-router";
import React from "react";
import Fontisto from '@expo/vector-icons/Fontisto';

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useParentAuth } from "../context/ParentAuthContext";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authState } = useParentAuth();
  if (!authState?.authenticated) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Start",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historia Odbiorów",
          tabBarIcon: ({ color, focused }) => (
            <Fontisto name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pickup/[id]"
        options={{
          title: "Pick up",
          unmountOnBlur: true,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
