"use client";

import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { motion, AnimatePresence } from "framer-motion";

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
      content: "Olá Chef! Como posso ajudar na sua cozinha hoje? Você pode me enviar uma foto de uma receita ou descrever um prato para criarmos algo novo.",
    },
  ]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Com certeza! Vou analisar essa ideia culinária para você. Gostaria que eu buscasse nos seus menus de época ou criássemos uma ficha técnica do zero?",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
              <p className={message.role === "assistant" ? "font-serif text-xl sm:text-2xl leading-relaxed text-graphite" : "font-sans text-lg text-graphite/70"}>
                {message.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
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
