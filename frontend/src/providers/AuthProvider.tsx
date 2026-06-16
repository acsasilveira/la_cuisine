"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/domain/entities/User";
import { HttpAuthRepository } from "@/data/repositories/HttpAuthRepository";

const authRepository = new HttpAuthRepository();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const publicRoutes = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Não verificar auth em rotas públicas
      if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
      }

      try {
        const domainUser = await authRepository.getMe();
        setUser(domainUser);
      } catch {
        // Não autenticado — redirecionar pro login
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch {
      // Ignorar erros de logout
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
