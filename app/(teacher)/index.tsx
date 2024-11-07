import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";

// index view
export default function Index() {
  return (
    <View style={styles.container}>
      <Link style={styles.link} href="/(teacher)/scan/scan">
        Skanuj kod odbioru
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
  },
  link: {
    fontSize: 24,
    padding: 20,
    margin: 20,
    width: 300,
    backgroundColor: "#007BFF",
    borderRadius: 10,
    textAlign: "center",
    color: "#FFFFFF",
    textDecorationLine: "none",
  },
});
