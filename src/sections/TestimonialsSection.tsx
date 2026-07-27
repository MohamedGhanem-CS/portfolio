import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { useSiteContent } from '../hooks/useSiteContent';

const testimonials = [
  {
    name: 'Ahmed Samir',
    role: 'Startup Founder',
    text: 'Mohamed built an AI recommendation engine for our platform that increased user engagement by 40%. His deep understanding of ML algorithms and clean code delivery exceeded all expectations.',
    avatar: 'AS',
  },
  {
    name: 'Sarah Johnson',
    role: 'Product Manager, TechCorp',
    text: 'Working with Mohamed was a game-changer. He developed a computer vision pipeline that automated our quality control process, saving us thousands of hours annually.',
    avatar: 'SJ',
  },
  {
    name: 'Omar Khalil',
    role: 'Data Science Lead',
    text: 'Mohamed\'s ability to translate complex business requirements into elegant ML solutions is remarkable. His NLP chatbot project was delivered ahead of schedule with outstanding performance.',
    avatar: 'OK',
  },
];

export const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const { content } = useSiteContent('testimonials');

  const nextTestimonial = () => {
    setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="relative bg-[#0a0a0a] py-20 sm:py-28 md:py-36 px-5 sm:px-8 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      {/* Thin Red Divider Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#E60000]/50 to-transparent"></div>

      <FadeIn y={40} className="w-full flex justify-center mb-14 sm:mb-20">
        <h2 className="text-white font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none text-center">
          {content?.title || 'Testimonials'}
        </h2>
      </FadeIn>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 sm:p-12 md:p-16 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          >
            {/* Quote mark */}
            <span className="absolute top-6 left-8 text-[#E60000]/20 text-[80px] sm:text-[120px] leading-none font-serif pointer-events-none select-none" style={{ fontFamily: 'Georgia, serif' }}>
              "
            </span>

            <p className="text-[#D7E2EA] text-base sm:text-lg md:text-xl leading-relaxed mb-10 relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
              {testimonials[active].text}
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E60000]/20 border border-[#E60000]/30 flex items-center justify-center text-white font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                {testimonials[active].avatar}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {testimonials[active].name}
                </h4>
                <p className="text-[#A0AAB2] text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {testimonials[active].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Back Button */}
          <button 
            onClick={prevTestimonial}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-[#E60000] hover:border-[#E60000]/50 hover:bg-[#E60000]/10 transition-all duration-300 group"
            aria-label="Previous Testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  idx === active
                    ? 'bg-[#E60000] scale-125 shadow-[0_0_10px_rgba(230,0,0,0.5)]'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={nextTestimonial}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-[#E60000] hover:border-[#E60000]/50 hover:bg-[#E60000]/10 transition-all duration-300 group"
            aria-label="Next Testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};
