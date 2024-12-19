import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Wybierz panel" });
  }, [navigation]);
  return (
    <View style={styles.constainer}>
      <Link
        style={{ ...styles.link, ...styles.parentLink }}
        href="/login/parent"
      >
        Panel Odbierającego
      </Link>
      <Link
        style={{ ...styles.link, ...styles.teacherLink }}
        href="/login/teacher"
      >
        Panel Wydającego
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
  parentLink: {
    backgroundColor: "#28A745",
  },
  teacherLink: {
    backgroundColor: "#007BFF",
  },
});
