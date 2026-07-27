
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';
import { IdCard } from '../components/IdCard';
import { useSiteContent } from '../hooks/useSiteContent';

export const AboutSection = () => {
  const { content } = useSiteContent('about');
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-start items-center px-5 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#0a0a0a]">
      
      {/* Title centered at the top */}
      <FadeIn delay={0} y={40} className="w-full max-w-[1200px] z-10 flex justify-center">
        <h2 
          className="hero-heading font-black uppercase leading-none tracking-tight text-center text-white relative z-20 select-none"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
        >
          {content?.title || 'ABOUT ME'}
        </h2>
      </FadeIn>

      {/* Main Content: Text & Card Side-by-Side */}
      <div className="z-10 mt-12 sm:mt-16 w-full max-w-[1200px] flex flex-col lg:flex-row items-stretch justify-between relative gap-12 lg:gap-8">
        
        {/* Left Side: Text */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-[60%] text-center lg:text-left z-20 relative">
          <div className="w-full text-[clamp(1.22rem,1.85vw,1.68rem)] lg:min-h-[440px] flex flex-col justify-center lg:mt-3">
            <AnimatedText 
              text={content?.description || "Hi, I'm Mohamed Ghanem, a Computer Science student at El Shorouk Academy with a strong passion for Artificial Intelligence and Machine Learning. I specialize in building intelligent systems, developing AI-powered applications, and creating machine learning solutions that solve real-world problems. I'm continuously expanding my knowledge in Deep Learning, Computer Vision, NLP, MLOps, and Generative AI, while working on practical projects that strengthen my technical and problem-solving skills. My goal is to become a professional AI Engineer and contribute to innovative technologies that make a real impact."}
              className="text-[#D7E2EA] font-medium leading-[1.9] text-justify [text-align-last:center] lg:[text-align-last:left] whitespace-normal"
            />
          </div>
        </div>

        {/* Right Side: ID Card */}
        <div className="hidden lg:flex flex-col items-end justify-start w-full lg:w-[40%] pr-[8%] xl:pr-[12%]">
          <div className="relative cursor-grab active:cursor-grabbing">
             <IdCard />
          </div>
        </div>

        {/* Mobile ID Card - Shown normally in flow on smaller screens */}
        <div className="w-full flex lg:hidden justify-center relative mt-12 sm:mt-16 z-50">
          <IdCard />
        </div>

      </div>

      {/* Button centered at the bottom of the section */}
      <div className="z-10 mt-16 sm:mt-24 flex w-full max-w-[1200px] justify-center relative">
        <ContactButton href="#contact" />
      </div>
    </section>
  );
};
