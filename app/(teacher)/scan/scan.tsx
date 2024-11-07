import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ThemedText } from "@/components/ThemedText";
import { Link, useRouter } from "expo-router";

export default function ScannerQR() {
  const [hasPermission, setHasPermission] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    router.push({ pathname: "/(teacher)/scan/scanned", params: { id: data } });
  };

  const handleManualCodeSubmit = () => {
    if (manualCode.trim()) {
      router.push({
        pathname: "/(teacher)/scan/scanned",
        params: { id: manualCode },
      });
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission === null && <Text>Prośba o uprawnienia do kamery...</Text>}
      {!hasPermission && <Text>Brak dostępu do kamery</Text>}
      {hasPermission && (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}

      <View style={styles.manualInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Wpisz kod ręcznie"
          value={manualCode}
          onChangeText={setManualCode}
        />

        <Pressable style={styles.submit} onPress={handleManualCodeSubmit}>
          <Text style={styles.submitText}>Zatwierdź kod</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  scannerContainer: {
    width: "100%",
    height: "70%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  manualInputContainer: {
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  scanResultContainer: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
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
