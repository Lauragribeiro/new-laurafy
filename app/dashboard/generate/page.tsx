"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react"
import type { Purchase } from "@/lib/types"

export default function GenerateDocumentsPage() {
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [selectedPurchase, setSelectedPurchase] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingPurchases, setLoadingPurchases] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = async () => {
    try {
      const response = await fetch("/api/purchases")
      const data = await response.json()
      setPurchases(data)
    } catch (error) {
      console.error("Erro ao carregar prestações:", error)
    } finally {
      setLoadingPurchases(false)
    }
  }

  const handleGenerateMapa = async () => {
    if (!selectedPurchase) return

    setLoading(true)
    try {
      const response = await fetch("/api/generate-mapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: selectedPurchase,
          generatedBy: "Usuário do Sistema",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar documento")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `mapa-cotacao-${selectedPurchase}-${Date.now()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      alert("Mapa de cotação gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar mapa:", error)
      alert("Erro ao gerar mapa de cotação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerar Documentos</h1>
        <p className="text-muted-foreground">Exporte mapas de cotação e outros documentos</p>
      </div>

      <div className="space-y-6">
        {/* Mapa de Cotação */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Mapa de Cotação</CardTitle>
                <CardDescription>
                  Gere um documento DOCX com o mapa de cotação completo incluindo todas as propostas
                </CardDescription>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingPurchases ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Nenhuma prestação disponível para gerar documentos.</p>
                <Button onClick={() => router.push("/dashboard/new")}>Criar Prestação</Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selecione a Prestação</label>
                    <Select value={selectedPurchase} onValueChange={setSelectedPurchase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha uma prestação..." />
                      </SelectTrigger>
                      <SelectContent>
                        {purchases.map((purchase) => (
                          <SelectItem key={purchase.id} value={purchase.id}>
                            {purchase.projeto} - {purchase.favorecido} - NF {purchase.numeroNF}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPurchase && (
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-base">Detalhes da Prestação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const purchase = purchases.find((p) => p.id === selectedPurchase)
                          if (!purchase) return null
                          return (
                            <div className="space-y-1 text-sm">
                              <p>
                                <strong>Projeto:</strong> {purchase.projeto}
                              </p>
                              <p>
                                <strong>Favorecido:</strong> {purchase.favorecido}
                              </p>
                              <p>
                                <strong>NF:</strong> {purchase.numeroNF}
                              </p>
                              <p>
                                <strong>Valor:</strong> R${" "}
                                {purchase.valorNF.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </p>
                              <p>
                                <strong>Propostas:</strong> {purchase.propostas.length}
                              </p>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  <Button onClick={handleGenerateMapa} disabled={!selectedPurchase || loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando documento...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Gerar Mapa de Cotação (DOCX)
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Outros Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Outros Documentos</CardTitle>
            <CardDescription>Funcionalidades adicionais em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Relatório de Prestação de Contas (em breve)</li>
              <li>• Termo de Referência (em breve)</li>
              <li>• Planilha de Análise de Propostas (em breve)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
