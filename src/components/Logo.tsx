import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoImage} alt="CnTrL Out logo" className={sizeClasses[size]} />
      {showText && (
        <span className={`font-semibold tracking-tight text-foreground ${textSizes[size]}`}>
          CnTrL Out
        </span>
      )}
    </div>
  );
};

export default Logo;
