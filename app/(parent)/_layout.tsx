import { Redirect, Tabs } from "expo-router";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
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
        name="your_permissions"
        options={{
          title: "Twoje zgody",
          tabBarIcon: ({ color }) => (
            <AntDesign name="checkcircleo" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="permissions"
        options={{
          title: "Wydaj zgodę",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add_permission/[id]"
        options={{
          title: "Wydaj zgodę",
          unmountOnBlur: true,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historia Odbiorów",
          tabBarIcon: ({ color }) => (
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
