import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";

interface Child {
  id: number;
  name: string;
}

const AddPermission: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/parent/child/all`
        );
        setChildren(data.children || []);
      } catch (error) {
        const e = error as AxiosError;
        if (!e.response) {
          alert("Błąd połączenia z serwerem.");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Wybierz dziecko</Text>
        </View>
        {isLoading && <Text>Wczytywanie...</Text>}
        <View>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.submit}
              onPress={() => {
                router.navigate(`/(parent)/add_permission/${child.id}`);
              }}
            >
              <Text style={styles.submitText}>{child.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
  header: {
    margin: 20,
  },
  headerText: {
    fontSize: 36,
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

export default AddPermission;
