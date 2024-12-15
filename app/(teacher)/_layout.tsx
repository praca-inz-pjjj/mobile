import { Redirect, Tabs } from "expo-router";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTeacherAuth } from "../context/TeacherAuthContext";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authState } = useTeacherAuth();
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
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan/scan"
        options={{
          unmountOnBlur: true,
          title: "scan",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="scan1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan/receiveById"
        options={{
          unmountOnBlur: true,
          title: "znajdź",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="search1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan/checktwofactor"
        options={{
          unmountOnBlur: true,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="scan/scanned"
        options={{
          unmountOnBlur: true,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
