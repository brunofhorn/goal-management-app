import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Target } from "@/components/Target";
import { View } from "react-native";

const summary = {
    total: "R$ 2.680,00",
    input: { label: "Entradas", value: "R$ 6.189,00" },
    output: { label: "Saídas", value: "-R$ 830,00" }
}

const targets = [
    {
        id: "1",
        name: "Cadeira ergonômica",
        percentage: "75%",
        current: "R$ 900,00",
        target: "R$ 1.200,00"
    },
    {
        id: "2",
        name: "Cadeira ergonômica",
        percentage: "75%",
        current: "R$ 900,00",
        target: "R$ 1.200,00"
    },
    {
        id: "3",
        name: "Cadeira ergonômica",
        percentage: "75%",
        current: "R$ 900,00",
        target: "R$ 1.200,00"
    }
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={summary} />

            <List
                title="Metas"
                data={targets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Target data={item} />}
                emptyMessage="Nenhuma meta. Toque em nova meta para criar."
                containerStyle={{paddingHorizontal: 24}}
            />
        </View>
    )
}