import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your DormSC housing assistant. Ask me anything about listings near USC — prices, amenities, distance to campus, and more." },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);

    // placeholder for streaming assistant reply
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const { text } = JSON.parse(payload) as { text: string };
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === 'assistant') {
                updated[updated.length - 1] = { ...last, content: last.content + text };
              }
              return updated;
            });
          } catch { /* ignore malformed chunks */ }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          updated[updated.length - 1] = { ...last, content: 'Sorry, something went wrong. Please try again.' };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-brand px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">DormSC Assistant</p>
                <p className="text-white/70 text-[10px] mt-0.5">Knows all active listings</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-surface text-ink rounded-bl-sm border border-line'
                  }`}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1.5 text-muted">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Thinking…</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-line flex-shrink-0">
            <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-line focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about listings…"
                disabled={streaming}
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-faint outline-none disabled:opacity-60"
              />
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                className="w-7 h-7 bg-brand hover:bg-brand/90 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 bg-brand hover:bg-brand/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open housing assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
