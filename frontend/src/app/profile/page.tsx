"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Phone, MapPin, ChefHat, Edit3, Save, Loader2 } from "lucide-react";
import { HttpAuthRepository } from "@/data/repositories/HttpAuthRepository";
import { validateUser } from "@/domain/entities/User";
import { useAuth } from "@/providers/AuthProvider";

const authRepository = new HttpAuthRepository();

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialty: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const domainUser = await authRepository.getMe();
        setProfile({
          fullName: domainUser.fullName || "",
          email: domainUser.email || "",
          phone: domainUser.phone || "",
          location: domainUser.location || "",
          specialty: domainUser.specialty || "",
        });
      } catch (err: unknown) {
        const apiError = err as { response?: { status?: number } };
        setError(apiError.response?.status === 401 ? "Faça login para ver seu perfil." : "Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const validationErrors = validateUser({ fullName: profile.fullName });
    if (validationErrors.fullName) {
      setError(validationErrors.fullName || "");
      setSaving(false);
      return;
    }

    try {
      const updatedUser = await authRepository.updateProfile(
        profile.fullName,
        profile.phone || null,
        profile.location || null,
        profile.specialty || null
      );
      setProfile({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        specialty: updatedUser.specialty || "",
      });
      // Atualizar o estado global para atualizar na Sidebar imediatamente
      setUser(updatedUser);
      setIsEditing(false);
    } catch {
      setError("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "fullName" as const, label: "Nome do Chef", icon: UserIcon },
    { key: "email" as const, label: "E-mail", icon: Mail, readOnly: true },
    { key: "phone" as const, label: "Telefone", icon: Phone },
    { key: "location" as const, label: "Localização", icon: MapPin },
    { key: "specialty" as const, label: "Especialidade", icon: ChefHat },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error && !profile.email) {
    return (
      <div className="text-center py-20">
        <p className="text-graphite/40 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-graphite">Meu Perfil</h1>
          <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">
            Configurações da Conta
          </p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
          className="flex items-center gap-2 rounded-full border border-graphite/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold active:scale-95 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {saving ? "Salvando" : isEditing ? "Salvar" : "Editar"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center mb-10">
        <div className="relative h-24 w-24 rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <ChefHat className="h-10 w-10 text-gold" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-graphite">{profile.fullName}</h2>
        <p className="text-graphite/40 text-sm mt-1">{profile.specialty || "Chef"}</p>
      </div>

      <div className="space-y-6">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className="flex items-center gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all"
            >
              <div className="rounded-xl bg-gold/10 p-3">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
                  {field.label}
                </label>
                {isEditing && !field.readOnly ? (
                  <input
                    type="text"
                    value={profile[field.key]}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors mt-1"
                  />
                ) : (
                  <p className="text-lg text-graphite mt-1">{profile[field.key] || "—"}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
