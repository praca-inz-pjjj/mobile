import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

// index view
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.text}>Welcome to the home page</Text>
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
});
