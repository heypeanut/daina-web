"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BoothDetail } from '@/lib/api/booth';

interface BoothDescriptionProps {
  booth: BoothDetail;
  className?: string;
}

export function BoothDescription({
  booth,
  className = ''
}: BoothDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!booth.description) {
    return null;
  }

  const content = booth.description || '';
  const shouldTruncate = content.length > 200;
  const displayContent = shouldTruncate && !isExpanded
    ? content.substring(0, 200) + '...'
    : content;

  return (
    <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">档口介绍</h3>
      </div>

      <div className="px-4 py-4">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </div>

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
          >
            <span>{isExpanded ? '收起' : '展开'}</span>
            {isExpanded ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}