import { ThemedText } from "@/components/ThemedText";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Button } from "react-native";

export default function scanned(){
    const { id } = useLocalSearchParams();
    const [data, setData] = useState('');
    useEffect(() => {
        async function doRequest() {
          try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/teacher/receipt`, { params: { id: id }});
            setData(response.data.id)
          } catch (error) {
            console.log(error)
          }
        }
        doRequest()
    
      }, [id]);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ThemedText type="title">Welcome! {data}</ThemedText>
            
        </View>
        );
}