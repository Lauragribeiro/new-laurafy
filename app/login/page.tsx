"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // Signup state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupRole, setSignupRole] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao fazer login")
      }

      const session = await response.json()

      // Salvar sessão
      if (rememberMe) {
        localStorage.setItem("auth_session", JSON.stringify(session))
      } else {
        sessionStorage.setItem("auth_session", JSON.stringify(session))
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Cadastro não disponível nesta versão.")
  }

  return (
    <div className="login">
      <div className="auth">
        {/* Coluna Esquerda */}
        <div className="auth__left">
          <div className="auth__card">
            {/* Título */}
            <div className="brand">
              <Image src="/placeholder-logo.jpg" alt="Logo" width={60} height={60} className="brand__badge" />
              <h1 className="brand__title">Sistema de automação de PC</h1>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === "login" ? "is-active" : ""}`}
                onClick={() => setActiveTab("login")}
                type="button"
              >
                Log in
              </button>
              <button
                className={`auth-tab ${activeTab === "signup" ? "is-active" : ""}`}
                onClick={() => setActiveTab("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>

            {/* LOGIN */}
            {activeTab === "login" && (
              <div className="auth-pane is-active">
                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label className="field__label">Email</label>
                    <input
                      type="email"
                      className="input"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field__label">Senha</label>
                    <div className="input--with-icon">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)}>
                        <svg className="icon" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember Me</label>
                  </div>

                  <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? "Entrando..." : "Log in"}
                  </button>
                  {error && <div className="error-message">{error}</div>}
                  <button type="button" className="link" onClick={() => alert("Recuperação de senha")}>
                    Esqueci minha senha
                  </button>
                </form>
              </div>
            )}

            {/* SIGN UP */}
            {activeTab === "signup" && (
              <div className="auth-pane is-active">
                <form onSubmit={handleSignup}>
                  <div className="field">
                    <label className="field__label">Email</label>
                    <input
                      type="email"
                      className="input"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field__label">Senha</label>
                    <input
                      type="password"
                      className="input"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field__label">Acesso</label>
                    <select
                      className="input"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      required
                    >
                      <option value="">Selecione…</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="gerente">Gerente de Projeto</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn--primary">
                    Criar conta
                  </button>
                  <p className="terms">Ao continuar, você concorda com os termos de uso.</p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita (imagem) */}
        <div className="auth__right">
          <Image src="/placeholder.jpg" alt="Background" fill className="auth__bg" />
        </div>
      </div>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1400px;
          width: 100%;
          min-height: 100vh;
          background: white;
        }

        .auth__left {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .auth__card {
          width: 100%;
          max-width: 420px;
        }

        .brand {
          text-align: center;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .brand__title {
          font-family: "Hanken Grotesk", system-ui, sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a202c;
          line-height: 1.2;
        }

        .brand__badge {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .auth-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .auth-tab {
          flex: 1;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: #718096;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .auth-tab.is-active {
          border-bottom-color: #3b82f6;
          color: #3b82f6;
          font-weight: 600;
        }

        .auth-pane {
          display: none;
        }

        .auth-pane.is-active {
          display: block;
        }

        .field {
          display: block;
          margin-bottom: 1.25rem;
        }

        .field__label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }

        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .input:focus {
          border-color: #3b82f6;
        }

        .input--with-icon {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          padding: 0;
          transition: border-color 0.2s;
        }

        .input--with-icon:focus-within {
          border-color: #3b82f6;
        }

        .input--with-icon input {
          border: none;
          flex: 1;
        }

        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #718096;
        }

        .icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .btn {
          width: 100%;
          padding: 0.875rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn--primary {
          background: #3b82f6;
          color: white;
        }

        .btn--primary:hover {
          background: #2563eb;
        }

        .btn--primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .link {
          display: block;
          margin-top: 1rem;
          text-align: center;
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .terms {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.75rem;
          color: #718096;
        }

        .auth__right {
          position: relative;
          overflow: hidden;
        }

        .auth__bg {
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .auth {
            grid-template-columns: 1fr;
          }
          .auth__right {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
