import { ThemedText } from "@/components/ThemedText";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";

interface Person{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Permission {
  id: number;
  parent: string;
  state: string;
  start_date: string;
  end_date: string;
  qr_code: string;
}

interface Child{
  id: number;
  name: string;
  surname: string;
  birth_date: string;
  classroom_id: number;
}

export default function Scanned(){
    const { id } = useLocalSearchParams();
    const [data, setData] = useState(null);
    const [parent, setParent] = useState<Person>();
    const [reciver, setReciver] = useState<Person>();
    const [child, setChild] = useState<Child>();
    const [permission, setPermission] = useState<Permission>();

    useEffect(() => {
        async function doRequest() {
          try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receipt`, { params: { id: id }});
            setData(response.data)
            setParent(response.data.parent)
            setReciver(response.data.reciver)
            setChild(response.data.child)
            setPermission(response.data.permission)
          } catch (error) {
            console.log(error)
          }
        }
        doRequest()
    
      }, [id]);

    const handleAccept = async () => {
      try{
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receipt`, { permission_id: permission?.id, reciver_id: reciver?.id, acceptance: true })
        alert(`Udało się zapisać zmiany`)
        router.back()
      }catch (error) {
        alert(`Ups coś poszło nie tak: ${error}`);
      }
    }

    const handleReject = async () => {
      try{
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receipt`, { permission_id: permission?.id, reciver_id: reciver?.id, acceptance: false })
        alert(`Udało się zapisać zmiany`)
        router.back()
      }catch (error) {
        alert(`Ups coś poszło nie tak: ${error}`);
      }
    }

    return (
      <View style={styles.container}>
      {data && 
      <><View style={styles.titleContainer}>
            <ThemedText style={styles.headerText}>Permisja Aktywna dla kodu {permission?.qr_code}</ThemedText>
          </View><View style={styles.personContainer}>
              <Text style={styles.personRoleText}>Rodzic</Text>
              <Text style={styles.personText}>Imię: {parent?.first_name}</Text>
              <Text style={styles.personText}>Nazwisko: {parent?.last_name}</Text>
            </View><View style={styles.personContainer}>
              <Text style={styles.personRoleText}>Odbierający</Text>
              <Text style={styles.personText}>Imię: {reciver?.first_name}</Text>
              <Text style={styles.personText}>Nazwisko: {reciver?.last_name}</Text>
            </View><View style={styles.personContainer}>
              <Text style={styles.personRoleText}>Dziecko do odbioru</Text>
              <Text style={styles.personText}>Imię: {child?.name}</Text>
              <Text style={styles.personText}>Nazwisko: {child?.surname}</Text>
            </View><View style={styles.buttonContainer}>
              <Button title="Zatwierdź Odbiór" color="#28A745" onPress={handleAccept}/>
              <Button title="Odrzuć Odbiór" color="#DC3545" onPress={handleReject}/>
            </View></>
    }
    {
      !data && 
      <View style={styles.titleContainer}>
      <ThemedText style={styles.headerText}>Nie znaleziono permisji</ThemedText>
      </View>
    }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  personRoleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  personContainer: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  personText: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});