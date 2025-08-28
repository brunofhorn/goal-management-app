import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Target() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [amount, setAmount] = useState<number>(0)
    const params = useLocalSearchParams<{ id?: string }>()
    const targetDatabase = useTargetDatabase()

    function handleSave() {
        if (!name.trim() || amount <= 0) {
            return Alert.alert("Atenção", "Preencha o nome e valor precisa ser maior que zero.")
        }

        setIsProcessing(true)

        if (params.id) {
            // update
        } else {
            create()
        }
    }

    async function create() {
        try {
            await targetDatabase.create({ name, amount })
            
            Alert.alert("Nova meta", "Nova meta criada com sucesso!", [
                { text: 'Ok', onPress: () => router.back() }
            ])
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar a nova meta.")
            console.log(error)
            setIsProcessing(false)
        }
    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <PageHeader title="Meta" subtitle="Economize para alcançar sua meta financeira." />

            <View style={{ marginTop: 32, gap: 24 }}>
                <Input
                    label="Nome da meta"
                    placeholder="Ex: Viagem para praia, Apple Watch"
                    onChangeText={setName}
                />

                <CurrencyInput
                    label="Valor alvo (R$)"
                    value={amount}
                    onChangeValue={setAmount}
                />
                <Button title="Salvar" onPress={handleSave} isProcessing={isProcessing} />
            </View>
        </View>
    )
}