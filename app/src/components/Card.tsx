interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'soft' | 'highlight';
}

export function Card({ children, onClick, className = "", variant = 'default' }: CardProps) {
  const baseStyles = "rounded-[1.5rem] p-6 shadow-sm transition-all duration-200";
  
  const variants = {
    default: "bg-white",
    soft: "bg-[#FAF7F2]",
    highlight: "bg-[#E8DFD4]"
  };
  
  const interactiveStyles = onClick 
    ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]" 
    : "";
  
  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
    >
      {children}
    </div>
  );
}
