// 🔄 LOADING SPINNER - REUSABLE UI COMPONENT

import { Loader } from 'lucide-react';

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
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader className={`${sizeClasses[size]} animate-spin text-blue-400`} />
      {text && (
        <span className="text-gray-300 text-sm">{text}</span>
      )}
    </div>
  );
} 