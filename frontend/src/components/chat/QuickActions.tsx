"use client";

import { motion } from "framer-motion";

interface QuickActionsProps {
  onActionClick: (text: string) => void;
}

const actions = [
  "Quero criar uma ficha técnica",
  "Monte um menu de época",
  "Analisar foto de receita",
  "Sugestão de prato com sobras",
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 px-1">
      {actions.map((action, index) => (
        <motion.button
          key={action}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onActionClick(action)}
          className="rounded-full border border-graphite/10 bg-cream/50 px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-graphite/60 transition-all hover:border-gold hover:text-gold hover:bg-card active:scale-95 shadow-sm"
        >
          {action}
        </motion.button>
      ))}
    </div>
  );
}
