import { motion, useMotionValue, useTransform } from 'framer-motion';

export const IdCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Exaggerate the tilt to feel loose and random
  const rotateX = useTransform(y, [-300, 300], [30, -30]);
  const rotateY = useTransform(x, [-300, 300], [-30, 30]);

  return (
    <motion.div
      className="relative z-50 flex flex-col items-center cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8} // Extremely loose elastic feel
      style={{ x, y, rotateX, rotateY, perspective: 1200 }}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      initial={{ y: -1000 }}
      animate={{ y: 0 }}
      // Bouncy and fluid spring
      transition={{ type: 'spring', stiffness: 80, damping: 8, mass: 1.2, delay: 0.5 }}
    >
      {/* Premium Lanyard String (Extends upwards) */}
      <div className="absolute bottom-[100%] w-3 sm:w-4 h-[150vh] bg-gradient-to-r from-[#111] via-[#2a2a2a] to-[#111] shadow-[inset_0_0_10px_rgba(0,0,0,0.8),_5px_0_15px_rgba(0,0,0,0.5)] z-0 origin-bottom">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, black 1px, black 2px)' }}></div>
      </div>
      
      {/* High-End Metal Clip that connects realistically to the hole */}
      <div className="relative flex flex-col items-center z-20 -mb-3">
        {/* Main clip body */}
        <div className="w-10 h-6 bg-gradient-to-b from-gray-400 via-gray-200 to-gray-500 rounded-md z-10 flex flex-col items-center justify-center shadow-[0_5px_10px_rgba(0,0,0,0.5)] border border-gray-100 relative">
          <div className="w-5 h-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 shadow-inner border border-gray-500 flex items-center justify-center">
              <div className="w-3 h-1 rounded-full bg-gray-600 shadow-inner"></div>
          </div>
        </div>
        {/* Strap going into the hole */}
        <div className="w-8 h-4 bg-gradient-to-b from-gray-500 to-[#050505] rounded-b-sm border-x border-gray-600"></div>
      </div>
      
      {/* Photo-only ID Card Body */}
      <div className="w-[180px] sm:w-[220px] md:w-[280px] h-[250px] sm:h-[300px] md:h-[440px] bg-[#E60000] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_0_0_1px_rgba(255,255,255,0.8)] border-4 border-white/90 relative overflow-hidden group z-10">
        
        {/* Realistic Hole punch */}
        <div className="w-10 h-3 bg-[#050505] rounded-full absolute top-2 left-1/2 -translate-x-1/2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] border border-white/20 z-30"></div> 
        
        {/* Full Image */}
        <img 
          src="/hero-cutout.png" 
          alt="Mohamed Ghanem - ML Engineer ID Card" 
          draggable={false}
          style={{ pointerEvents: 'none' }}
          className="absolute top-8 inset-x-0 bottom-0 w-full h-[calc(100%-2rem)] object-cover object-top filter contrast-[1.05] saturate-[1.1] select-none"
        />

        {/* Realistic Hole punch */}
        <div className="w-14 h-3 bg-[#050505] rounded-full absolute top-3 left-1/2 -translate-x-1/2 shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)] border border-white/20 z-20"></div>
        
        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 -translate-x-[150%] group-hover:translate-x-[150%] transition-all duration-[1.5s] ease-in-out pointer-events-none z-30"></div>

        {/* Text Overlay: ML Engineer */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[85%] bg-black/60 backdrop-blur-md border border-white/20 rounded-full py-2.5 flex items-center justify-center z-20 shadow-lg">
          <span className="text-white text-xs sm:text-sm font-black tracking-[0.2em] uppercase">ML Engineer</span>
        </div>

      </div>
    </motion.div>
  );
};
