import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger',
      ghost: 'btn-ghost',
    };

    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      (loading || disabled) && 'opacity-50 cursor-not-allowed',
      className
    );

    const iconElement = loading ? (
      <div className="loading-spinner mr-2" />
    ) : icon ? (
      <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>{icon}</span>
    ) : null;

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        {children}
        {iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 