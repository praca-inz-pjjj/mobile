import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import { useTeacherAuth } from "../context/TeacherAuthContext";
import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

export default function Login() {
  const { onLogin } = useTeacherAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

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
      router.push("/(teacher)");
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "Logowanie do Panelu Nauczyciela" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formRow}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View>
          <Text style={styles.label}>Hasło</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <Pressable style={styles.submit} onPress={login}>
        <Text style={styles.submitText}>Zaloguj</Text>
      </Pressable>
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
  form: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300,
  },
  formRow: {
    marginBottom: 30,
  },
  label: {
    fontSize: 30,
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    backgroundColor: "#F0F0F0",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
  },
  submit: {
    backgroundColor: "#007BFF",
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
