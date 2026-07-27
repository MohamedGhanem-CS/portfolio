import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { useSiteContent } from '../hooks/useSiteContent';

import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  num: string;
  label: string;
  name: string;
  live_link: string;
  github_link: string;
  media_url: string;
  is_video: boolean;
  description: string;
  tags: string[];
  order_num: number;
}

interface CardProps {
  project: Project;
  i: number;
  progress: import('framer-motion').MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

// Security: Validate URLs to prevent XSS (javascript:) and open redirects
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const ProjectLink = ({ project, className, childrenClassName }: { project: Project, className?: string, childrenClassName?: string }) => {
  const safeLiveLink = project.live_link && isSafeUrl(project.live_link) ? project.live_link : '';
  const safeGithubLink = project.github_link && isSafeUrl(project.github_link) ? project.github_link : '';

  if (!safeLiveLink && !safeGithubLink) {
    return <div className={className}><LiveProjectButton className={childrenClassName}>No Link</LiveProjectButton></div>;
  }
  
  const buttonWidthClass = "w-[150px] sm:w-[180px]";
  
  return (
    <div className={`flex gap-3 flex-wrap justify-center ${className || ''}`}>
      {safeLiveLink && (
        <a 
          href={safeLiveLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => e.stopPropagation()}
        >
          <LiveProjectButton className={`${buttonWidthClass} ${childrenClassName || ''}`}>Live Project</LiveProjectButton>
        </a>
      )}
      {safeGithubLink && (
        <a 
          href={safeGithubLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => e.stopPropagation()}
        >
          <LiveProjectButton className={`${buttonWidthClass} ${childrenClassName || ''}`}>GitHub</LiveProjectButton>
        </a>
      )}
    </div>
  );
};

const Card = ({ project, i, progress, range, targetScale }: CardProps) => {
  const [showDescription, setShowDescription] = useState(false);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div className="h-[95vh] md:h-[115vh] flex items-start pt-4 md:items-center md:pt-0 justify-center sticky top-[5vh] md:top-0">
      <motion.div 
        style={{ 
          scale, 
          y: `calc(5vh + ${i * 28}px)`,
          transformOrigin: 'top center'
        }}
        className="relative w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[1250px] h-[92vh] md:h-[105vh] mx-auto rounded-[40px] sm:rounded-[50px] md:rounded-[60px] ring-2 ring-[#D7E2EA] ring-inset bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden transform-gpu"
      >
        <AnimatePresence mode="wait">
          {!showDescription ? (
            <motion.div 
              key="front"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full h-full"
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-5 shrink-0">
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                  <span className="text-[#D7E2EA] font-black leading-none text-[clamp(2.5rem,8vw,100px)]">
                    {project.num}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#D7E2EA] font-light uppercase tracking-wider text-sm md:text-base opacity-60">
                      {project.label}
                    </span>
                    <h3 className="text-[#D7E2EA] font-medium uppercase text-xl sm:text-2xl md:text-4xl">
                      {project.name}
                    </h3>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProjectLink project={project} />
                </div>
              </div>

              {/* Middle Row - Main Image */}
              <div className="w-full flex-1 min-h-0 rounded-3xl sm:rounded-[40px] md:rounded-[50px] overflow-hidden shrink-0 border border-white/10 mt-1 relative bg-[#111111]/50">
                {project.media_url ? (
                  <img src={project.media_url?.includes('supabase.co/storage') ? `${project.media_url}?width=1200&quality=85` : project.media_url} alt={`${project.name} showcase`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30">No Image Available</div>
                )}
              </div>
              
              {/* Bottom Row - Description Toggle */}
              <div className="mt-3 sm:mt-4 shrink-0 relative flex items-center justify-center pointer-events-auto z-50">
                <button 
                  onClick={() => setShowDescription(true)}
                  className="px-6 py-2.5 sm:px-8 sm:py-3 inline-block rounded-full text-white font-black uppercase tracking-widest text-center cursor-pointer transition-all duration-300 bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:scale-105 hover:bg-red-500/60 hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:brightness-110 active:scale-95 active:shadow-[0_5px_20px_rgba(255,0,0,0.8),_inset_0_1px_5px_rgba(255,255,255,0.5),_inset_0_6px_12px_rgba(150,0,0,0.9)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] text-xs md:text-sm"
                >
                  View Description
                </button>
              </div>
              
              <div className="mt-4 sm:hidden w-full flex justify-center relative z-[100] pointer-events-auto shrink-0">
                {project.live_link || project.github_link ? (
                  <ProjectLink 
                    project={project} 
                    className="w-full flex justify-center cursor-pointer block"
                  />
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="back"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-full h-full px-2 sm:px-4 md:px-8 justify-center"
            >
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                <p className="text-[#D7E2EA] text-[11px] sm:text-xs md:text-sm leading-snug whitespace-pre-wrap text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {project.description || 'No description provided for this project.'}
                </p>
              </div>
              
              <div className="mt-4 shrink-0 flex justify-center pb-2">
                <button 
                  onClick={() => setShowDescription(false)}
                  className="px-6 py-2.5 sm:px-8 sm:py-3 inline-block rounded-full text-white font-black uppercase tracking-widest text-center cursor-pointer transition-all duration-300 bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:scale-105 hover:bg-red-500/60 hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:brightness-110 active:scale-95 active:shadow-[0_5px_20px_rgba(255,0,0,0.8),_inset_0_1px_5px_rgba(255,255,255,0.5),_inset_0_6px_12px_rgba(150,0,0,0.9)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] text-xs md:text-sm"
                >
                  Back to Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export const ProjectsSection = () => {
  const container = useRef(null);
  const { content } = useSiteContent('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_num', { ascending: true });
        
        if (error) {
          console.error("Failed to fetch projects:", error);
          setErrorMsg("Failed to load projects. Please try again later.");
          return;
        }
        if (data) setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setErrorMsg("Error fetching projects. Please check your connection.");
      }
    };
    fetchProjects();
  }, []);

  return (
    <section 
      id="projects"
      ref={container}
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative pt-20 sm:pt-24 md:pt-32 pb-[10vh]"
    >
      <FadeIn y={40} className="w-full flex justify-center mb-10 md:mb-16 px-5">
        <h2 className="hero-heading font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none text-center">
          {content?.title || 'Project'}
        </h2>
      </FadeIn>

      <div className="relative">
        {errorMsg ? (
          <div className="text-center text-red-500 py-20 text-lg md:text-xl font-bold tracking-widest bg-red-500/10 rounded-3xl border border-red-500/20 mx-4 sm:mx-8">
             {errorMsg}
          </div>
        ) : projects.length === 0 ? (
           <div className="text-center text-white/50 py-20 text-xl font-bold uppercase tracking-widest">
             Loading projects...
           </div>
        ) : (
          projects.map((project, i) => {
            const targetScale = 1 - ((projects.length - 1 - i) * 0.03);
            return (
              <Card 
                key={project.id} 
                i={i} 
                project={project} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale} 
              />
            );
          })
        )}
      </div>
    </section>
  );
};
