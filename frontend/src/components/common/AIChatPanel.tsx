import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bot, Send, Sparkles, X, ChevronUp, ChevronDown, User as UserIcon, BookOpen } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
  suggestions?: string[];
  timestamp: string;
}

interface Props {
  floating?: boolean;
}

export const AIChatPanel: React.FC<Props> = ({ floating = false }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!floating);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${user?.fullName || 'there'}! I am ScholarTrack AI, your intelligent scholarship advisor. Ask me about eligibility rules, required documents, application status, or deadlines.`,
      sources: ['ScholarTrack Knowledge Engine'],
      suggestions: [
        'Which scholarships am I eligible for?',
        'What documents do I need?',
        'What is the deadline for National Merit?',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await api.chatWithAI(textToSend, user?.profileId);
      const aiMsg: Message = {
        sender: 'ai',
        text: response.answer,
        sources: response.sources,
        suggestions: response.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'I am currently processing your scholarship parameters. Please verify your connection or ask about standard scheme requirements.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Floating trigger button when collapsed
  if (floating && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#0F3040] text-white rounded-full shadow-2xl hover:bg-[#0A202B] hover:scale-105 transition-all flex items-center gap-2 border-2 border-[#D99B7F]"
        title="Chat with ScholarTrack AI"
      >
        <Sparkles className="w-5 h-5 text-[#D99B7F] animate-pulse" />
        <span className="text-xs font-bold tracking-wide">ScholarTrack AI</span>
      </button>
    );
  }

  const containerClass = floating
    ? 'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5'
    : 'w-full h-[650px] bg-white rounded-2xl shadow-soft border border-slate-200/90 flex flex-col overflow-hidden';

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="bg-[#0F3040] p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#D99B7F]/20 rounded-lg text-[#D99B7F]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight">ScholarTrack AI</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#D99B7F] text-[#0F3040]">
                RAG v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Intelligent Scholarship Assistant</p>
          </div>
        </div>

        {floating && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-1.5 max-w-[85%]">
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-[#0F3040] text-[#D99B7F] flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0F3040] text-white rounded-br-none shadow-sm'
                    : 'bg-white text-[#464858] border border-slate-200/80 rounded-bl-none shadow-soft'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                    <BookOpen className="w-3 h-3 text-[#A56F63]" />
                    <span>Grounding Sources:</span>
                    {m.sources.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.2 bg-slate-100 rounded text-[#0F3040] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>

            {/* AI Suggested Prompts */}
            {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {m.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] font-medium text-[#0F3040] bg-white border border-[#D99B7F]/60 hover:bg-[#D99B7F]/10 px-2.5 py-1 rounded-full shadow-2xs transition-all text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded-xl border border-slate-200 max-w-[200px]">
            <Sparkles className="w-4 h-4 text-[#D99B7F] animate-spin" />
            <span>Consulting scholarship knowledge base...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about eligibility, requirements, deadlines..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F3040] focus:ring-1 focus:ring-[#0F3040]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#0F3040] text-white rounded-xl hover:bg-[#0A202B] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
