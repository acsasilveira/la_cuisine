"use client";

import { useState, useRef } from "react";
import { Sparkles, Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex flex-col gap-2 rounded-3xl border border-graphite/10 bg-card/50 p-2 backdrop-blur-md transition-all focus-within:border-gold/50 shadow-sm">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Descreva seu prato ou envie uma foto..."
        className="max-h-40 w-full resize-none bg-transparent px-4 py-3 text-lg text-graphite outline-none placeholder:text-graphite/30 border-0 focus-visible:ring-0 focus-visible:border-0 shadow-none min-h-0 focus-visible:ring-offset-0 focus-visible:ring-ring/0"
      />
      
      <div className="flex items-center justify-between border-t border-graphite/5 pb-1 pt-1">
        <div className="flex gap-2 pl-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="flex items-center justify-center p-2 text-graphite/40 hover:text-gold transition-colors cursor-pointer border-0 hover:bg-transparent" 
            title="Enviar Foto"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="group flex items-center justify-center rounded-2xl bg-gold px-4 py-2 text-cream transition-all hover:bg-graphite disabled:opacity-30 disabled:hover:bg-gold cursor-pointer border-0 h-10"
        >
          <span className="mr-2 text-sm font-bold uppercase tracking-widest hidden sm:inline">Gerar</span>
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
