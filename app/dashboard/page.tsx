"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, List, LogOut, User } from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação
    const sessionData = localStorage.getItem("auth_session") || sessionStorage.getItem("auth_session")

    if (!sessionData) {
      router.push("/login")
      return
    }

    try {
      const session = JSON.parse(sessionData)
      setUser(session.user)
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth_session")
    sessionStorage.removeItem("auth_session")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Gerenciamento Softex</h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h2>
          <p className="text-gray-600">Gerencie prestações de contas, documentos e mapas de cotação</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => router.push("/dashboard/new")}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-6 w-6 text-blue-600" />
                <CardTitle>Nova Prestação</CardTitle>
              </div>
              <CardDescription>Crie uma nova prestação de contas com upload de documentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Criar Nova</Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => router.push("/dashboard/purchases")}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <List className="h-6 w-6 text-green-600" />
                <CardTitle>Minhas Prestações</CardTitle>
              </div>
              <CardDescription>Visualize e gerencie todas as prestações de contas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Ver Todas
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => router.push("/dashboard/generate")}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <CardTitle>Gerar Documentos</CardTitle>
              </div>
              <CardDescription>Exporte mapas de cotação e outros documentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Gerar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Funcionalidades disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Sistema de autenticação ativo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Banco de dados sincronizado
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                APIs de upload e extração configuradas
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Módulo de geração de mapa de cotação ativo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Extração de propostas com IA funcionando
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
