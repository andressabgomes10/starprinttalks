/**
 * Design System Components for Star Print Talks
 * Componentes reutilizáveis seguindo as diretrizes de design da Caja
 */

import React from 'react';
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import { motion } from 'framer-motion';
import { cn } from "./utils";

export { CajaLogo, CajaLogoWithText } from "./caja-logo";

// Types
interface CajaStatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<any>;
  variant?: 'default' | 'yellow' | 'green' | 'brown';
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface CajaCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'feature' | 'warning' | 'success';
  hoverable?: boolean;
  animated?: boolean;
  className?: string;
}

interface CajaButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'yellow' | 'green' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface CajaHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

interface CajaListItemProps {
  title: string;
  description?: string;
  timestamp?: string;
  avatar?: React.ReactNode;
  icon?: React.ComponentType<any>;
  badges?: Array<{ text: string; variant?: string }>;
  children?: React.ReactNode;
  hoverable?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

interface CajaSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface CajaEntityListProps {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    avatar?: React.ReactNode;
    badges?: Array<{ text: string; variant?: string }>;
    metadata?: Array<{ label: string; value: string }>;
    timestamp?: string;
    actions?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
  }>;
  viewMode: 'grid' | 'list';
  emptyState?: React.ReactNode;
}

// Stats Card Component
export function CajaStatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
  animated = false,
  className,
  style
}: CajaStatsCardProps) {
  const CardComponent = animated ? motion.div : 'div';
  
  const variantStyles = {
    default: 'bg-white border-gray-200',
    yellow: 'bg-gradient-to-br from-[var(--caja-yellow)]/10 to-[var(--caja-yellow)]/5 border-[var(--caja-yellow)]/20',
    green: 'bg-gradient-to-br from-[var(--caja-green)]/10 to-[var(--caja-green)]/5 border-[var(--caja-green)]/20',
    brown: 'bg-gradient-to-br from-[var(--caja-brown)]/10 to-[var(--caja-brown)]/5 border-[var(--caja-brown)]/20'
  };

  const iconStyles = {
    default: 'text-gray-600',
    yellow: 'text-[var(--caja-yellow)]',
    green: 'text-[var(--caja-green)]',
    brown: 'text-[var(--caja-brown)]'
  };

  const changeStyles = {
    positive: 'text-[var(--caja-green)]',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const animationProps = animated ? {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cn(
        "rounded-lg border p-6 shadow-sm transition-all duration-200",
        variantStyles[variant],
        className
      )}
      style={style}
      {...animationProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-[var(--foreground)]">
              {value}
            </h3>
            {change && (
              <span className={cn("text-xs font-medium", changeStyles[changeType])}>
                {change}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-white/50", iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </CardComponent>
  );
}

// Card Component
export function CajaCard({
  title,
  description,
  children,
  variant = 'default',
  hoverable = false,
  animated = false,
  className
}: CajaCardProps) {
  const CardComponent = animated ? motion.div : 'div';
  
  const variantStyles = {
    default: 'bg-white border-gray-200',
    feature: 'bg-gradient-to-br from-[var(--caja-yellow)]/5 to-white border-[var(--caja-yellow)]/20',
    warning: 'bg-gradient-to-br from-orange-50 to-white border-orange-200',
    success: 'bg-gradient-to-br from-[var(--caja-green)]/5 to-white border-[var(--caja-green)]/20'
  };

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  } : {};

  const hoverProps = hoverable ? {
    whileHover: { scale: 1.02, y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cn(
        "rounded-lg border p-6 shadow-sm transition-all duration-200",
        variantStyles[variant],
        hoverable && "cursor-pointer hover:shadow-md",
        className
      )}
      {...animationProps}
      {...hoverProps}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[var(--muted-foreground)]">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </CardComponent>
  );
}

// Button Component
export function CajaButton({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  disabled
}: CajaButtonProps) {
  const variantStyles = {
    default: 'bg-[var(--caja-yellow)] text-[var(--caja-black)] hover:bg-[var(--caja-yellow)]/90',
    outline: 'border border-gray-300 bg-white text-[var(--foreground)] hover:bg-gray-50',
    ghost: 'bg-transparent text-[var(--foreground)] hover:bg-gray-100',
    yellow: 'bg-[var(--caja-yellow)] text-[var(--caja-black)] hover:bg-[var(--caja-yellow)]/90',
    green: 'bg-[var(--caja-green)] text-white hover:bg-[var(--caja-green)]/90',
    brown: 'bg-[var(--caja-brown)] text-white hover:bg-[var(--caja-brown)]/90'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <Button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--caja-yellow)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

// Header Component
export function CajaHeader({
  title,
  description,
  breadcrumbs,
  actions
}: CajaHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        {breadcrumbs && (
          <nav className="mb-2">
            <ol className="flex items-center space-x-2 text-sm text-[var(--muted-foreground)]">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === breadcrumbs.length - 1 ? "text-[var(--foreground)]" : ""}>
                    {crumb.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
        {description && (
          <p className="text-[var(--muted-foreground)] mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// List Item Component
export function CajaListItem({
  title,
  description,
  timestamp,
  avatar,
  icon: Icon,
  badges,
  children,
  hoverable = true,
  animated = false,
  onClick
}: CajaListItemProps) {
  const ItemComponent = animated ? motion.div : 'div';
  
  const animationProps = animated ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    whileHover: hoverable ? { x: 4, backgroundColor: "rgba(245, 158, 11, 0.05)" } : {},
    transition: { duration: 0.2 }
  } : {};

  return (
    <ItemComponent
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
        hoverable && "cursor-pointer hover:bg-gray-50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      {...animationProps}
    >
      {/* Avatar or Icon */}
      <div className="flex-shrink-0 mt-1">
        {avatar || (Icon && (
          <div className="p-2 rounded-lg bg-[var(--caja-yellow)]/10">
            <Icon className="h-4 w-4 text-[var(--caja-yellow)]" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-[var(--foreground)] truncate">
              {title}
            </p>
            {description && (
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {description}
              </p>
            )}
          </div>
          {timestamp && (
            <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0">
              {timestamp}
            </span>
          )}
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex gap-1 mt-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant as any || "secondary"}>
                {badge.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Children */}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    </ItemComponent>
  );
}

// Search Bar Component
export function CajaSearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  className
}: CajaSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-[var(--caja-yellow)] focus:border-transparent",
          "bg-white placeholder-gray-500"
        )}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

// Entity List Component
export function CajaEntityList({
  items,
  viewMode,
  emptyState
}: CajaEntityListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyState || (
          <div>
            <p className="text-lg font-medium text-[var(--muted-foreground)]">
              Nenhum item encontrado
            </p>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <CajaCard
            key={item.id}
            hoverable
            animated
            className={cn(
              "cursor-pointer transition-all duration-200",
              item.selected && "ring-2 ring-[var(--caja-yellow)] ring-opacity-50"
            )}
          >
            <div onClick={item.onClick}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {item.avatar}
                  <div>
                    <h3 className="font-medium text-[var(--foreground)] truncate">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.actions}
              </div>

              {/* Badges */}
              {item.badges && item.badges.length > 0 && (
                <div className="flex gap-1 mb-3">
                  {item.badges.map((badge, index) => (
                    <Badge key={index} variant={badge.variant as any || "secondary"}>
                      {badge.text}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Metadata */}
              {item.metadata && item.metadata.length > 0 && (
                <div className="space-y-1 mb-3">
                  {item.metadata.map((meta, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">{meta.label}:</span>
                      <span className="text-[var(--foreground)]">{meta.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              {item.timestamp && (
                <p className="text-xs text-[var(--muted-foreground)] mt-auto">
                  {item.timestamp}
                </p>
              )}
            </div>
          </CajaCard>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <CajaListItem
          key={item.id}
          title={item.title}
          description={item.description}
          timestamp={item.timestamp}
          avatar={item.avatar}
          badges={item.badges}
          onClick={item.onClick}
          hoverable
          animated
        >
          {/* Metadata */}
          {item.metadata && item.metadata.length > 0 && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {item.metadata.map((meta, index) => (
                <div key={index}>
                  <span className="text-[var(--muted-foreground)]">{meta.label}:</span>
                  <span className="text-[var(--foreground)] ml-1">{meta.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          {item.actions && (
            <div className="flex justify-end mt-2">
              {item.actions}
            </div>
          )}
        </CajaListItem>
      ))}
    </div>
  );
}