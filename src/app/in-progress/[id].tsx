import { Button } from "@/components/Button";
import { List } from "@/components/List";
import { Loading } from "@/components/Loading";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { TransactionTypes } from "@/utils/TransactionTypes";
import dayjs from "dayjs";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function InProgress() {
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<TransactionProps[]>([])
    const [details, setDetails] = useState({
        name: "",
        current: "R$ 0,00",
        target: "R$ 0,00",
        percentage: 0
    })
    const params = useLocalSearchParams<{ id: string }>()
    const targetDatabase = useTargetDatabase()
    const transactionsDatabase = useTransactionsDatabase()

    async function fetchTargetDetails() {
        try {
            const response = await targetDatabase.show(Number(params.id))

            setDetails({
                name: response.name,
                current: numberToCurrency(response.current),
                target: numberToCurrency(response.amount),
                percentage: response.percentage
            })
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível carregar os detalhes da meta.")
        }
    }

    async function fetchTransactions() {
        try {
            const response = await transactionsDatabase.listByTargetId(Number(params.id))

            setTransactions(
                response.map((transaction) => ({
                    id: String(transaction.id),
                    value: numberToCurrency(transaction.amount),
                    date: dayjs(transaction.created_at).format("DD/MM/YYYY [às] HH:mm"),
                    description: transaction.observation,
                    type: transaction.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input
                }))
            )
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as transações.")
            console.log(error)
        }
    }

    async function fetchData() {
        const fetchTargetDetailsPromise = fetchTargetDetails()
        const fetchTransactionsPromise = fetchTransactions()

        await Promise.all([fetchTargetDetailsPromise, fetchTransactionsPromise])
        setIsFetching(false)
    }

    function handleTransactionRemove(id: string) {
        Alert.alert("Remover", "Deseja realmente remover a transação?", [
            { text: "Não", style: 'cancel' },
            { text: 'Sim', onPress: () => transactionRemove(id) }
        ])
    }

    async function transactionRemove(id: string) {
        try {
            await transactionsDatabase.remove(Number(id))

            fetchData()
            Alert.alert("Transação", "Transação removida com sucesso!")
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover a transação.")
            console.log(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    if (isFetching) {
        return <Loading />
    }

    return (
        <View style={{ flex: 1, padding: 24, gap: 32 }}>
            <PageHeader
                title={details.name}
                rightButton={{ icon: 'edit', onPress: () => router.navigate(`/target?id=${params.id}`) }}
            />

            <Progress data={details} />

            <List
                title="Transações"
                data={transactions}
                renderItem={({ item }) =>
                    <Transaction data={item} onRemove={() => handleTransactionRemove(item.id)} />
                }
                emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
            />

            <Button title="Nova transação" onPress={() => router.navigate(`/transaction/${params.id}`)} />
        </View>
    )
}