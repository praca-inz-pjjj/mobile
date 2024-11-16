import { ThemedText } from "@/components/ThemedText";
import axios from "axios";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text, TextInput, Pressable } from "react-native";

export default function Scanned() {
    const { id } = useLocalSearchParams();
    const [isTwoFactor, setIsTwoFactor] = useState(null);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [wrongCode, setWrongCode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkReceipt() {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/check-receipt`, { params: { id: id } });
                let is_two_factor = response.data.is_two_factor
                setIsTwoFactor(is_two_factor)
                if (is_two_factor === false) {
                    router.push({ pathname: "/(teacher)/scan/scanned", params: { id: id } });
                }
            } catch (error) {
                console.log(error)
            }
        }

        checkReceipt()

    }, [id]);

    async function handleTwoFactorCodeSubmit() {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/check-twofactorcode`, { params: { id: id, twofactor: twoFactorCode.trim() } });
        if (response.data.correct === true) {
            router.push({
                pathname: "/(teacher)/scan/scanned",
                params: { id: id },
            });
        } else {
            setWrongCode(true);
        }
    };

    return (
        <View style={styles.container}>
            {isTwoFactor &&
                <View style={styles.manualInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Wpisz kod do weryfikacji dwuetapowej"
                        value={twoFactorCode}
                        onChangeText={setTwoFactorCode}
                    />
                    <Pressable style={styles.submit} onPress={handleTwoFactorCodeSubmit}>
                        <Text style={styles.submitText}>Sprawdź kod</Text>
                    </Pressable>
                </View>
            }
            {wrongCode === true && <Text>Zły kod, proszę spróbować ponownie</Text>}
        </View>
    );
};

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
