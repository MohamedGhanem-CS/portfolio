import React from 'react';
import { cn } from '../utils';

interface ContactButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

export const ContactButton = React.forwardRef<HTMLElement, ContactButtonProps>(
  ({ className, href, ...props }, ref) => {
    const commonClasses = cn(
      "inline-block rounded-full text-white font-black uppercase tracking-widest text-center cursor-pointer transition-all duration-300",
      "bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40",
      "shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)]",
      "hover:scale-105 hover:bg-red-500/60 hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:brightness-110",
      "active:scale-95 active:shadow-[0_5px_20px_rgba(255,0,0,0.8),_inset_0_1px_5px_rgba(255,255,255,0.5),_inset_0_6px_12px_rgba(150,0,0,0.9)]",
      "[text-shadow:0px_0px_8px_rgba(255,255,255,0.9)]",
      "px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base",
      className
    );

    if (href) {
      return (
        <a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={commonClasses}
        >
          Contact Me
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={commonClasses}
        {...props}
      >
        Contact Me
      </button>
    );
  }
);
ContactButton.displayName = "ContactButton";
