"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for login will go here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold text-graphite">LaCuisine</h1>
          <p className="text-graphite/60 font-medium">Benvindo de volta, Chef.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-graphite/40">
                E-mail
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
                Senha
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
            className="group flex w-full items-center justify-between rounded-full bg-graphite px-8 py-4 text-cream transition-all hover:bg-gold active:scale-95"
          >
            <span className="text-lg font-bold">Entrar no Sistema</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-graphite/40">
            Ainda não tem acesso?{" "}
            <Link href="/register" className="font-bold text-graphite hover:text-gold transition-colors">
              Solicitar Registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
