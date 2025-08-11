"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
}