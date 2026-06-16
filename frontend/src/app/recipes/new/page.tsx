"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useRecipes } from "@/hooks/useRecipes";
import { validateRecipe } from "@/domain/entities/Recipe";

export default function NewRecipePage() {
  const router = useRouter();
  const { createRecipe, loading, error, setError } = useRecipes();
  
  // Recipe form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Prato Principal");
  const [yieldAmount, setYieldAmount] = useState<number>(1);
  const [yieldUnit, setYieldUnit] = useState("porção");
  const [prepTime, setPrepTime] = useState<number>(30);
  const [style, setStyle] = useState("Clássica");
  
  // Dynamic lists
  const [ingredients, setIngredients] = useState<{name: string, amount: number, unit: string}[]>([
    { name: "", amount: 1, unit: "unidade" }
  ]);
  const [steps, setSteps] = useState<{step_number: number, instruction: string}[]>([
    { step_number: 1, instruction: "" }
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 1, unit: "unidade" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleUpdateIngredient = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, { step_number: steps.length + 1, instruction: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    // Re-index steps
    const reindexedStats = newSteps.map((step, i) => ({...step, step_number: i + 1}));
    setSteps(reindexedStats);
  };

  const handleUpdateStep = (index: number, instruction: string) => {
    const newSteps = [...steps];
    newSteps[index].instruction = instruction;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Filter and map fields to camelCase structure for domain validation & repository
    const validIngredients = ingredients
      .filter(i => i.name.trim() !== "")
      .map(i => ({ name: i.name, amount: Number(i.amount), unit: i.unit }));
    
    const validSteps = steps
      .filter(s => s.instruction.trim() !== "")
      .map((s, idx) => ({ stepNumber: idx + 1, instruction: s.instruction }));

    const recipeToCreate = {
      title,
      category,
      yieldAmount: Number(yieldAmount),
      yieldUnit,
      prepTimeMinutes: Number(prepTime),
      style,
      ingredients: validIngredients,
      steps: validSteps,
    };

    const validationErrors = validateRecipe(recipeToCreate);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0] || "Erro de validação");
      return;
    }

    try {
      await createRecipe(recipeToCreate);
      router.push("/recipes");
    } catch {
      // Error state is already set by hook
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/recipes" className="p-2 -ml-2 rounded-full hover:bg-graphite/5 transition-colors text-graphite/60 hover:text-graphite">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-graphite">Nova Receita</h1>
            <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">Criação manual</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-graphite px-6 py-2.5 text-sm font-bold tracking-widest text-cream transition-all hover:bg-gold active:scale-95 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Salvar</span>
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Draft IA Upload Button - Placeholder for upcoming IA integration */}
      <div className="mb-8 rounded-2xl border border-dashed border-graphite/20 bg-graphite/5 p-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gold/10 p-3 mb-3">
          <ImagePlus className="h-6 w-6 text-gold" />
        </div>
        <h3 className="font-bold text-graphite mb-1">Preencher via Inteligência Artificial</h3>
        <p className="text-xs text-graphite/50 max-w-sm mb-4">Envie uma foto de um livro ou anotação para o Agente ler e extrair nome, ingredientes e passo a passo automaticamente.</p>
        <button className="text-[10px] font-bold uppercase tracking-widest bg-cream border border-graphite/10 px-4 py-2 rounded-full text-graphite/60 hover:text-gold hover:border-gold transition-colors">
          Upload de imagem
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <section className="bg-card rounded-2xl border border-graphite/5 p-6">
          <h2 className="font-serif text-xl font-bold text-graphite mb-6 border-b border-graphite/5 pb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Título da Receita</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                className="w-full border-b border-graphite/20 bg-transparent py-2 text-lg outline-none focus:border-gold transition-colors"
                placeholder="Ex: Risoto de Funghi Secci"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Categoria</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors cursor-pointer"
              >
                <option value="Entrada">Entrada</option>
                <option value="Prato Principal">Prato Principal</option>
                <option value="Sobremesa">Sobremesa</option>
                <option value="Acompanhamento">Acompanhamento</option>
                <option value="Bebida">Bebida</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Estilo da Cozinha</label>
              <input 
                value={style} 
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                placeholder="Ex: Italiana, Clássica, Contemporânea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Rende (Num)</label>
                <input 
                    type="number" min="0.1" step="0.1"
                    value={yieldAmount} 
                    onChange={(e) => setYieldAmount(Number(e.target.value))}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                />
                </div>
                <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Unidade</label>
                <input 
                    type="text"
                    value={yieldUnit} 
                    onChange={(e) => setYieldUnit(e.target.value)}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                    placeholder="Ex: porções"
                />
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40">Tempo de Prep (Min)</label>
              <input 
                type="number" min="1"
                value={prepTime} 
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Ingredientes */}
        <section className="bg-card rounded-2xl border border-graphite/5 p-6">
          <div className="flex items-center justify-between border-b border-graphite/5 pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-graphite">Ingredientes</h2>
            <button 
              onClick={handleAddIngredient}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold hover:text-graphite transition-colors"
            >
              <Plus className="h-3 w-3" /> Adicionar
            </button>
          </div>
          
          <div className="space-y-4">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="w-full sm:flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/40 opacity-0 hidden sm:block">Nome</label>
                  <input 
                    value={ing.name} 
                    onChange={(e) => handleUpdateIngredient(idx, "name", e.target.value)}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                    placeholder="Nome do Ingrediente"
                  />
                </div>
                <div className="w-full sm:w-24 space-y-1.5">
                  <input 
                    type="number" min="0" step="0.1"
                    value={ing.amount} 
                    onChange={(e) => handleUpdateIngredient(idx, "amount", Number(e.target.value))}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div className="w-full sm:w-32 space-y-1.5">
                  <input 
                    type="text"
                    value={ing.unit} 
                    onChange={(e) => handleUpdateIngredient(idx, "unit", e.target.value)}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors"
                    placeholder="Unidade"
                  />
                </div>
                <button 
                  onClick={() => handleRemoveIngredient(idx)}
                  className="mb-2 p-2 text-graphite/20 hover:text-red-500 transition-colors"
                  title="Remover Ingrediente"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {ingredients.length === 0 && (
                <p className="text-sm text-graphite/40 text-center py-4">Nenhum ingrediente adicionado.</p>
            )}
          </div>
        </section>

        {/* Steps */}
        <section className="bg-card rounded-2xl border border-graphite/5 p-6">
          <div className="flex items-center justify-between border-b border-graphite/5 pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-graphite">Modo de Preparo</h2>
            <button 
              onClick={handleAddStep}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold hover:text-graphite transition-colors"
            >
              <Plus className="h-3 w-3" /> Adicionar Passo
            </button>
          </div>
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gold/10 text-gold font-serif font-bold shrink-0 mt-1">
                  {step.step_number}
                </div>
                <div className="flex-1">
                  <textarea 
                    value={step.instruction} 
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    rows={2}
                    className="w-full border-b border-graphite/20 bg-transparent py-2 text-base outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Descreva a instrução para este passo..."
                  />
                </div>
                <button 
                  onClick={() => handleRemoveStep(idx)}
                  className="mt-2 p-2 text-graphite/20 hover:text-red-500 transition-colors shrink-0"
                  title="Remover Passo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
             {steps.length === 0 && (
                <p className="text-sm text-graphite/40 text-center py-4">Nenhuma instrução adicionada.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
