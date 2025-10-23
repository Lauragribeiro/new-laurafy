// Sistema de autenticação simples

export interface User {
  id: string
  email: string
  name: string
  role: "administrativo" | "gerente"
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

// Simulação de banco de usuários (em produção, usar banco real)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@softex.com",
    name: "Administrador",
    role: "administrativo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "gerente@softex.com",
    name: "Gerente de Projeto",
    role: "gerente",
    createdAt: new Date().toISOString(),
  },
]

export async function authenticate(email: string, password: string): Promise<AuthSession | null> {
  console.log("[v0] Tentativa de login:", { email, passwordLength: password.length })

  // Em produção, verificar senha hash no banco
  const user = MOCK_USERS.find((u) => u.email === email)

  if (!user) {
    console.log("[v0] Usuário não encontrado:", email)
    return null
  }

  // Em produção, usar bcrypt para validar hash
  if (!password || password.length === 0) {
    console.log("[v0] Senha vazia")
    return null
  }

  console.log("[v0] Login bem-sucedido para:", user.email)

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h

  return {
    user,
    token,
    expiresAt,
  }
}

export async function validateToken(token: string): Promise<User | null> {
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    return MOCK_USERS.find((u) => u.id === userId) || null
  } catch {
    return null
  }
}
