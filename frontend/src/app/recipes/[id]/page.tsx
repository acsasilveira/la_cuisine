"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Users, Flame, Tag, Trash2, Edit3, Loader2, Scale } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface RecipeDetail {
  id: string;
  title: string;
  category: string;
  prep_time_minutes: number;
  yield_amount: number;
  yield_unit: string;
  style: string;
  total_cost?: number;
  cost_per_serving?: number;
  ingredients: {
    amount: number;
    unit: string;
    notes?: string;
    ingredient: { name: string };
  }[];
  steps: {
    step_number: number;
    instruction: string;
  }[];
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err: any) {
        setError(err.response?.status === 404 ? "Receita não encontrada." : "Erro ao carregar receita.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente apagar esta receita? Ela será apagada e caso seja usada em algum Menu, os Menus relatarão dados passados.")) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/recipes/${id}`);
      router.push("/recipes");
    } catch (err) {
      alert("Erro ao excluir a receita.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4">
        <p className="text-graphite/40 text-lg mb-6">{error || "Houve uma falha ao renderizar a receita."}</p>
        <Link 
          href="/recipes"
          className="flex items-center gap-2 rounded-full border border-graphite/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Livro
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
      <header className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-start gap-4">
          <Link href="/recipes" className="p-2 -ml-2 rounded-full hover:bg-graphite/5 transition-colors text-graphite/60 hover:text-graphite shrink-0 mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gold rounded-lg">
                    {recipe.category}
                </span>
                <span className="bg-graphite/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-graphite/40 rounded-lg flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {recipe.style}
                </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-graphite mb-4 leading-tight">{recipe.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-graphite/60 font-medium">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" />
                    {recipe.prep_time_minutes} minutos
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold" />
                    Rende {recipe.yield_amount} {recipe.yield_unit}
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <button
            onClick={() => alert("Sessão de edição virá na próxima atualização!")}
            className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-2 rounded-full border border-graphite/10 text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold"
            title="Editar Receita"
          >
            <Edit3 className="h-4 w-4" /> 
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-2 rounded-full bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest transition-all hover:bg-red-500 hover:text-white disabled:opacity-60"
            title="Excluir Receita"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="hidden sm:inline">Apagar</span>
          </button>
        </div>
      </header>

      {/* Hero Image Placeholder */}
      <div className="w-full aspect-[21/9] bg-graphite/5 rounded-3xl mb-12 overflow-hidden relative">
         <img 
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2000&auto=format&fit=crop" 
            alt="Recipe Visual" 
            className="w-full h-full object-cover opacity-80"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Sidebar Data: Metas & Ingredientes */}
        <div className="md:col-span-1 space-y-8">
            <div className="bg-card rounded-2xl border border-graphite/5 p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-graphite mb-4 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-gold" /> Finanças
                </h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-graphite/40 mb-1">Custo Total Previsto</p>
                        <p className="font-serif text-xl tracking-tight">{recipe.total_cost ? `R$ ${recipe.total_cost.toFixed(2)}` : "Não calculado"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-graphite/40 mb-1">Custo por Porção / Unidade</p>
                        <p className="font-serif text-xl tracking-tight text-gold">{recipe.cost_per_serving ? `R$ ${recipe.cost_per_serving.toFixed(2)}` : "Não calculado"}</p>
                    </div>
                </div>
            </div>

            <div className="bg-transparent">
                <h3 className="font-serif text-xl font-bold text-graphite mb-5">Ingredientes</h3>
                <ul className="space-y-4">
                    {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-baseline justify-between border-b border-graphite/5 pb-3">
                            <span className="text-graphite font-medium">{ing.ingredient?.name || `Ingrediente ${i+1}`}</span>
                            <span className="text-graphite/50 text-sm">{ing.amount} {ing.unit}</span>
                        </li>
                    ))}
                    {recipe.ingredients.length === 0 && (
                        <li className="text-graphite/40 italic text-sm">Sem ingredientes listados.</li>
                    )}
                </ul>
            </div>
        </div>

        {/* Informações Principais: Passos */}
        <div className="md:col-span-2 relative">
            <h3 className="font-serif text-2xl font-bold text-graphite mb-8 flex items-center gap-3">
                <Flame className="h-6 w-6 text-gold" /> Instruções de Preparo
            </h3>
            
            <div className="space-y-10 pl-2">
                {recipe.steps.sort((a,b) => a.step_number - b.step_number).map((step, i) => (
                    <div key={i} className="relative pl-10">
                        {/* Indicador Numérico na Timeline */}
                        <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold font-serif font-bold -ml-[4px]">
                            {step.step_number}
                        </div>
                        {/* Linha vertical timeline (excepto o ultimmo) */}
                        {i !== recipe.steps.length - 1 && (
                            <div className="absolute left-[11px] top-10 bottom-[-32px] w-[2px] bg-graphite/5"></div>
                        )}
                        <p className="text-graphite/80 leading-relaxed pt-1.5">{step.instruction}</p>
                    </div>
                ))}
                {recipe.steps.length === 0 && (
                    <p className="text-graphite/40 italic">Sem instruções de preparo informadas.</p>
                )}
            </div>
        </div>
      </div>

    </div>
  );
}
