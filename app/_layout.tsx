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
import { Button } from "react-native";
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
      <Stack>
        <Stack.Screen
          name="(parent)"
          options={{
            headerRight: () => <Button onPress={onLogout} title="Wyloguj" />,
          }}
        />
        <Stack.Screen
          name="(teacher)"
          options={{
            headerRight: () => (
              <Button onPress={onTeacherLogout} title="Wyloguj" />
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
