
import { FadeIn } from '../components/FadeIn';
import { useSiteContent } from '../hooks/useSiteContent';

const services = [
  {
    num: "01",
    name: "Tech Roadmaps",
    desc: "Structured learning roadmaps for AI, Machine Learning, Software Engineering, and other tech fields."
  },
  {
    num: "02",
    name: "Building AI from Scratch",
    desc: "Learn how to build Machine Learning and Deep Learning projects from the ground up."
  },
  {
    num: "03",
    name: "LLMs & AI API Integration",
    desc: "Practical guides for integrating Large Language Models and AI APIs into real-world applications."
  },
  {
    num: "04",
    name: "Vibe Coding",
    desc: "Modern AI-assisted development techniques to build applications faster and more efficiently."
  },
  {
    num: "05",
    name: "AI & SE Content",
    desc: "Technical content covering AI, Machine Learning, Software Engineering, and industry best practices."
  }
];

export const ServicesSection = () => {
  const { content } = useSiteContent('services');
  return (
    <section id="services" className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn y={40} className="w-full flex justify-center mb-16 sm:mb-20 md:mb-28">
        <h2 className="text-[#0C0C0C] font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none text-center">
          {content?.title || 'Services'}
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto w-full">
        {services.map((service, i) => (
          <FadeIn 
            key={service.num} 
            delay={i * 0.1}
            className="flex flex-col md:flex-row md:items-start border-t border-[rgba(12,12,12,0.15)] py-8 sm:py-10 md:py-12 gap-6 md:gap-16"
          >
            <div className="text-[#0C0C0C] font-black leading-none text-[clamp(3rem,10vw,140px)] w-full md:w-auto">
              {service.num}
            </div>
            <div className="flex flex-col pt-2 md:pt-4">
              <h3 className="text-[#0C0C0C] font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] mb-2 md:mb-4">
                {service.name}
              </h3>
              <p className="text-[#0C0C0C] font-light leading-relaxed opacity-60 text-[clamp(0.85rem,1.6vw,1.25rem)] max-w-2xl">
                {service.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
