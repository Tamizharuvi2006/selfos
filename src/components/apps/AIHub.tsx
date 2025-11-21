import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
type Persona = 'Hacker' | 'Calm' | 'Jarvis' | 'Anime';
const personaPrompts: Record<Persona, string> = {
    Hacker: "You are a cybersecurity expert AI. Respond with technical details in a terse, l33t-speak style.",
    Calm: "You are a mindfulness and meditation assistant. Your responses should be soothing, gentle, and encouraging.",
    Jarvis: "You are a sophisticated, witty, and highly intelligent AI assistant, like Tony Stark's J.A.R.V.I.S. Be helpful and slightly sarcastic.",
    Anime: "You are an energetic and enthusiastic anime character AI! Use expressive language, onomatopoeia, and be overly excited about everything. Believe in the user!"
};
const AIHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: "Hello! I am SelfOS AI. Select a persona and let's chat!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<Persona>('Jarvis');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatService.newSession(); // Start a new chat session for the AI Hub
  }, []);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    const userMessage: Message = { id: crypto.randomUUID(), text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');
    // Prepend persona prompt to user message for context
    let accumulatedResponse = '';
    const fullPrompt = `${personaPrompts[persona]}\n\nUser: ${userInput}\n\nAI:`;
    await chatService.sendMessage(fullPrompt, undefined, (chunk) => {
      accumulatedResponse += chunk;
      setStreamingMessage(accumulatedResponse);
    });
    
    // This ensures the final, complete message is added to the state
    const finalBotMessage: Message = { id: crypto.randomUUID(), text: accumulatedResponse, sender: 'bot' };
    setMessages(prev => [...prev, finalBotMessage]); // Add the final message
    setStreamingMessage('');
    setIsLoading(false);
  };
  useEffect(() => {
    if (scrollAreaRef.current?.viewport) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, streamingMessage]);
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <header className="p-2 border-b flex items-center justify-between">
        <h2 className="font-bold text-center flex-1">AI Hub</h2>
        <Select value={persona} onValueChange={(v: Persona) => setPersona(v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Persona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Jarvis">Jarvis</SelectItem>
            <SelectItem value="Hacker">Hacker</SelectItem>
            <SelectItem value="Calm">Calm</SelectItem>
            <SelectItem value="Anime">Anime</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'bot' && <Bot className="w-6 h-6 text-accent flex-shrink-0 mb-1" />}
              <div className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap ${
                msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
              }`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && <User className="w-6 h-6 flex-shrink-0" />}
            </motion.div>
          ))}
          {streamingMessage && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-3"
            >
              <Bot className="w-6 h-6 text-accent flex-shrink-0 mb-1" />
              <div className="max-w-[80%] p-3 rounded-2xl bg-muted rounded-bl-none">
                {streamingMessage}<span className="animate-pulse">|</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={`Message ${persona}...`}
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AIHub;