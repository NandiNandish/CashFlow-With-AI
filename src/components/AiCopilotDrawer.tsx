import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Cpu, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { UserFinancialState } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserFinancialState;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  userState,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello Priya! I'm your Paytm CashFlow AI copilot. I'm actively monitoring your current balance of ₹28,000, your ₹52,000 income schedule, and upcoming obligations. How can I help you plan?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Why is my projected balance falling?',
    'Where am I spending the most?',
    'What expenses are increasing?',
    'What happens if I take a ₹2 lakh loan?',
    'How can I increase my monthly buffer?',
    'Show me my biggest spending changes.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            currentBalance: userState.currentBalance,
            monthlyIncome: userState.monthlyIncome,
            monthlyExpenses: userState.monthlyExpenses,
            projectedBuffer: userState.projectedBuffer,
            rentAmount: userState.rentAmount,
            emiAmount: userState.emiAmount,
            typicalSpending: userState.typicalSpending,
          },
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Based on your synthetic demo account (Balance ₹28,000, Rent ₹12,000, EMI ₹6,500), your primary cash-flow pressure occurs around Week 3 before your salary deposit. You can safely simulate different loan amounts in the "What If?" tab.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="ai-copilot-drawer"
        className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Ask CashFlow AI
                </h3>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                  COPILOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in your synthetic account data
              </p>
            </div>
          </div>

          <button
            id="btn-close-copilot-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Prompts Carousel/Pills */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Suggested Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`chip-prompt-${idx}`}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1.5 text-right font-mono ${
                      isUser ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>CashFlow AI is analyzing your financial data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="input-copilot-message"
              type="text"
              placeholder="Ask about spending, buffer, or loan impact..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              id="btn-send-copilot-msg"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-500 text-center mt-1.5">
            Synthetic demo environment • Transparent AI assistance
          </div>
        </div>
      </div>
    </div>
  );
};
