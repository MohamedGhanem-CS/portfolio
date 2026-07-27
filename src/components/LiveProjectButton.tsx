import React from 'react';
import { cn } from '../utils';

interface LiveProjectButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LiveProjectButton = React.forwardRef<HTMLDivElement, LiveProjectButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest flex items-center justify-center cursor-pointer whitespace-nowrap",
          "px-4 py-3 sm:px-6 sm:py-3.5 text-[11px] sm:text-sm md:text-base",
          "hover:text-[#E60000] hover:border-[#E60000] hover:bg-[#E60000]/10 transition-all duration-300",
          className
        )}
        {...props}
      >
        {children || 'Live Project'}
      </div>
    );
  }
);
LiveProjectButton.displayName = "LiveProjectButton";
