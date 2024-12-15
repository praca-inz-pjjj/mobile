import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Structure {
  permission: Permission;
  child: Child;
}

interface Permission {
  id: number;
  parent: string;
  state: string;
  start_date: string;
  end_date: string;
  qr_code: string;
}

interface Child {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  classroom_id: number;
}

export default function ReceiveById() {
  const [users, setUsers] = useState<Person[]>([]);
  const [structure, setStructure] = useState<Structure[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Person[]>([]);
  const [userInput, setUserInput] = useState("");
  const [childInput, setChildInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receivers`);
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(userInput.toLowerCase())
      )
    );
  }, [userInput, users]);

  const fetchChildrenForUser = async (userId: string) => {
    setLoadingChildren(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/children/${userId}`);
      setStructure(response.data.objects);
    } catch (error) {
      console.error("Błąd podczas pobierania dzieci:", error);
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleUserSelect = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setUserInput(userName);
    setSelectedChildId("");
    setStructure([]);
    setChildInput("");
    fetchChildrenForUser(userId);
    setSelectedPermission(null);
  };

  const handleChildSelect = (childId: string, childName: string, permission: Permission) => {
    setSelectedChildId(childId);
    setChildInput(childName);
    setSelectedPermission(permission);
  };

  const handleSubmit = async () => {
    if (selectedUserId && selectedChildId && selectedPermission && selectedPermission.id) {
      try {
        await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receipt`, { permission_id: selectedPermission.id, reciver_id: selectedUserId, acceptance: true })
        alert(`Udało się zapisać zmiany`)
      }
      catch (e) {
        alert(`Nie udało się zapisać zmian: ${e}`)
      }
      finally{
        router.back();
      };
    } else {
      alert("Wybierz użytkownika i dziecko.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upewnij się, że odbierający ma dokument potwierdzający tożsamość!!!</Text>
      <Text style={styles.label}>Znajdź odbierającego:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Wpisz nazwę użytkownika"
        value={userInput}
        onChangeText={setUserInput}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.listItem,
              selectedUserId === item.id && styles.selectedItem,
            ]}
            onPress={() => handleUserSelect(item.id.toString(), `${item.first_name} ${item.last_name}`)}
          >
            <Text style={styles.listItemText}>
              {item.first_name} {item.last_name} {item.email}
            </Text>
          </Pressable>
        )}
      />

      {selectedUserId && (
        <>
          <Text style={styles.label}>Znajdź dziecko:</Text>
          {loadingChildren ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <>
              <TextInput
                style={styles.textInput}
                placeholder="Wpisz nazwę dziecka"
                value={childInput}
                onChangeText={setChildInput}
              />
              <FlatList
                data={structure}
                keyExtractor={(item) => item.permission.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.listItem,
                      selectedChildId === item.child.id && styles.selectedItem,
                    ]}
                    onPress={() => handleChildSelect(item.child.id.toString(), `${item.child.first_name} ${item.child.last_name}`, item.permission)}
                  >
                    <Text style={styles.listItemText}>
                      {item.child.first_name} {item.child.last_name} {item.child.birth_date}
                    </Text>
                  </Pressable>
                )}
              />
            </>
          )}
        </>
      )}

      <Pressable style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Zatwierdź odbiór</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF0000",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  listItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: "#007BFF",
  },
  listItemText: {
    fontSize: 16,
  },
  submit: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
