import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 8;

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const scaleRef = useRef({ dot: 1, ring: 1 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.cursor = 'none';

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = '';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  useEffect(() => {
    const trailPositions = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }));

    const updateCursorStyle = (isHovering: boolean) => {
      if (isHovering) {
        scaleRef.current.dot = 0.6;
        scaleRef.current.ring = 1.5;
        if (dotRef.current) {
          dotRef.current.style.background = '#E60000';
          dotRef.current.style.boxShadow = '0 0 15px rgba(230, 0, 0, 0.8)';
        }
        if (ringRef.current) {
          ringRef.current.style.border = '1.5px solid #E60000';
          ringRef.current.style.backgroundColor = 'rgba(230, 0, 0, 0.15)';
          ringRef.current.style.boxShadow = '0 0 20px rgba(230, 0, 0, 0.6)';
        }
      } else {
        scaleRef.current.dot = 1;
        scaleRef.current.ring = 1;
        if (dotRef.current) {
          dotRef.current.style.background = 'white';
          dotRef.current.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5), 0 0 3px rgba(0,0,0,0.2)';
        }
        if (ringRef.current) {
          ringRef.current.style.border = '1.5px solid rgba(255, 255, 255, 0.5)';
          ringRef.current.style.backgroundColor = 'transparent';
          ringRef.current.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        }
      }
    };

    const checkInteractive = (target: HTMLElement | null) => {
      if (!target) return false;
      return !!target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      updateCursorStyle(checkInteractive(e.target as HTMLElement));
    };

    const handleMouseDown = () => {
      scaleRef.current.dot = 0.5;
      scaleRef.current.ring = 0.6;
    };

    const handleMouseUp = () => {
      scaleRef.current.dot = scaleRef.current.dot === 0.5 ? 1 : scaleRef.current.dot;
      scaleRef.current.ring = scaleRef.current.ring === 0.6 ? 1 : scaleRef.current.ring;
    };

    const handleMouseOver = (e: MouseEvent) => {
      updateCursorStyle(checkInteractive(e.target as HTMLElement));
    };

    const handleMouseOut = (e: MouseEvent) => {
      // When leaving an element, default to false, unless relatedTarget is also interactive
      const related = e.relatedTarget as HTMLElement;
      if (!checkInteractive(related)) {
        updateCursorStyle(false);
      }
    };

    const animate = () => {
      // Lerp for smooth ring following (higher = faster, lower = slower/smoother)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.5;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.5;

      // GPU Accelerated updates using translate3d instead of top/left
      if (dotRef.current) {
        // Dot follows instantly but we can add slight lerp for ultra smoothness
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current.dot})`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current.ring})`;
      }

      for (let i = 0; i < TRAIL_COUNT; i++) {
        // Faster and smoother trail interpolation
        const speed = 0.5 - (i * 0.03);
        const prevPos = i === 0 ? mousePos.current : trailPositions[i - 1];
        
        trailPositions[i].x += (prevPos.x - trailPositions[i].x) * speed;
        trailPositions[i].y += (prevPos.y - trailPositions[i].y) * speed;

        const trail = trailsRef.current[i];
        if (trail) {
          trail.style.transform = `translate3d(${trailPositions[i].x}px, ${trailPositions[i].y}px, 0) translate(-50%, -50%)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* Red glowing trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${5 - i * 0.5}px`,
            height: `${5 - i * 0.5}px`,
            borderRadius: '50%',
            background: `rgba(230, 0, 0, ${0.7 - i * 0.08})`,
            boxShadow: `0 0 ${8 - i}px rgba(230, 0, 0, ${0.5 - i * 0.05})`,
            pointerEvents: 'none',
            zIndex: 99998,
            willChange: 'transform'
          }}
        />
      ))}

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform'
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 3px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform'
        }}
      />
    </>
  );
};
