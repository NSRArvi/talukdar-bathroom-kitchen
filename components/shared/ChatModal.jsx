"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Headset } from "lucide-react";

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSignedIn(true);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "agent",
        text: `Hi ${name.split(" ")[0]}, thanks for reaching out. How can we help?`,
      },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: input.trim() },
    ]);
    setInput("");
    // API call goes here later
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[520px] w-80 sm:w-[350px] flex-col overflow-hidden rounded-2xl border border-[#785d32]/30 bg-[#050a30] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#785d32]/20 bg-[#050a30] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-full bg-[#785d32]/20 ring-1 ring-[#785d32]/40">
                  <Headset className="size-5 text-[#785d32]" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-[#050a30]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#e8d9c4]">Support</p>
                  <p className="text-xs font-medium text-[#e8d9c4]/60">
                    Typically replies in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex size-8 items-center justify-center rounded-full text-[#e8d9c4]/50 transition-colors hover:bg-[#785d32]/20 hover:text-[#e8d9c4]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            {!isSignedIn ? (
              <form
                onSubmit={handleSignIn}
                className="flex flex-1 flex-col justify-center gap-4 px-6 py-6"
              >
                <div className="mb-2 text-center">
                  <h3 className="mb-1 text-lg font-medium text-[#e8d9c4]">Welcome!</h3>
                  <p className="text-sm text-[#e8d9c4]/70">
                    Please fill in your details to start chatting.
                  </p>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-[#785d32]/30 bg-[#e8d9c4]/5 px-4 py-2.5 text-sm text-[#e8d9c4] placeholder-[#e8d9c4]/40 outline-none transition-all focus:border-[#785d32] focus:ring-1 focus:ring-[#785d32]"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full rounded-xl border border-[#785d32]/30 bg-[#e8d9c4]/5 px-4 py-2.5 text-sm text-[#e8d9c4] placeholder-[#e8d9c4]/40 outline-none transition-all focus:border-[#785d32] focus:ring-1 focus:ring-[#785d32]"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-[#785d32] py-2.5 text-sm font-semibold text-[#e8d9c4] transition-colors hover:bg-[#634c29] active:scale-[0.98]"
                >
                  Start Chat
                </button>
              </form>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#785d32]/30 scrollbar-track-transparent"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                          m.role === "user"
                            ? "rounded-br-sm bg-[#785d32] text-[#e8d9c4]"
                            : "rounded-bl-sm border border-[#785d32]/20 bg-[#e8d9c4]/10 text-[#e8d9c4]"
                        }`}
                      >
                        {m.text}
                      </motion.div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-3 border-t border-[#785d32]/20 bg-[#050a30] px-5 py-4"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-[#785d32]/30 bg-[#e8d9c4]/5 px-4 py-2.5 text-sm text-[#e8d9c4] placeholder-[#e8d9c4]/40 outline-none transition-all focus:border-[#785d32] focus:ring-1 focus:ring-[#785d32]"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#785d32] text-[#e8d9c4] transition-colors hover:bg-[#634c29] active:scale-95 disabled:opacity-50 disabled:hover:bg-[#785d32]"
                    disabled={!input.trim()}
                  >
                    <Send className="size-4.5 -ml-0.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="flex size-14 items-center justify-center rounded-full bg-[#785d32] text-[#e8d9c4] shadow-xl ring-4 ring-[#785d32]/20 transition-all hover:scale-105 hover:bg-[#634c29] active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="size-6" />
            ) : (
              <MessageCircle className="size-6" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
