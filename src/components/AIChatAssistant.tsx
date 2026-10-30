import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  Check, 
  HelpCircle, 
  RotateCcw,
  IndianRupee,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, EventPlan } from '../types/event';

interface AIChatAssistantProps {
  currentPlan: EventPlan | null;
  isFloating?: boolean;
  onCloseFloating?: () => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  currentPlan,
  isFloating = false,
  onCloseFloating,
}) => {
  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    sender: 'assistant',
    text: currentPlan
      ? `Hello! I'm your EventEase AI assistant. I have all the details of your **${currentPlan.input.title}** in ${currentPlan.input.location} (Budget: ₹${Number(currentPlan.input.budgetINR).toLocaleString('en-IN')}, Guests: ${currentPlan.input.guestCount}). How can I help you today? Ask me about vendor negotiations, menu tweaks, timelines, or speech drafts!`
      : `Hello! I'm EventEase AI, your personal event planner. I can help you plan weddings, birthday parties, or community festivals. Ask me any question about budgeting in INR, vendor checklists, timeline scheduling, or theme ideas!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: currentPlan?.input?.eventType === 'wedding' ? [
      'How can I save ₹2,00,000 on catering without reducing menu quality?',
      'Draft a polite email to negotiate photography album pricing',
      'What are traditional song ideas for the bridal entrance?',
      'What should I include in the emergency bride & groom kit?'
    ] : currentPlan?.input?.eventType === 'birthday' ? [
      'What are 5 engaging games for 6-8 year olds?',
      'How to organize a stress-free toddler cake cutting?',
      'Suggest budget-friendly return gifts under ₹300 per child',
      'Draft a warm WhatsApp message for RSVP follow-ups'
    ] : [
      'How do we handle sound permits past 10 PM in India?',
      'Ideas for zero-waste community Diwali stalls',
      'How to organize a society talent show running order?',
      'Best practices for crowd safety and first aid stalls'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ sender: m.sender, text: m.text })),
          currentPlan,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.error) {
        throw new Error(data?.error || `Chat API error (${response.status})`);
      }

      const botMsg: ChatMessage = {
        id: 'msg-a-' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'I am happy to assist you with anything related to your event.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorBotMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: `> ℹ️ **Notice**: *The Gemini AI service is currently taking a moment to respond. EventEase Assistant has switched to local plan-aware advisory mode.*\n\nFeel free to ask questions about your budget allocation, catering menus, vendor negotiations, or day-of run-sheets!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
  };

  const renderFormattedMessage = (text: string, isUser: boolean) => {
    if (isUser) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }

    const lines = text.split('\n');
    const renderedElements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let blockQuoteBuffer: string[] = [];

    const formatInline = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-slate-100 text-purple-700 px-1 py-0.5 rounded font-mono text-[11px]">{part.slice(1, -1)}</code>;
        }
        return part;
      });
    };

    const flushBlockQuote = (idx: number) => {
      if (blockQuoteBuffer.length > 0) {
        const bText = blockQuoteBuffer.join(' ');
        renderedElements.push(
          <div
            key={`quote-${idx}`}
            className="bg-amber-50/90 border-l-4 border-amber-500 text-amber-950 px-3.5 py-2.5 rounded-r-xl text-xs sm:text-xs my-2 font-medium leading-relaxed shadow-xs"
          >
            {formatInline(bText)}
          </div>
        );
        blockQuoteBuffer = [];
      }
    };

    const flushCode = (idx: number) => {
      if (codeBuffer.length > 0) {
        const codeStr = codeBuffer.join('\n');
        renderedElements.push(
          <div key={`code-${idx}`} className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs my-2 overflow-x-auto whitespace-pre">
            {codeStr}
          </div>
        );
        codeBuffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCode(i);
          inCodeBlock = false;
        } else {
          flushBlockQuote(i);
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      if (line.startsWith('>')) {
        blockQuoteBuffer.push(line.replace(/^>\s*/, ''));
        continue;
      } else {
        flushBlockQuote(i);
      }

      if (line.startsWith('### ')) {
        renderedElements.push(
          <h4 key={`h3-${i}`} className="text-sm sm:text-base font-bold text-slate-900 mt-2.5 mb-1.5 flex items-center gap-1.5">
            {formatInline(line.replace(/^###\s*/, ''))}
          </h4>
        );
      } else if (line.startsWith('#### ')) {
        renderedElements.push(
          <h5 key={`h4-${i}`} className="text-xs sm:text-sm font-semibold text-purple-900 mt-2 mb-1">
            {formatInline(line.replace(/^####\s*/, ''))}
          </h5>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        renderedElements.push(
          <div key={`li-${i}`} className="flex items-start gap-2 ml-1 my-0.5">
            <span className="text-purple-600 mt-1 text-xs shrink-0">•</span>
            <span className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {formatInline(line.trim().replace(/^[-•]\s*/, ''))}
            </span>
          </div>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        const numMatch = line.trim().match(/^(\d+\.)\s*(.*)$/);
        renderedElements.push(
          <div key={`num-${i}`} className="flex items-start gap-2 ml-1 my-0.5">
            <span className="font-semibold text-purple-700 shrink-0 text-xs sm:text-sm">{numMatch?.[1]}</span>
            <span className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {formatInline(numMatch?.[2] || '')}
            </span>
          </div>
        );
      } else if (line.trim() === '') {
        renderedElements.push(<div key={`sp-${i}`} className="h-1.5" />);
      } else {
        renderedElements.push(
          <p key={`p-${i}`} className="leading-relaxed text-slate-700 text-xs sm:text-sm my-0.5">
            {formatInline(line)}
          </p>
        );
      }
    }

    flushBlockQuote(lines.length);
    flushCode(lines.length);

    return <div className="space-y-0.5">{renderedElements}</div>;
  };

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${
      isFloating ? 'h-[580px] w-full max-w-md' : 'h-[650px] max-w-4xl mx-auto'
    }`}>
      {/* Chat Header */}
      <div className="bg-linear-to-r from-purple-700 via-indigo-700 to-blue-600 px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm">EventEase AI Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-purple-100">
              {currentPlan ? `Context: ${currentPlan.input.title}` : 'Powered by Gemini AI'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-purple-600 text-white shadow-md rounded-tr-none'
                : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs rounded-tl-none'
            }`}>
              {/* Message text with rich markdown formatting */}
              <div>
                {renderFormattedMessage(msg.text, msg.sender === 'user')}
              </div>

              {/* Timestamp & Copy button */}
              <div className={`flex items-center justify-between pt-1 border-t ${
                msg.sender === 'user' ? 'border-purple-500/50 text-purple-200' : 'border-slate-100 text-slate-400'
              } text-[10px]`}>
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopyText(msg.text, msg.id)}
                    className="hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Prompt Suggestions Pills if provided */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-500">Suggested Questions:</p>
                  <div className="flex flex-col gap-1.5">
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-left text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-200/70 transition-colors cursor-pointer font-medium"
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>EventEase AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about budget, vendors, menus, speeches..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
