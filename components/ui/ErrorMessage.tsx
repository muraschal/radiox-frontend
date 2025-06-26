// ⚠️ ERROR MESSAGE - REUSABLE UI COMPONENT

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({ 
  message, 
  onDismiss,
  variant = 'error' 
}: ErrorMessageProps) {
  const variantClasses = {
    error: 'bg-red-500/90 border-red-400 text-red-50',
    warning: 'bg-yellow-500/90 border-yellow-400 text-yellow-50', 
    info: 'bg-blue-500/90 border-blue-400 text-blue-50',
  };

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      px-6 py-3 rounded-lg backdrop-blur-sm border
      ${variantClasses[variant]}
    `}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="ml-2 opacity-75 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
} 