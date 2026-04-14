"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for registration will go here
    console.log("Register attempt:", { name, email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold text-graphite">LaCuisine</h1>
          <p className="text-graphite/60 font-medium">Junte-se à elite culinária.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="group flex w-full items-center justify-between rounded-full bg-graphite px-8 py-4 text-cream transition-all hover:bg-gold active:scale-95"
          >
            <span className="text-lg font-bold">Solicitar Acesso</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
