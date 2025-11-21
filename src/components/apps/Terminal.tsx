import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCopyToClipboard } from 'react-use';
import { Check, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
const TypingText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const characters = Array.from(text);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.01 } },
      }}
      onAnimationComplete={onComplete}
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
const Terminal: React.FC = () => {
  const [lines, setLines] = useState<{ type: 'input' | 'output', content: string }[]>([
    { type: 'output', content: 'Welcome to SelfOS Terminal. Type "help" for commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  const handleCopy = (text: string, index: number) => {
    copyToClipboard(text);
    setCopiedLine(index);
    setTimeout(() => setCopiedLine(null), 1500);
  };
  const handleCommand = (cmd: string) => {
    let output = '';
    switch (cmd.toLowerCase()) {
      case 'help':
        output = 'Available commands: help, clear, date, whoami, ls, pwd';
        break;
      case 'clear':
        setLines([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'root';
        break;
      case 'ls':
        output = 'Projects  Photos  Documents  system_config.json';
        break;
      case 'pwd':
        output = '/Users/SelfOS/Desktop';
        break;
      default:
        output = `command not found: ${cmd}`;
    }
    setLines(prevLines => [
      ...prevLines, { type: 'input' as const, content: `> ${cmd}` }
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setLines(prev => [...prev, { type: 'output', content: output }]);
      setIsTyping(false);
    }, 50 + Math.random() * 200);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    handleCommand(input);
    setInput('');
  };
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [lines]);
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);
  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono p-2" onClick={() => inputRef.current?.focus()}>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-2">
          {lines.map((line, index) => (
            <div key={index} className="group relative">
              {line.type === 'output' && index === lines.length - 1 && isTyping ? (
                <TypingText text={line.content} onComplete={() => {}} />
              ) : (
                <div>{line.content}</div>
              )}
              <button
                onClick={() => handleCopy(line.content, index)}
                className="absolute right-0 top-0 p-1 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedLine === index ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-green-400">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400"
          autoFocus
          disabled={isTyping}
        />
      </form>
    </div>
  );
};
export default Terminal;