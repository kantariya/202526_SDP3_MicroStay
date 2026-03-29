import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "../../utils/api";
import HotelCard from "./HotelCard";

function ChatBot({ favorites = new Set(), setFavorites = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      if (!saved) return [
        { role: "bot", content: "Hi! I'm your Hotel Assistant. How can I help you today?" }
      ];
      
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [
        { role: "bot", content: "Hi! I'm your Hotel Assistant. How can I help you today?" }
      ];
      
      // Clean up any surviving objects in content during load
      return parsed.map(msg => ({
        ...msg,
        content: typeof msg.content === 'string' ? msg.content : ""
      }));
    } catch (err) {
      console.error("Failed to parse chat history", err);
      return [
        { role: "bot", content: "Hi! I'm your Hotel Assistant. How can I help you today?" }
      ];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Persist chat history to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await api.post("/chat/search", userMessage, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      const botData = res.data;

      const safeContent =
        typeof botData === "string"
          ? botData
          : typeof botData?.message === "string"
          ? botData.message
          : "";

      const safeHotels =
        Array.isArray(botData)
          ? botData
          : Array.isArray(botData?.hotels)
          ? botData.hotels
          : botData?.id
          ? [botData]
          : [];

      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          content: safeContent,
          hotels: safeHotels
        }
      ]);
    } catch (error) {
      console.error("ChatBot error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I'm having trouble connecting to the server. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-[400px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Hotel Assistant</h3>
                <p className="text-xs text-slate-400">Online | AI Powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={clsx(
                  "flex w-full flex-col",
                  chat.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div className={clsx(
                  "flex w-full gap-2",
                  chat.role === "user" ? "justify-end" : "justify-start"
                )}>
                  {chat.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                  <div
                    className={clsx(
                      "max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm",
                      chat.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    )}
                  >
                    {typeof chat.content === "string" ? chat.content : ""}
                  </div>
                  {chat.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Hotel Results */}
                {Array.isArray(chat.hotels) && (
                  <div className="mt-4 grid grid-cols-1 gap-4 w-full pl-10 pr-4">
                    {chat.hotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        favorites={favorites}
                        setFavorites={setFavorites}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-slate-600" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
          isOpen ? "bg-white text-slate-900 rotate-90" : "bg-slate-900 text-white"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}

export default ChatBot;
