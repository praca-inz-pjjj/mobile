import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import AuthContext, { useParentAuth } from "./context/ParentAuthContext";
import { Button, TouchableOpacity, Text, StyleSheet } from "react-native";
import TeacherAuthContext, {
  useTeacherAuth,
} from "./context/TeacherAuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <TeacherAuthContext>
      <AuthContext>
        <Layout />
      </AuthContext>
    </TeacherAuthContext>
  );
}

function Layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { onLogout } = useParentAuth();
  const { onLogout: onTeacherLogout } = useTeacherAuth();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="(parent)"
          options={{
            headerBackVisible: false,
            title: "Panel Rodzica",
            headerRight: () => (
              <TouchableOpacity onPress={onLogout} style={styles.button}>
                <Text style={styles.buttonText}>Wyloguj</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(teacher)"
          options={{
            headerBackVisible: false,
            title: "Panel Nauczyciela",
            headerRight: () => (
              <TouchableOpacity
                onPress={onTeacherLogout}
                style={styles.teacherButton}
              >
                <Text style={styles.buttonText}>Wyloguj</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="login/index" options={{ title: "XD" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
  },
  teacherButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
});
