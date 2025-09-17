import { cn } from './utils';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CajaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  animated?: boolean;
  className?: string;
}

interface CajaLogoWithTextProps extends CajaLogoProps {
  logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const variantMap = {
  default: 'text-[var(--caja-yellow)]',
  white: 'text-white',
  dark: 'text-[var(--caja-black)]',
};

export function CajaLogo({ 
  size = 'md', 
  variant = 'default', 
  animated = false, 
  className 
}: CajaLogoProps) {
  const LogoComponent = animated ? motion.div : 'div';
  const IconComponent = animated ? motion(Zap) : Zap;

  const animationProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <LogoComponent 
      className={cn("flex items-center justify-center", className)}
      {...animationProps}
    >
      <IconComponent
        className={cn(
          sizeMap[size],
          variantMap[variant],
          animated && "drop-shadow-sm"
        )}
        {...(animated && {
          animate: { rotate: [0, 10, -10, 0] },
          transition: { 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut"
          }
        })}
      />
    </LogoComponent>
  );
}

export function CajaLogoWithText({ 
  logoSize = 'md', 
  textSize = 'md', 
  variant = 'default', 
  animated = false, 
  className 
}: CajaLogoWithTextProps) {
  const ContainerComponent = animated ? motion.div : 'div';
  const TextComponent = animated ? motion.span : 'span';

  const containerAnimationProps = animated ? {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
    whileHover: { scale: 1.02 }
  } : {};

  const textAnimationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.3, duration: 0.4 }
  } : {};

  return (
    <ContainerComponent 
      className={cn("flex items-center gap-2", className)}
      {...containerAnimationProps}
    >
      <CajaLogo 
        size={logoSize} 
        variant={variant} 
        animated={animated}
      />
      <TextComponent
        className={cn(
          textSizeMap[textSize],
          "font-bold tracking-tight select-none",
          variant === 'white' ? 'text-white' : 
          variant === 'dark' ? 'text-[var(--caja-black)]' : 
          'text-[var(--foreground)]'
        )}
        {...textAnimationProps}
      >
        Star Print Talks
      </TextComponent>
    </ContainerComponent>
  );
}