import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { useLocalSearchParams } from "expo-router";

interface Receiver {
  id: string;
  user: string;
}

const validationSchema = Yup.object().shape({
  permitted_user: Yup.string().required("Odbierający jest wymagany"),
  start_date: Yup.date()
    .required("Data początkowa jest wymagana")
    .min(
      new Date(new Date().getTime() - 5 * 60 * 1000),
      "Data początkowa nie może być w przeszłości"
    ),
  end_date: Yup.date()
    .required("Data końcowa jest wymagana")
    .min(
      Yup.ref("start_date"),
      "Data końcowa nie może być wcześniejsza niż początkowa"
    ),
  two_factor_verification: Yup.boolean(),
});

const AddPermission: React.FC = () => {
  const { id } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [permittedUsers, setPermittedUsers] = useState<Receiver[]>([]);
  const [permittedUser, setPermittedUser] = useState();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [fromPickerVisible, setFromPickerVisible] = useState(false);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [toPickerVisible, setToPickerVisible] = useState(false);

  const router = useRouter();

  const submit = async () => {
    const values = {
      permitted_user: permittedUser,
      start_date: fromDate,
      end_date: toDate,
      two_factor_verification: false,
    };

    try {
      const validatedValues = await validationSchema.validate(values);
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/parent/child/${id}/create-permission`,
        validatedValues
      );
      if (!data) {
        alert("Nie udało się wydać zgody");
        return;
      }
      alert("Zgoda została wydana");
      router.navigate("/(parent)/");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        alert(error.message);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/parent/child/${id}/permitted-users`
        );
        setPermittedUsers(data.permitted_users || []);
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
  }, [id]);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Wydaj zgodę</Text>
        </View>
        {isLoading && <Text>Wczytywanie...</Text>}
        {!isLoading && (
          <>
            <View style={styles.form}>
              <View style={styles.formRow}>
                <Text style={styles.label}>Odbierający</Text>
                <Picker
                  style={styles.input}
                  selectedValue={permittedUser}
                  onValueChange={(itemValue, itemIndex) =>
                    setPermittedUser(itemValue)
                  }
                >
                  <Picker.Item
                    style={styles.formRow}
                    label="Wybierz odbierającego"
                    value=""
                  />
                  {Object.entries(permittedUsers).map(([key, { id, user }]) => (
                    <Picker.Item
                      style={styles.option}
                      key={key}
                      label={user}
                      value={id}
                    ></Picker.Item>
                  ))}
                </Picker>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Data początkowa</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setFromPickerVisible(true);
                  }}
                >
                  <Text>
                    {fromDate?.toLocaleString() ?? "Wybierz datę początkową"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={fromPickerVisible}
                  mode="datetime"
                  onConfirm={(v) => {
                    setFromDate(v);
                    setFromPickerVisible(false);
                  }}
                  onCancel={() => {
                    setFromPickerVisible(false);
                  }}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Data końcowa</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setToPickerVisible(true);
                  }}
                >
                  <Text>
                    {toDate?.toLocaleString() ?? "Wybierz datę końcową"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={toPickerVisible}
                  mode="datetime"
                  onConfirm={(v) => {
                    setToDate(v);
                    setToPickerVisible(false);
                  }}
                  onCancel={() => {
                    setToPickerVisible(false);
                  }}
                />
              </View>
            </View>
            <Pressable style={styles.submit} onPress={submit}>
              <Text style={styles.submitText}>Zatwierdź</Text>
            </Pressable>
          </>
        )}
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
    // fontSize: 36,
  },
  headerText: {
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
    fontSize: 20,
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    backgroundColor: "#F0F0F0",
    marginTop: 20,
    padding: 10,
    // borderRadius: 10,
    fontSize: 20,
  },
  option: {
    fontSize: 20,
    textAlign: "center",
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
