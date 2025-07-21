"use client";

import React from 'react';
import { Search, Package, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'data' | 'error';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type = 'data',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  const icons = {
    search: Search,
    data: Package,
    error: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 text-center mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}