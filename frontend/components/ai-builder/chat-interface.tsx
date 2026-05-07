"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (message: string) => void;
  isInitializing?: boolean;
}

const PROMPTS = [
  "I'm a software engineer with 3 years of React experience",
  "I worked at Google as a backend developer",
  "Add my skills: Python, AWS, Docker, SQL",
];

export function ChatInterface({ messages, isSending, onSendMessage, isInitializing }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending && !isInitializing) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[20px] border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[12px] bg-[#1C4ED6]/5 border border-[#1C4ED6]/10 flex items-center justify-center">
          <MessageSquare size={16} className="text-[#1C4ED6]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900 font-manrope">AI Chat</h3>
          <p className="text-[10px] text-neutral-500 font-medium">Tell the AI about yourself</p>
        </div>
        {isInitializing && (
          <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-[#1C4ED6] bg-[#1C4ED6]/5 px-3 py-1 rounded-full border border-[#1C4ED6]/10">
            <Loader2 className="h-3 w-3 animate-spin" /> Connecting...
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && !isInitializing && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-[20px] bg-[#1C4ED6]/5 border border-[#1C4ED6]/10 flex items-center justify-center mb-5">
                <Sparkles size={24} className="text-[#1C4ED6]" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-2 font-manrope">Start Building</h4>
              <p className="text-sm text-neutral-500 max-w-xs mb-6 font-medium">
                Tell me about your experience and I&apos;ll build your resume.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => onSendMessage(p)}
                    className="text-left text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-[12px] px-4 py-3 hover:bg-[#1C4ED6]/5 hover:border-[#1C4ED6]/20 hover:text-[#1C4ED6] transition-all font-manrope">
                    &quot;{p}&quot;
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-[16px] px-4 py-3 text-sm font-medium ${
                msg.role === 'user'
                  ? 'bg-[#1C4ED6] text-white rounded-br-sm shadow-[0_4px_12px_rgba(28,78,214,0.2)]'
                  : 'bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1C4ED6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#1C4ED6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#1C4ED6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-neutral-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g. I worked as a frontend engineer at Google..."
            disabled={isSending || isInitializing}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1C4ED6]/50 focus:ring-4 focus:ring-[#1C4ED6]/5 transition-all font-medium disabled:opacity-50"
          />
          <button type="submit" disabled={!inputValue.trim() || isSending || isInitializing}
            className="w-11 h-11 rounded-full bg-[#1C4ED6] text-white flex items-center justify-center shrink-0 disabled:bg-neutral-200 disabled:text-neutral-400 hover:scale-105 active:scale-100 transition-all shadow-[0_4px_12px_rgba(28,78,214,0.3)] disabled:shadow-none">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
