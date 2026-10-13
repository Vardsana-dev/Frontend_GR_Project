// @ts-nocheck
import React from 'react';

const Title = ({ 
  children, 
  level = 1, 
  className = '', 
  size = 'default',
  weight = 'semibold',
  color = 'default',
  align = 'left',
  ...props 
}) => {
  // Size variants
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    default: 'text-lg'
  };

  // Weight variants
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  // Color variants
  const colorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    muted: 'text-gray-500 dark:text-gray-500'
  };

  // Alignment variants
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // Combine all classes
  const combinedClasses = [
    'mb-2',
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    className
  ].filter(Boolean).join(' ');

  // Render appropriate heading tag based on level
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;

  return (
    <HeadingTag 
      className={combinedClasses}
      {...props}
    >
      {children}
    </HeadingTag>
  );
};

export default Title;
