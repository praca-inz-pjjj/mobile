import { Link } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.constainer}>
      <Link style={styles.link} href="/login/parent">
        Panel Rodzica
      </Link>
      <Link style={styles.link} href="/login/teacher">
        Panel Nauczyciela
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
