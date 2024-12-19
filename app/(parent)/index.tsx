import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { useRouter } from "expo-router";
import { useParentAuth } from "../context/ParentAuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { authState } = useParentAuth();

  return (
    <ScrollView contentContainerStyle={styles.titleContainer}>
      <ThemedView style={styles.titleContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              router.navigate(`/(parent)/your_permissions`);
            }}
          >
            <Text style={styles.submitText}>Twoje zgody</Text>
          </TouchableOpacity>
          {authState?.type === "parent" && (
            <TouchableOpacity
              style={styles.submit}
              onPress={() => {
                router.navigate(`/(parent)/permissions`);
              }}
            >
              <Text style={styles.submitText}>Wydaj zgodę</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              router.navigate(`/(parent)/history`);
            }}
          >
            <Text style={styles.submitText}>Historia odbiorów</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 20,
  },
  label: {
    color: "#FFFFFF",
  },
  goto: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  gotoText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#28A745",
  },
  submit: {
    backgroundColor: "#28A745",
    padding: 20,
    margin: 10,
    width: 300,
    borderRadius: 10,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
});
