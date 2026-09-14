import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  BookOpen, 
  HelpCircle, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  suggestions?: string[];
}

export const StudentAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Hello! I am your ScholarTrack AI Assistant. I can help evaluate your eligibility, clarify required documents, explain why a document might show a discrepancy, or guide you through scholarship criteria. What can I assist you with today?',
      timestamp: new Date(),
      suggestions: [
        'Which scholarships am I eligible for?',
        'What documents are needed for National Merit Scholarship?',
        'How is fraud risk calculated for applications?',
        'Why does my income certificate show a mismatch?'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await api.chatWithAI(query);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: response.answer || 'I could not find specific rules matching your query. Please check with an administrator.',
        timestamp: new Date(),
        sources: response.sources,
        suggestions: response.suggestions
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: 'I encountered an error retrieving that information. Please try rephrasing your question or check back in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: 'Chat cleared. How else can I assist your scholarship discovery or verification?',
        timestamp: new Date(),
        suggestions: [
          'Show merit scholarships',
          'Explain eligibility thresholds',
          'Document requirements for SC/ST scholarships'
        ]
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F3040] text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F3040]">ScholarTrack AI Assistant</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                <Sparkles className="w-3 h-3" /> RAG Knowledge Base Active
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Assisting with scheme criteria, document rules, and eligibility guidance
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs font-semibold text-gray-500 hover:text-[#0F3040] p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#0F3040] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                  isAssistant
                    ? 'bg-white border border-gray-200 text-gray-800'
                    : 'bg-[#0F3040] text-white'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Sources & Citations */}
                {isAssistant && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3 h-3 text-[#A56F63]" /> Referenced Guidelines & Schemes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested follow-ups */}
                {isAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-semibold text-[#A56F63] uppercase tracking-wider flex items-center gap-1 mb-2">
                      <Lightbulb className="w-3 h-3" /> Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs bg-white text-[#0F3040] border border-gray-200 hover:border-[#0F3040] hover:bg-gray-50 px-2.5 py-1 rounded-full text-left transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isAssistant ? 'text-gray-400' : 'text-gray-300'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#A56F63] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0F3040] text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm text-sm text-gray-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0F3040]" />
              <span>Analyzing scholarship rules and documents...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about scholarships, eligibility, or documentation..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3040] focus:border-transparent bg-gray-50/50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 bg-[#0F3040] text-white rounded-xl hover:bg-[#1a4b63] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 px-1">
          <span>AI output provides assistive guidance. Final scholarship award decisions remain with official administrators.</span>
          <Link to="/student/scholarships" className="text-[#A56F63] hover:underline inline-flex items-center gap-1 font-medium">
            Explore All Schemes <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentAssistantPage;
