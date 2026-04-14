"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  category: string;
  image: string;
  cost: string;
  yield: string;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group flex flex-col bg-card overflow-hidden rounded-2xl shadow-sm border border-graphite/5 transition-all hover:shadow-md h-fit">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-cream/90 backdrop-blur-sm px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-graphite rounded-lg">
            {recipe.category}
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight text-graphite mb-3">
          {recipe.title}
        </h3>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold hover:text-graphite transition-colors"
        >
          <span>Gestão Financeira</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-2 border-t border-graphite/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-graphite/40 text-[10px] uppercase font-bold tracking-tight">Custo Estimado</span>
                  <span className="text-graphite font-serif text-base">{recipe.cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-graphite/40 text-[10px] uppercase font-bold tracking-tight">Rendimento</span>
                  <span className="text-graphite font-serif text-base">{recipe.yield}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
