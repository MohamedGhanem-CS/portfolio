import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const RobotIcon = () => {
  const [phase, setPhase] = useState<'meteor' | 'dizzy' | 'idle'>('meteor');

  useEffect(() => {
    // 0 -> 0.5s: Meteor Drop
    const t1 = setTimeout(() => setPhase('dizzy'), 500);
    // 0.5s -> 2.0s: Dizzy (Recover after 1.5 seconds)
    const t2 = setTimeout(() => {
      setPhase('idle');
    }, 2000); 
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isMeteor = phase === 'meteor';
  const isDizzy = phase === 'dizzy';

  return (
    <div className="relative w-full h-full flex items-center justify-center pt-2">
      <motion.svg
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        animate={(!isMeteor && !isDizzy) ? { y: [0, -6, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* METEOR FIRE AURA (Only visible during meteor phase) */}
        <motion.g
          animate={{ opacity: isMeteor ? 1 : 0, scale: isMeteor ? [1, 1.2, 1] : 0 }}
          transition={isMeteor ? { duration: 0.2, repeat: Infinity } : { duration: 0 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <path d="M 30 100 Q 50 150 70 100 Q 80 50 50 0 Q 20 50 30 100 Z" fill="#FF4500" opacity="0.6" filter="blur(8px)" />
          <path d="M 40 90 Q 50 130 60 90 Q 70 50 50 20 Q 30 50 40 90 Z" fill="#FFD700" opacity="0.8" filter="blur(4px)" />
        </motion.g>

        {/* MASSIVE SHOCKWAVE ON IMPACT */}
        <motion.circle
          cx="50" cy="100" r="10" fill="none" stroke="#E60000" strokeWidth="8"
          initial={false}
          animate={{ 
            scale: isDizzy ? 6 : 0, 
            opacity: isDizzy ? [0, 1, 0] : 0,
            strokeWidth: isDizzy ? [8, 2, 0] : 8
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "50px 100px" }}
        />
        <motion.circle
          cx="50" cy="100" r="15" fill="none" stroke="#FF4500" strokeWidth="4"
          initial={false}
          animate={{ 
            scale: isDizzy ? 4 : 0, 
            opacity: isDizzy ? [0, 0.8, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          style={{ transformOrigin: "50px 100px" }}
        />

        {/* ROBOT BODY (Meteor Drop + Impact Squash) */}
        <motion.g 
          initial={{ y: -500, scaleX: 0.5, scaleY: 1.5 }}
          animate={{
            y: isMeteor ? -500 : 0,
            scaleX: isMeteor ? 0.6 : isDizzy ? [1.5, 1, 1] : 1,
            scaleY: isMeteor ? 1.5 : isDizzy ? [0.4, 1, 1] : 1
          }}
          transition={{ 
            y: { type: "spring", stiffness: 300, damping: 20 },
            scaleX: { duration: 0.4, ease: "easeOut" },
            scaleY: { duration: 0.4, ease: "easeOut" }
          }}
          style={{ transformOrigin: "50px 100px" }}
        >
          
          {/* Dizzy Stars (Appear only when dizzy, scaled Y to look horizontal 3D) */}
          <motion.g
            animate={{ opacity: isDizzy ? 1 : 0, scale: isDizzy ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            style={{ transformOrigin: "50px 5px" }}
          >
            <g style={{ transform: "scaleY(0.35)", transformOrigin: "50px 5px" }}>
              <motion.g
                animate={{ rotateZ: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "50px 5px" }}
              >
                <path d="M 50 -10 L 50.9 -7.9 L 53 -7.9 L 51.3 -6.4 L 51.8 -4 L 50 -5.5 L 48.2 -4 L 48.7 -6.4 L 47 -7.9 L 49.1 -7.9 Z" fill="#FFD700" />
                <path d="M 39.6 8 L 40.5 10.1 L 42.6 10.1 L 40.9 11.6 L 41.4 14 L 39.6 12.5 L 37.8 14 L 38.3 11.6 L 36.6 10.1 L 38.7 10.1 Z" fill="#FFD700" />
                <path d="M 60.4 8 L 61.3 10.1 L 63.4 10.1 L 61.7 11.6 L 62.2 14 L 60.4 12.5 L 58.6 14 L 59.1 11.6 L 57.4 10.1 L 59.5 10.1 Z" fill="#FFD700" />
              </motion.g>
            </g>
          </motion.g>
          
          {/* Animated Head Group */}
          <motion.g
            animate={isDizzy ? { rotateZ: [-15, 15, -15, 15, -15] } : { rotateZ: [-2, 3, -2] }}
            transition={isDizzy ? { duration: 0.25, repeat: Infinity } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 45px" }}
          >
            <rect x="49" y="5" width="2" height="10" fill="#333333" />
            <circle cx="50" cy="5" r="3" fill="#E60000" />
            
            <rect x="30" y="15" width="40" height="30" rx="10" fill="#1A1A1A" stroke="#333333" strokeWidth="2" />
            
            <path d="M 30 25 L 24 25 A 3 3 0 0 0 24 35 L 30 35" fill="#E60000" />
            <path d="M 70 25 L 76 25 A 3 3 0 0 1 76 35 L 70 35" fill="#E60000" />
            
            <motion.rect 
              y="22" width="32" height="16" rx="5" fill="#0A0A0A" stroke="#E60000" strokeWidth="1" opacity="0.9"
              animate={isDizzy ? { x: [34, 30, 38, 30, 34] } : { x: [34, 28, 34, 40, 34] }}
              transition={isDizzy ? { duration: 0.5, repeat: Infinity } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Glowing Eyes */}
            <motion.g
              animate={isDizzy ? { x: [0, -4, 4, -4, 0] } : { x: [0, -6, 0, 6, 0] }}
              transition={isDizzy ? { duration: 0.5, repeat: Infinity } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect x="40" y="27" width="6" height="4" rx="2" fill="#E60000" />
              <rect x="54" y="27" width="6" height="4" rx="2" fill="#E60000" />
            </motion.g>
          </motion.g>

          {/* Neck */}
          <rect x="45" y="45" width="10" height="6" fill="#333333" />
          
          {/* Waving Left Arm */}
          <motion.path 
            fill="none" stroke="#333333" strokeWidth="5" strokeLinecap="round"
            animate={{ d: ["M 32 58 Q 15 55 20 75", "M 32 58 Q 10 40 15 25", "M 32 58 Q 15 35 25 25", "M 32 58 Q 10 40 15 25", "M 32 58 Q 15 55 20 75"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle 
            r="4" fill="#E60000"
            animate={{ cx: [20.5, 15, 25, 15, 20.5], cy: [76, 25, 25, 25, 76] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Right Arm */}
          <motion.path 
            fill="none" stroke="#333333" strokeWidth="5" strokeLinecap="round"
            animate={{ d: ["M 68 58 Q 85 55 80 75", "M 68 58 Q 87 57 82 72", "M 68 58 Q 85 55 80 75"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle 
            r="4" fill="#E60000"
            animate={{ cx: [79.5, 81.5, 79.5], cy: [76, 73, 76] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Body */}
          <rect x="32" y="51" width="36" height="35" rx="8" fill="#1A1A1A" stroke="#333333" strokeWidth="2" />
          
          {/* Body Details (Core/Heart) */}
          <circle cx="50" cy="68" r="6" fill="#E60000" />
          
          {/* Swaying Legs */}
          <motion.g
            animate={{ rotateZ: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 86px" }}
          >
            {/* Left Leg */}
            <rect x="38" y="86" width="5" height="15" fill="#333333" />
            <path d="M 35 101 L 46 101 Q 48 105 46 105 L 35 105 Q 33 105 35 101" fill="#1A1A1A" stroke="#E60000" strokeWidth="1" />
            
            {/* Right Leg */}
            <rect x="57" y="86" width="5" height="15" fill="#333333" />
            <path d="M 54 101 L 65 101 Q 67 105 65 105 L 54 105 Q 52 105 54 101" fill="#1A1A1A" stroke="#E60000" strokeWidth="1" />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
};
