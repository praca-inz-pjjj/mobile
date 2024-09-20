import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { useParentAuth } from "../context/ParentAuthContext";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Login() {
  const { onLogin } = useParentAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const result = await onLogin!(email, password);

    if (result && result.error) {
      switch (result.error.status) {
        case 400:
          alert("Nie podano danych logowania");
          break;
        case 401:
          alert("Niepoprawne dane logowania");
          break;
        default:
          alert(`Wystąpił błąd podczas logowania: ${result.error}`);
          break;
      }
    } else {
      router.push("/(parent)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Panel Rodzica</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Hasło</Text>
      <TextInput
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={login} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    margin: 20,
    fontSize: 36,
  },
  label: {
    fontSize: 24,
  },
});
