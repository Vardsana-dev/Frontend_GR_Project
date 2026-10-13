// @ts-nocheck
import React from 'react';

const SubTitle = ({ 
  children, 
  level = 2, 
  className = '', 
  size = 'default',
  weight = 'normal',
  color = 'muted',
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
    default: 'text-sm'
  };

  // Weight variants
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  // Color variants - เน้นสีเทาอ่อน
  const colorClasses = {
    muted: 'text-gray-500 dark:text-gray-400',
    light: 'text-gray-400 dark:text-gray-500',
    lighter: 'text-gray-300 dark:text-gray-600',
    default: 'text-gray-500 dark:text-gray-400',
    primary: 'text-blue-500 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-300'
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

export default SubTitle;
