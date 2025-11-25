import React from 'react';

interface WideContentCardProps {
  imageUrl?: string;
  imageAlt?: string;
  dateLabel?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  isActive?: boolean;
  emojiFallback?: string;
  onCardClick?: () => void;
  primaryActionLabel?: string;
  onPrimaryActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  metaTopLeft?: React.ReactNode;
  metaTopRight?: React.ReactNode;
   overlayTag?: React.ReactNode;
}

/**
 * Reusable wide content card used for:
 * - "Just In" show cards on the dashboard
 * - Topic cards inside the show detail view
 */
export const WideContentCard: React.FC<WideContentCardProps> = ({
  imageUrl,
  imageAlt,
  dateLabel,
  title,
  eyebrow,
  description,
  isActive = false,
  emojiFallback,
  onCardClick,
  primaryActionLabel,
  onPrimaryActionClick,
  metaTopLeft,
  metaTopRight,
  overlayTag,
}) => {
  return (
    <div
      onClick={onCardClick}
      className={`
        bg-[#111] border rounded-2xl p-4 flex gap-4 transition-all cursor-pointer group
        ${isActive ? 'border-cyan-400/70 bg-white/10 shadow-[0_0_30px_rgba(34,211,238,0.35)]' : 'border-white/5 hover:border-white/10'}
      `}
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 relative bg-white/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/20 to-emerald-500/20">
            {emojiFallback && (
              <span className="text-xl sm:text-2xl drop-shadow-md">{emojiFallback}</span>
            )}
          </div>
        )}
        {dateLabel && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold">
            {dateLabel}
          </div>
        )}
        {overlayTag && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/75 border border-white/20 text-[9px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_10px_rgba(0,0,0,0.6)]">
              {overlayTag}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        {(metaTopLeft || metaTopRight) && (
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[10px] text-gray-400 flex items-center gap-1 min-w-0">
              {metaTopLeft}
            </div>
            {metaTopRight && (
              <div className="ml-2 shrink-0">
                {metaTopRight}
              </div>
            )}
          </div>
        )}
        <h4 className="text-base sm:text-lg font-bold text-white leading-snug mb-1 line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h4>
        {eyebrow && (
          <p className="text-sm text-cyan-500 font-medium mb-1 truncate">{eyebrow}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 sm:line-clamp-3">{description}</p>
        )}
        {primaryActionLabel && onPrimaryActionClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrimaryActionClick(e);
            }}
            className="mt-3 flex items-center gap-2 text-xs font-bold text-white bg-white/10 w-fit px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            {primaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};


