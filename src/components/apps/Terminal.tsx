import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
const Terminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>(['Welcome to SelfOS Terminal. Type "help" for commands.']);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const handleCommand = (cmd: string) => {
    const newLines = [...lines, `> ${cmd}`];
    let output = '';
    switch (cmd.toLowerCase()) {
      case 'help':
        output = 'Available commands: help, clear, date, whoami, ls';
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
      default:
        output = `command not found: ${cmd}`;
    }
    setLines([...newLines, output]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [lines]);
  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono p-2">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-2">
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-green-400">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400"
          autoFocus
        />
      </form>
    </div>
  );
};
export default Terminal;