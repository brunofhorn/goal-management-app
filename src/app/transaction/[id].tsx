import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Transaction() {
    const params = useLocalSearchParams<{ id: string }>()

    return (
        <View>
            <Text>ID: {params.id}</Text>
        </View>
    )
}