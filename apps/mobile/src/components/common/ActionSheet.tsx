"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ActionSheetAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
  showCancel?: boolean;
  cancelLabel?: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  actions,
  showCancel = true,
  cancelLabel = '取消'
}: ActionSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg animate-in slide-in-from-bottom duration-300">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="py-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              disabled={action.disabled}
              className={`w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 transition-colors ${
                action.danger ? 'text-red-600' : 'text-gray-900'
              } ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {action.icon && (
                <span className="mr-3">{action.icon}</span>
              )}
              {action.label}
            </button>
          ))}
        </div>
        
        {showCancel && (
          <>
            <div className="h-2 bg-gray-100" />
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
          </>
        )}
        
        {/* Safe area for iOS */}
        <div className="pb-safe-area-inset-bottom" />
      </div>
    </div>
  );
}