import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { View } from "react-native";

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const [qrCode, setQRCode] = useState(null);
  useEffect(() => {
    async function doRequest() {
      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/parent/generate/${id}`, { id });
        setQRCode(response.data.qr_code)
        return response.data;
      } catch (error) {
        console.log(error)
      }
    }
    doRequest()

  }, [])

  return (
    <ThemedView style={styles.container}>
          {qrCode && 
    <><ThemedText style={styles.headerText}>{`Odbierz dziecko`}</ThemedText><ThemedText style={styles.qrCodeText}>{qrCode}</ThemedText><QRCode value={String(qrCode)} size={300} color="black" backgroundColor="#F8F9FA" /></>
    }
    {!qrCode && <ThemedText style={styles.headerText}>{"Nie ma takiej permisji"}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  qrCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  }
});