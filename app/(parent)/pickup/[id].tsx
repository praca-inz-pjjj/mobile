import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const [qrCode, setQRCode] = useState(0);
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
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{`Pick up view ${qrCode}`}</ThemedText>
        <QRCode value={String(qrCode)} size={200} color="black" backgroundColor="white" />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
  },
});