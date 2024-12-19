import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";

import axios from "axios";
import { Link, useRouter } from "expo-router";

interface Permission {
  id: number;
  parent: string;
  state: string;
  start_date: string;
  end_date: string;
  child: string;
}
const YourPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function doRequest() {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/parent/permissions`
        );
        setPermissions(response.data.permissions);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
    doRequest();
  }, []);

  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        {permissions.map((perm) => (
          <Link
            href={{
              pathname: "/(parent)/pickup/[id]",
              params: { id: perm.id },
            }}
            key={perm.id}
          >
            <View style={styles.permContainer}>
              <View>
                <Text style={styles.label}>Dziecko: </Text>
                <Text style={styles.value}>{perm.child}</Text>
              </View>
              <View>
                <Text style={styles.label}>Rodzic: </Text>
                <Text style={styles.value}>{perm.parent}</Text>
              </View>
              <View>
                <Text style={styles.label}>Początek zgody: </Text>
                <Text style={styles.value}>{perm.start_date}</Text>
              </View>
              <View>
                <Text style={styles.label}>Koniec zgody: </Text>
                <Text style={styles.value}>{perm.end_date}</Text>
              </View>
              <View style={styles.goto}>
                <TouchableOpacity
                  onPress={() => {
                    router.navigate(`/(parent)/pickup/${perm.id}`);
                  }}
                >
                  <Text style={styles.gotoText}>Przejdź do odbioru</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Link>
        ))}
      </ThemedView>
    </ScrollView>
  );
};

export default YourPermissions;

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 25,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  permContainer: {
    gap: 8,
    marginBottom: 8,
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
  value: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 20,
  },
  label: {
    color: "#FFFFFF",
  },
  goto: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  gotoText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#28A745",
  },
});
