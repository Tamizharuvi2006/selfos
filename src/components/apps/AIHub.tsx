import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
const AIHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I am SelfOS AI. How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTimeout(() => {
      const botResponse: Message = { id: Date.now() + 1, text: "This is a mocked response from the AI. Full integration is coming soon!", sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <header className="p-4 border-b text-center font-bold">AI Hub</header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'bot' && <Bot className="w-6 h-6 text-accent" />}
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
              }`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && <User className="w-6 h-6" />}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message SelfOS AI..."
            className="flex-1 resize-none"
            rows={1}
          />
          <Button onClick={handleSend}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
};
export default AIHub;