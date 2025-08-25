import { HomeHeader } from "@/components/HomeHeader";
import { Target } from "@/components/Target";
import { View } from "react-native";

const summary = {
    total: "R$ 2.680,00",
    input: { label: "Entradas", value: "R$ 6.189,00" },
    output: { label: "Saídas", value: "-R$ 830,00" }
}

const targets = [
    {
        name: "Cadeira ergonômica",
        percentage: "75%",
        current: "900,00",
        target: "1.200,00"
    }
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={summary} />

            <Target data={targets[0]} />
        </View>
    )
}