"use client";

import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá Chef! Como posso ajudar na sua cozinha hoje? Você pode me pedir para criar uma ficha técnica, montar um menu ou tirar dúvidas culinárias.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/api/chat/copilot", {
        message: content,
      });

      const data = response.data;
      let aiContent = "";

      if (data.type === "text") {
        aiContent = data.data.message;
      } else if (data.type === "recipe") {
        const r = data.data;
        aiContent = `🍽️ **${r.title}** (${r.category})\n\nRendimento: ${r.yield_amount} ${r.yield_unit}\n\n**Ingredientes:**\n${r.ingredients?.map((i: any) => `• ${i.amount} ${i.unit} ${i.name}`).join("\n") || "—"}\n\n**Modo de Preparo:**\n${r.steps?.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n") || "—"}`;
      } else if (data.type === "menu") {
        aiContent = `📋 **Sugestões de Menu:**\n\n${data.data.menus?.map((m: any, i: number) => `**Menu ${i + 1}:**\n• Entrada: ${m.entrada.name}\n• Principal: ${m.principal.name}\n• Sobremesa: ${m.sobremesa.name}\n${m.justificativa ? `💡 ${m.justificativa}` : ""}`).join("\n\n") || "—"}`;
      } else {
        aiContent = JSON.stringify(data.data);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMsg = err.response?.status === 401
        ? "Você precisa estar logado para usar o Agente. Vá para /login primeiro."
        : err.response?.data?.detail || "Ocorreu um erro ao processar sua mensagem. Tente novamente.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-4 md:px-8 max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto pt-8 pb-48 space-y-10">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-graphite/30 mb-2">
                {message.role === "assistant" ? "Agente LaCuisine" : "Chef"}
              </span>
              <p className={message.role === "assistant" ? "font-serif text-xl sm:text-2xl leading-relaxed text-graphite whitespace-pre-line" : "font-sans text-lg text-graphite/70"}>
                {message.content}
              </p>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-graphite/30 mb-2">
                Agente LaCuisine
              </span>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2.5 w-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2.5 w-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-cream via-cream to-transparent pt-10 pb-6 px-4 md:px-8 md:bottom-6 md:left-64 z-30">
        <div className="max-w-4xl mx-auto">
          <QuickActions onActionClick={handleSendMessage} />
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
