import { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gentle' | 'emergency';
  size?: 'large' | 'extra-large';
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'large',
  fullWidth = false,
  icon,
  disabled = false
}: ButtonProps) {
  const baseStyles = "rounded-[1.5rem] font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#7FA5B8] text-white hover:bg-[#6B8FA3]",
    secondary: "bg-[#A7BFA7] text-[#2D2520] hover:bg-[#92AA92]",
    gentle: "bg-[#E8DFD4] text-[#2D2520] hover:bg-[#D9CFC0]",
    emergency: "bg-[#B85757] text-white hover:bg-[#A34848]"
  };
  
  const sizes = {
    large: "px-8 py-5 text-xl min-h-[4rem]",
    'extra-large': "px-10 py-7 text-2xl min-h-[5.5rem]"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass}`}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
