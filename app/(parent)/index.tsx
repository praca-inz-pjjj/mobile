import { ScrollView, StyleSheet } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';

interface Permission {
  id: number;
  parent: string;
  state: string;
  start_date: string;
  end_date: string;
}

export default function HomeScreen() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  useEffect(() => {
    async function doRequest() {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/parent/permissions`);
        setPermissions(response.data.permissions)
        return response.data;
      } catch (error) {
        console.log(error)
      }
    }
    doRequest()

  }, [])

  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>

        {permissions.map((perm) => (
          <Link style={styles.link} href={{ pathname: '/(parent)/pickup/[id]', params: { id: perm.id }, }} key={perm.id}>
            {`${perm.parent}\n${perm.state}\n${perm.start_date}\n${perm.end_date}`}
          </Link>
        ))}
      </ThemedView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 25,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  link: {
    fontSize: 24,
    padding: 20,
    margin: 20,
    width: 300,
    backgroundColor: "#28A745",
    borderRadius: 10,
    textAlign: "center",
    color: "#FFFFFF",
    textDecorationLine: "none",
  },
});