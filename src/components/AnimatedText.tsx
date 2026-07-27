import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../utils';

export const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25']
  });

  const words = useMemo(() => text.split(' '), [text]);
  const totalWords = words.length;

  return (
    <p ref={containerRef} className={cn("w-full break-words whitespace-pre-wrap", className)}>
      {words.map((word, wordIdx) => {
        const start = wordIdx / totalWords;
        const end = start + (1 / totalWords);
        return (
          <span key={wordIdx}>
            <AnimatedWord word={word} start={start} end={end} scrollYProgress={scrollYProgress} />
            {wordIdx < words.length - 1 && <span> </span>}
          </span>
        );
      })}
    </p>
  );
};

const AnimatedWord = ({ word, start, end, scrollYProgress }: { word: string, start: number, end: number, scrollYProgress: any }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity, willChange: 'opacity' }}>
      {word}
    </motion.span>
  );
};
