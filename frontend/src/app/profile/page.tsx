"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Phone, MapPin, ChefHat, Edit3, Save, Loader2, X } from "lucide-react";
import { HttpAuthRepository } from "@/data/repositories/HttpAuthRepository";
import { validateUser } from "@/domain/entities/User";
import { useAuth } from "@/providers/AuthProvider";

const authRepository = new HttpAuthRepository();

// Lista de países suportados com DDI, bandeira e máscara correspondente
const COUNTRIES = [
  { name: "Brasil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Estados Unidos", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Espanha", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Itália", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "França", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Reino Unido", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Uruguai", code: "UY", dialCode: "+598", flag: "🇺🇾" },
  { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
  { name: "Moçambique", code: "MZ", dialCode: "+258", flag: "🇲🇿" },
  { name: "Cabo Verde", code: "CV", dialCode: "+238", flag: "🇨🇻" },
  { name: "Outro", code: "OTHER", dialCode: "", flag: "🌐" },
];

const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

// Helper para aplicar máscara de telefone dinamicamente
const maskPhone = (value: string, countryCode: string) => {
  const digits = value.replace(/\D/g, "");

  if (countryCode === "BR") {
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/g, "$1-$2")
        .substring(0, 14);
    } else {
      return digits
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/g, "$1-$2")
        .substring(0, 15);
    }
  }

  if (countryCode === "US") {
    return digits
      .replace(/^(\d{3})(\d)/g, "($1) $2")
      .replace(/(\d{3})(\d)/g, "$1-$2")
      .substring(0, 14);
  }

  if (countryCode === "PT") {
    return digits
      .replace(/(\d{3})(\d)/g, "$1 $2")
      .replace(/(\d{3})(\d{3})/g, "$1 $2")
      .substring(0, 11);
  }

  // Fallback para outros países (apenas números, limite de 15 caracteres)
  return digits.substring(0, 15);
};

// Parser para extrair código do país e número local
const parsePhone = (phoneStr: string) => {
  if (!phoneStr) return { countryCode: "BR", number: "" };

  const matchedCountry = [...COUNTRIES]
    .filter((c) => c.code !== "OTHER")
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((c) => phoneStr.startsWith(c.dialCode));

  if (matchedCountry) {
    const rawNumber = phoneStr.slice(matchedCountry.dialCode.length).replace(/\D/g, "");
    return {
      countryCode: matchedCountry.code,
      number: maskPhone(rawNumber, matchedCountry.code),
    };
  }

  return { countryCode: "BR", number: phoneStr };
};

// Parser para desmembrar localização
const parseLocation = (loc: string) => {
  const defaultLoc = { city: "", state: "", country: "Brasil", customCountry: "" };
  if (!loc) return defaultLoc;
  const parts = loc.split(",").map((p) => p.trim());

  if (parts.length === 3) {
    const [city, state, countryName] = parts;
    const foundCountry = COUNTRIES.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
    if (foundCountry) {
      return { city, state, country: foundCountry.name, customCountry: "" };
    } else {
      return { city, state, country: "Outro", customCountry: countryName };
    }
  }

  if (parts.length === 2) {
    const [city, stateOrCountry] = parts;
    const foundCountry = COUNTRIES.find((c) => c.name.toLowerCase() === stateOrCountry.toLowerCase());
    if (foundCountry) {
      return { city, state: "", country: foundCountry.name, customCountry: "" };
    }
    const isStateCode = BRAZILIAN_STATES.some((s) => s.code.toLowerCase() === stateOrCountry.toLowerCase());
    if (isStateCode) {
      return { city, state: stateOrCountry.toUpperCase(), country: "Brasil", customCountry: "" };
    }
    return { city, state: stateOrCountry, country: "Brasil", customCountry: "" };
  }

  const singlePart = parts[0];
  const foundCountry = COUNTRIES.find((c) => c.name.toLowerCase() === singlePart.toLowerCase());
  if (foundCountry) {
    return { city: "", state: "", country: foundCountry.name, customCountry: "" };
  }
  return { city: singlePart, state: "", country: "Brasil", customCountry: "" };
};

// Formatação amigável do telefone para visualização
const formatPhoneForView = (phoneStr: string) => {
  if (!phoneStr) return "—";
  const { countryCode, number } = parsePhone(phoneStr);
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (country && number) {
    return `${country.flag} ${country.dialCode} ${number}`;
  }
  return phoneStr;
};

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

  const [profileBackup, setProfileBackup] = useState<typeof profile | null>(null);

  // Estados locais para edição estruturada
  const [phoneCountry, setPhoneCountry] = useState("BR");
  const [phoneNum, setPhoneNum] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("Brasil");
  const [customCountry, setCustomCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Cidades do estado brasileiro selecionado
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

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

  // Carregar cidades via API do IBGE caso mude o estado no Brasil
  useEffect(() => {
    if (selectedCountry === "Brasil" && selectedState) {
      setLoadingCities(true);
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`
      )
        .then((res) => res.json())
        .then((data) => {
          setCities(data.map((city: { nome: string }) => city.nome));
        })
        .catch((err) => {
          console.error("Erro ao carregar cidades:", err);
          setCities([]);
        })
        .finally(() => {
          setLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const handleStartEditing = () => {
    setProfileBackup({ ...profile });

    // Parse phone
    const { countryCode, number } = parsePhone(profile.phone);
    setPhoneCountry(countryCode);
    setPhoneNum(number);

    // Parse location
    const { city, state, country, customCountry: customCountryVal } = parseLocation(profile.location);
    setSelectedCountry(country);
    setCustomCountry(customCountryVal);
    setSelectedState(state);
    setSelectedCity(city);

    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (profileBackup) {
      setProfile(profileBackup);
    }
    setError("");
    setIsEditing(false);
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setSelectedState("");
    setSelectedCity("");
    setCustomCountry("");
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedCity("");
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const validationErrors = validateUser({ fullName: profile.fullName });
    if (validationErrors.fullName) {
      setError(validationErrors.fullName || "");
      setSaving(false);
      return;
    }

    // Format phone for DB (+DDI + numbers)
    let finalPhone = "";
    if (phoneNum.trim()) {
      const dialCode = COUNTRIES.find((c) => c.code === phoneCountry)?.dialCode || "";
      finalPhone = `${dialCode}${phoneNum.replace(/\D/g, "")}`;
    }

    // Format location for DB
    let finalCountry = selectedCountry;
    if (selectedCountry === "Outro") {
      finalCountry = customCountry.trim() || "Outro";
    }

    const locParts = [];
    if (selectedCity.trim()) locParts.push(selectedCity.trim());
    if (selectedState.trim()) locParts.push(selectedState.trim());
    if (finalCountry.trim()) locParts.push(finalCountry.trim());
    const finalLocation = locParts.join(", ");

    try {
      const updatedUser = await authRepository.updateProfile(
        profile.fullName,
        finalPhone || null,
        finalLocation || null,
        profile.specialty || null
      );

      const newProfile = {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        specialty: updatedUser.specialty || "",
      };

      setProfile(newProfile);
      setUser(updatedUser);
      setIsEditing(false);
    } catch {
      setError("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

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
          onClick={isEditing ? handleCancelEditing : handleStartEditing}
          disabled={saving}
          className="flex items-center gap-2 rounded-full border border-graphite/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {isEditing ? "Cancelar" : "Editar"}
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
        {/* Nome do Chef */}
        <div className="flex items-center gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all">
          <div className="rounded-xl bg-gold/10 p-3">
            <UserIcon className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
              Nome do Chef
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors mt-1"
              />
            ) : (
              <p className="text-lg text-graphite mt-1">{profile.fullName || "—"}</p>
            )}
          </div>
        </div>

        {/* E-mail */}
        <div className="flex items-center gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all opacity-85">
          <div className="rounded-xl bg-gold/10 p-3">
            <Mail className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
              E-mail (Não editável)
            </label>
            <p className="text-lg text-graphite/60 mt-1">{profile.email || "—"}</p>
          </div>
        </div>

        {/* Telefone */}
        <div className="flex items-center gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all">
          <div className="rounded-xl bg-gold/10 p-3">
            <Phone className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
              Telefone
            </label>
            {isEditing ? (
              <div className="flex gap-2 w-full mt-1">
                <select
                  value={phoneCountry}
                  onChange={(e) => {
                    setPhoneCountry(e.target.value);
                    setPhoneNum((prev) => maskPhone(prev.replace(/\D/g, ""), e.target.value));
                  }}
                  className="bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1 shrink-0 w-24 cursor-pointer"
                >
                  {COUNTRIES.filter((c) => c.code !== "OTHER").map((c) => (
                    <option key={c.code} value={c.code} className="bg-card text-graphite">
                      {c.flag} {c.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder={phoneCountry === "BR" ? "(00) 00000-0000" : "Telefone"}
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(maskPhone(e.target.value, phoneCountry))}
                  className="flex-1 bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1"
                />
              </div>
            ) : (
              <p className="text-lg text-graphite mt-1">{formatPhoneForView(profile.phone)}</p>
            )}
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-start gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all">
          <div className="rounded-xl bg-gold/10 p-3 mt-1">
            <MapPin className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
              Localização
            </label>
            {isEditing ? (
              <div className="flex flex-col gap-3 mt-2 w-full">
                {/* País */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                    País
                  </span>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1 cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-card text-graphite">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Se for Outro País, digitar nome do país */}
                {selectedCountry === "Outro" && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                      Especificar País
                    </span>
                    <input
                      type="text"
                      placeholder="Nome do país"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1"
                    />
                  </div>
                )}

                {/* Estado */}
                {selectedCountry === "Brasil" ? (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                      Estado
                    </span>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1 cursor-pointer"
                    >
                      <option value="" className="bg-card text-graphite/40">
                        Selecione o Estado
                      </option>
                      {BRAZILIAN_STATES.map((s) => (
                        <option key={s.code} value={s.code} className="bg-card text-graphite">
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                      Estado/Província
                    </span>
                    <input
                      type="text"
                      placeholder="Nome do Estado/Região"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1"
                    />
                  </div>
                )}

                {/* Cidade */}
                {selectedCountry === "Brasil" ? (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                      Cidade
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState || loadingCities}
                      className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1 cursor-pointer disabled:opacity-40"
                    >
                      <option value="" className="bg-card text-graphite/40">
                        {loadingCities
                          ? "Carregando cidades..."
                          : !selectedState
                          ? "Selecione o Estado primeiro"
                          : "Selecione a Cidade"}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city} className="bg-card text-graphite">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-graphite/40 uppercase tracking-widest mb-1">
                      Cidade
                    </span>
                    <input
                      type="text"
                      placeholder="Nome da Cidade"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-base text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors py-1"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg text-graphite mt-1">{profile.location || "—"}</p>
            )}
          </div>
        </div>

        {/* Especialidade */}
        <div className="flex items-center gap-4 rounded-2xl border border-graphite/5 bg-card p-4 transition-all">
          <div className="rounded-xl bg-gold/10 p-3">
            <ChefHat className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
              Especialidade
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, specialty: e.target.value }))
                }
                className="w-full bg-transparent text-lg text-graphite outline-none border-b border-gold/30 focus:border-gold transition-colors mt-1"
              />
            ) : (
              <p className="text-lg text-graphite mt-1">{profile.specialty || "—"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Salvar Alterações no rodapé (visível apenas em edição) */}
      {isEditing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-graphite text-cream px-6 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:bg-gold active:scale-95 disabled:opacity-60 mt-10 cursor-pointer shadow-md hover:shadow-lg"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin text-cream" />
          ) : (
            <Save className="h-4 w-4 text-cream" />
          )}
          {saving ? "Salvando Alterações..." : "Salvar Alterações"}
        </button>
      )}
    </div>
  );
}
