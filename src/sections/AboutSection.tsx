
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
      <div className="z-10 mt-12 sm:mt-16 w-full max-w-[1200px] flex flex-col lg:flex-row items-center lg:items-stretch justify-between relative gap-12 lg:gap-8">
        
        {/* Left Side: Text */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-[60%] text-center lg:text-left z-20 relative pt-3 pb-3">
          <div className="w-full h-full text-[clamp(1.18rem,1.75vw,1.63rem)] flex flex-col justify-between">
            <AnimatedText 
              text={content?.description?.split('.')[0] + '.' || "Hi, I'm Mohamed Ghanem, a Computer Science student aspiring to become a Machine Learning Engineer. I'm building a strong foundation in Python, Mathematics, Data Structures & Algorithms, Data Analysis, and Machine Learning while applying my knowledge through real-world projects."}
              className="text-[#D7E2EA] font-medium leading-[1.8] text-justify [text-align-last:center] lg:[text-align-last:left] whitespace-normal"
            />
            <AnimatedText 
              text={content?.description?.split('.').slice(1).join('.') || "I'm passionate about understanding how machine learning algorithms work, developing scalable AI solutions, and continuously improving my technical and problem-solving skills. My goal is to build intelligent systems that create real-world impact."}
              className="text-[#D7E2EA] font-medium leading-[1.8] text-justify [text-align-last:center] lg:[text-align-last:left] whitespace-normal"
            />
          </div>
        </div>

        {/* Right Side: ID Card */}
        <div className="hidden lg:flex flex-col items-end justify-end w-full lg:w-[40%] pr-[8%] xl:pr-[12%]">
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
