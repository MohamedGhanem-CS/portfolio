import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1] as const;

// Particle component - lightweight, transform-only
const Particle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-[#E60000]"
    style={{ width: size, height: size, left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      scale: [0, 1, 1, 0.5],
      y: [0, -80, -160, -200]
    }}
    transition={{ duration: 1.8, delay, ease: "easeOut" }}
  />
);

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 50),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => setIsVisible(false), 2600),
      setTimeout(() => onComplete(), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
          animate={phase >= 4 ? { opacity: 0, scale: 1.3 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* ═══ Rotating geometric rings ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={phase >= 1 ? { opacity: 0.15, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.2, ease }}
            className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border border-white/20 rounded-full"
            style={{ willChange: 'transform' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: 90 }}
            animate={phase >= 1 ? { opacity: 0.1, scale: 1.3, rotate: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.1, ease }}
            className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border border-[#E60000]/15 rounded-full"
            style={{ willChange: 'transform' }}
          />
          {/* Spinning dashed ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 0.2, scale: 1, rotate: 360 } : {}}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.8, ease },
              rotate: { duration: 6, repeat: Infinity, ease: "linear" }
            }}
            className="absolute w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] rounded-full"
            style={{ border: '1px dashed rgba(230,0,0,0.2)', willChange: 'transform' }}
          />

          {/* ═══ Scan lines ═══ */}
          <motion.div
            initial={{ x: '-100vw' }}
            animate={phase >= 1 ? { x: '100vw' } : {}}
            transition={{ duration: 0.8, ease }}
            className="absolute top-[35%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#E60000]/60 to-transparent"
            style={{ willChange: 'transform' }}
          />
          <motion.div
            initial={{ x: '100vw' }}
            animate={phase >= 1 ? { x: '-100vw' } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="absolute top-[65%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#E60000]/40 to-transparent"
            style={{ willChange: 'transform' }}
          />

          {/* ═══ Corner brackets ═══ */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase >= 2 ? { opacity: 0.3, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05, ease }}
              className={`absolute w-8 h-8 sm:w-12 sm:h-12 ${pos} border-white/30`}
            />
          ))}

          {/* ═══ Floating particles ═══ */}
          {phase >= 1 && (
            <>
              <Particle delay={0} x="20%" y="60%" size={3} />
              <Particle delay={0.1} x="75%" y="55%" size={2} />
              <Particle delay={0.2} x="40%" y="70%" size={4} />
              <Particle delay={0.15} x="60%" y="65%" size={2} />
              <Particle delay={0.25} x="30%" y="50%" size={3} />
              <Particle delay={0.3} x="80%" y="45%" size={2} />
              <Particle delay={0.05} x="50%" y="75%" size={3} />
              <Particle delay={0.35} x="15%" y="40%" size={2} />
            </>
          )}

          {/* ═══ Main logo: MG ═══ */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Red flash behind logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={phase >= 1 ? { opacity: [0, 0.25, 0.08], scale: [0, 1.2, 0.8] } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-[#E60000]"
              style={{ willChange: 'transform, opacity' }}
            />
            
            {/* MG text */}
            <div className="overflow-hidden relative">
              <motion.div
                initial={{ y: '130%', rotateX: 40 }}
                animate={phase >= 1 ? { y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.6, ease }}
                style={{ willChange: 'transform' }}
              >
                <span 
                  className="text-white text-6xl sm:text-8xl font-black block relative z-10"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  MG
                </span>
              </motion.div>
            </div>

            {/* Two red lines extending from center */}
            <div className="flex items-center gap-0 mt-2 sm:mt-3">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={phase >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, ease }}
                className="w-10 sm:w-20 h-[2px] bg-[#E60000] origin-right"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={phase >= 2 ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.1, ease }}
                className="w-2 h-2 bg-[#E60000] rotate-45 mx-2"
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={phase >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, ease }}
                className="w-10 sm:w-20 h-[2px] bg-[#E60000] origin-left"
              />
            </div>

            {/* Name */}
            <div className="overflow-hidden mt-3 sm:mt-4">
              <motion.div
                initial={{ y: '130%' }}
                animate={phase >= 2 ? { y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1, ease }}
              >
                <span 
                  className="text-white/80 text-[10px] sm:text-sm tracking-[0.6em] uppercase block text-center"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  MOHAMED GHANEM
                </span>
              </motion.div>
            </div>

            {/* Tagline */}
            <div className="overflow-hidden mt-1.5 sm:mt-2">
              <motion.div
                initial={{ y: '130%' }}
                animate={phase >= 3 ? { y: 0 } : {}}
                transition={{ duration: 0.4, ease }}
              >
                <span 
                  className="text-[#E60000]/70 text-[8px] sm:text-xs tracking-[0.4em] uppercase block text-center"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  AI & ML ENGINEER
                </span>
              </motion.div>
            </div>
          </div>

          {/* ═══ Bottom progress line ═══ */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 w-[120px] sm:w-[200px]">
            <div className="w-full h-[1px] bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-[#E60000]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: 'width' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
