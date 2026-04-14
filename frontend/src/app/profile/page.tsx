"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, ChefHat, Edit3, Save } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Acsa Silveira",
    email: "acsa@lacuisine.com",
    phone: "(81) 99999-0000",
    location: "Recife, PE",
    specialty: "Confeitaria Artesanal",
  });

  const fields = [
    { key: "name" as const, label: "Nome do Chef", icon: User },
    { key: "email" as const, label: "E-mail", icon: Mail },
    { key: "phone" as const, label: "Telefone", icon: Phone },
    { key: "location" as const, label: "Localização", icon: MapPin },
    { key: "specialty" as const, label: "Especialidade", icon: ChefHat },
  ];

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-graphite">Meu Perfil</h1>
          <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">
            Configurações da Conta
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 rounded-full border border-graphite/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold active:scale-95"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative h-24 w-24 rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <ChefHat className="h-10 w-10 text-gold" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-graphite">{profile.name}</h2>
        <p className="text-graphite/40 text-sm mt-1">{profile.specialty}</p>
      </div>

      {/* Fields */}
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
                {isEditing ? (
                  <input
                    type="text"
                    value={profile[field.key]}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors mt-1"
                  />
                ) : (
                  <p className="text-lg text-graphite mt-1">{profile[field.key]}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { label: "Receitas", value: "24" },
          { label: "Menus", value: "6" },
          { label: "Fichas", value: "18" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl border border-graphite/5 bg-card p-4"
          >
            <span className="font-serif text-2xl font-bold text-gold">{stat.value}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-graphite/30 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
