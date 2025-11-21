import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }
    const draw = () => {
      ctx.fillStyle = 'rgba(22, 23, 23, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00FFE1';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#161717]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MatrixRain />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-primary mb-8"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px -5px hsla(var(--neon-cyan), 0.4)',
              '0 0 40px -5px hsla(var(--neon-magenta), 0.6)',
              '0 0 20px -5px hsla(var(--neon-cyan), 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shield className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1
          className="text-5xl font-bold text-foreground tracking-[0.5em]"
          style={{ textShadow: '0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent))' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0.8, 1], y: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          SelfOS
        </motion.h1>
        <motion.p
          className="mt-4 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          aria-live="polite"
        >
          Initializing system...
        </motion.p>
      </div>
    </motion.div>
  );
};
export default BootScreen;