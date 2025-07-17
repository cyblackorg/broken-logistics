import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variantClasses = {
      default: 'card',
      elevated: 'card-elevated',
      interactive: 'card-interactive',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          padding !== 'none' && paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('card-header', className)} {...props}>
        {children}
      </div>
    );
  }
);

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('card-body', className)} {...props}>
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('card-footer', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;
export { CardHeader, CardBody, CardFooter }; 