import { Button } from "@/components/Button";
import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Target, TargetProps } from "@/components/Target";
import { Alert, StatusBar, View } from "react-native";
import { router, useFocusEffect } from 'expo-router'
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useCallback, useState } from "react";
import { Loading } from "@/components/Loading";
import { numberToCurrency } from "@/utils/numberToCurrency";

const summary = {
    total: "R$ 2.680,00",
    input: { label: "Entradas", value: "R$ 6.189,00" },
    output: { label: "Saídas", value: "-R$ 830,00" }
}

export default function Index() {
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [targets, setTargets] = useState<TargetProps[]>([])
    const targetDatabase = useTargetDatabase()

    async function fetchTargets(): Promise<TargetProps[]> {
        try {
            const response = await targetDatabase.listBySavedValue()

            return response.map((item) => ({
                id: String(item.id),
                name: item.name,
                current: numberToCurrency(item.current),
                percentage: item.percentage.toFixed(0) + '%',
                target: numberToCurrency(item.amount)
            }))
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Não foi possível carregar as metas.")
        }
    }

    async function fetchData() {
        const targetDataPromise = fetchTargets()

        const [targetData] = await Promise.all([targetDataPromise])

        setTargets(targetData)
        setIsFetching(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    if(isFetching){
        return <Loading />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <HomeHeader data={summary} />

            <List
                title="Metas"
                data={targets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Target data={item} onPress={() => router.navigate(`/in-progress/${item.id}`)} />
                )}
                emptyMessage="Nenhuma meta. Toque em nova meta para criar."
                containerStyle={{ paddingHorizontal: 24 }}
            />
            <View style={{ padding: 24, paddingBottom: 32 }}>
                <Button title="Nova meta" onPress={() => router.navigate("/target")} />
            </View>
        </View>
    )
}