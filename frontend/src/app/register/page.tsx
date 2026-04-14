"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        email,
        password,
        full_name: name,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold text-graphite">LaCuisine</h1>
          <p className="text-graphite/60 font-medium">Junte-se à elite culinária.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-500/10 rounded-xl py-2">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-graphite/40">
                Nome do Chef
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-3 text-lg outline-none focus:border-gold transition-colors"
                placeholder="Ex: Auguste Escoffier"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-graphite/40">
                E-mail Profissional
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-3 text-lg outline-none focus:border-gold transition-colors"
                placeholder="chef@lacuisine.com"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-semibold uppercase tracking-wider text-graphite/40">
                Senha de Acesso
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-3 text-lg outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-between rounded-full bg-graphite px-8 py-4 text-cream transition-all hover:bg-gold active:scale-95 disabled:opacity-60"
          >
            <span className="text-lg font-bold">
              {loading ? "Registrando..." : "Solicitar Acesso"}
            </span>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-graphite/40">
            Já possui acesso?{" "}
            <Link href="/login" className="font-bold text-graphite hover:text-gold transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
