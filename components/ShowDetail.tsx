
import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Play, Share2, Heart, ListMusic, BarChart3, ExternalLink, Info, Maximize2, X, FileText, Newspaper, MessageSquare, Users, Link2, Clock } from 'lucide-react';
import { Show, Speaker } from '../types';
import { MatrixBackground } from './MatrixBackground';
import { SpeakerBlobs } from './SpeakerBlobs';

interface ShowDetailProps {
  show: Show;
  activeSegmentId: string | null;
  onBack: () => void;
  onPlay: (segmentIndex: number) => void;
  onSeek?: (time: number) => void;
  speakers?: Speaker[];
  currentTime?: number; // Passed from App.tsx
}

export const ShowDetail: React.FC<ShowDetailProps> = ({ show, activeSegmentId, onBack, onPlay, onSeek, speakers = [], currentTime = 0 }) => {
  
  // Navigation & Player Logic
  const activeIndex = activeSegmentId 
    ? show.segments.findIndex(s => s.id === activeSegmentId) 
    : 0;
  
  const [displayedSegmentIndex, setDisplayedSegmentIndex] = useState(activeIndex !== -1 ? activeIndex : 0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Release time information (for header)
  const createdAtDate = show.createdAt ? new Date(show.createdAt) : null;
  const hasValidCreatedAt = createdAtDate !== null && !isNaN(createdAtDate.getTime());

  const releaseTimeLabel =
    hasValidCreatedAt
      ? createdAtDate!.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

  let relativeReleaseLabel = '';
  if (hasValidCreatedAt) {
    const diffMs = Date.now() - createdAtDate!.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      relativeReleaseLabel = 'gerade eben veröffentlicht';
    } else if (diffMinutes < 60) {
      relativeReleaseLabel =
        diffMinutes === 1 ? 'vor 1 Minute veröffentlicht' : `vor ${diffMinutes} Minuten veröffentlicht`;
    } else if (diffHours < 24) {
      relativeReleaseLabel =
        diffHours === 1 ? 'vor 1 Stunde veröffentlicht' : `vor ${diffHours} Stunden veröffentlicht`;
    } else if (diffDays === 1) {
      relativeReleaseLabel = 'vor 1 Tag veröffentlicht';
    } else {
      relativeReleaseLabel = `vor ${diffDays} Tagen veröffentlicht`;
    }
  }

  // AI-Cover-Metadaten (Provider/Modell) aus show.metadata
  const aiCoverMeta = show.metadata?.media_assets?.image?.cover;
  const aiCoverProvider = aiCoverMeta?.provider;
  const aiCoverModel = aiCoverMeta?.model;
  const hasAICoverMeta = !!(aiCoverProvider || aiCoverModel);

  const aiCoverLabel = hasAICoverMeta
    ? `KI-generiertes Cover${aiCoverProvider ? ` · ${aiCoverProvider}` : ''}${
        aiCoverModel ? ` · Modell ${aiCoverModel}` : ''
      }`
    : null;
  
  // Sync displayed segment with active playing segment ONLY if user hasn't manually selected one recently
  useEffect(() => {
    if (activeSegmentId) {
      const idx = show.segments.findIndex(s => s.id === activeSegmentId);
      if (idx !== -1) {
          setDisplayedSegmentIndex(idx);
      }
    }
  }, [activeSegmentId, show.segments]);

  // --- SEO & OPEN GRAPH METADATA UPDATE ---
  useEffect(() => {
    if (!show) return;

    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = `${show.title} | RadioX`;

    // 2. Helper to set/update Meta Tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
        let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attrName, attrValue);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const descriptionText = show.description || "RadioX Show Details";

    // Standard SEO
    setMetaTag('name', 'description', descriptionText);

    // Open Graph / Facebook / LinkedIn
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:title', show.title);
    setMetaTag('property', 'og:description', descriptionText);
    setMetaTag('property', 'og:image', show.coverUrl);
    setMetaTag('property', 'og:site_name', 'RadioX');

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', show.title);
    setMetaTag('name', 'twitter:description', descriptionText);
    setMetaTag('name', 'twitter:image', show.coverUrl);

    // Cleanup: Revert title when leaving view (optional, but good for SPA)
    return () => {
        document.title = originalTitle;
    };
  }, [show]);


  const safeIndex = displayedSegmentIndex >= 0 && displayedSegmentIndex < show.segments.length ? displayedSegmentIndex : 0;
  const displayedSegment = show.segments[safeIndex];
  const isPlayingThisShow = activeSegmentId === displayedSegment?.id;

  const handleTranscriptClick = (relativeTimestamp: number) => {
      if (!isPlayingThisShow) {
          onPlay(safeIndex);
      }
      
      const audioEl = document.querySelector('audio');
      if (audioEl && displayedSegment.startTime !== undefined) {
          const absoluteTime = displayedSegment.startTime + relativeTimestamp;
          audioEl.currentTime = absoluteTime; 
          audioEl.play().catch(() => {});
      }
  };

  const handleOpenLink = (e: React.MouseEvent, url?: string) => {
      e.stopPropagation();
      if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
      }
  };

  // Helper to find avatar
  const getAvatarUrl = (speakerName: string) => {
      const found = speakers.find(s => s.name.toLowerCase() === speakerName.toLowerCase());
      return found?.avatarUrl;
  };

  // Helper to determine Layout & Theme based on Speaker
  // Memoized so it doesn't flicker on re-renders
  const speakerConfig = useMemo(() => {
      if (!displayedSegment?.transcript) return new Map();
      
      const uniqueSpeakers = Array.from(new Set(displayedSegment.transcript.map(l => l.speaker))) as string[];
      const config = new Map<string, { side: 'left' | 'right', theme: 'cyan' | 'pink' }>();

      uniqueSpeakers.forEach((name, index) => {
          const lower = name.toLowerCase();
          
          // GENDER / THEME DETECTION
          // Heuristic: Explicit names or keywords
          const isFemale = lower.includes('alexandra') || lower.includes('jessica') || lower.includes('sarah') || lower.includes('jane');
          const theme = isFemale ? 'pink' : 'cyan';

          // SIDE DETECTION
          // Alexandra (Host) -> Always Right
          // Declan (Host) -> Always Left
          // Others -> Alternate based on appearance order
          let side: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
          
          if (lower.includes('alexandra')) side = 'right';
          else if (lower.includes('declan')) side = 'left';

          config.set(name, { side, theme });
      });

      return config;
  }, [displayedSegment?.id]);


  // Calculate Relative Time inside segment (purely based on timeline)
  const relativeCurrentTime =
    isPlayingThisShow && displayedSegment.startTime !== undefined
      ? Math.max(0, currentTime - displayedSegment.startTime)
      : 0;

  if (!displayedSegment) return null;

  const transcript = displayedSegment.transcript || [];

  // Determine active transcript line based on current playback time
  let activeLineIndex = 0;
  if (transcript.length > 0) {
    if (!isPlayingThisShow) {
      activeLineIndex = 0;
    } else {
      let idx = transcript.findIndex((line, idx) => {
        const nextLine = transcript[idx + 1];
        const endTime = nextLine ? nextLine.timestamp : line.timestamp + 10;
        return relativeCurrentTime >= line.timestamp && relativeCurrentTime < endTime;
      });
      if (idx === -1) {
        // If we're beyond the last known timestamp, pin to the last line
        if (relativeCurrentTime >= transcript[transcript.length - 1].timestamp) {
          idx = transcript.length - 1;
        } else {
          idx = 0;
        }
      }
      activeLineIndex = idx;
    }
  }

  // For teleprompter view we show at most 3 lines: previous, current, next
  const visibleLineIndices =
    transcript.length > 0
      ? Array.from(
          new Set([
            Math.max(activeLineIndex - 1, 0),
            activeLineIndex,
            Math.min(activeLineIndex + 1, transcript.length - 1),
          ]),
        )
      : [];

  const baseCoverAlt = show.longDescription || show.description || show.title;
  const coverAlt = hasAICoverMeta
    ? `${baseCoverAlt} (Coverbild KI-generiert${
        aiCoverProvider ? ` mit ${aiCoverProvider}` : ''
      }${aiCoverModel ? `, Modell ${aiCoverModel}` : ''})`
    : baseCoverAlt;

  return (
    <div className="min-h-[100dvh] w-full bg-black relative overflow-hidden">
      
      {/* --- BACKGROUND VISUALS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
         <SpeakerBlobs isDeclanActive={isPlayingThisShow} isAlexandraActive={false} />
         <MatrixBackground />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none"></div>
      </div>

      {/* --- LIGHTBOX OVERLAY --- */}
      {isLightboxOpen && (
        <div 
            className="fixed inset-0 z-[50] flex items-center justify-center p-4 md:p-12"
        >
            <div 
                className="absolute inset-0 bg-black/95" 
                onClick={() => setIsLightboxOpen(false)}
            ></div>
            <div className="relative w-full max-w-5xl aspect-square md:aspect-video flex items-center justify-center pointer-events-none">
                <img 
                    src={show.coverUrl} 
                    alt={coverAlt} 
                    title={aiCoverLabel || undefined}
                    className="
                        relative z-10 w-auto h-auto max-w-full max-h-[70vh] 
                        rounded-sm shadow-none border border-white/10
                        pointer-events-auto
                    "
                />

                {/* Beschreibung / Metadaten als Overlay im Lightbox-View */}
                {(show.longDescription || show.description || aiCoverLabel) && (
                  <div className="absolute inset-x-0 bottom-0 z-20 px-4 md:px-8 pb-6 pt-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-auto">
                    <h2 className="text-base md:text-lg font-bold text-white mb-2">
                      {show.title}
                    </h2>
                    <div className="max-h-32 md:max-h-40 overflow-y-auto pr-1 text-xs md:text-sm text-gray-300 leading-relaxed">
                      {show.longDescription || show.description}
                    </div>
                    {aiCoverLabel && (
                      <p className="mt-2 text-[10px] text-gray-400">
                        {aiCoverLabel}
                      </p>
                    )}
                  </div>
                )}

                <button 
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute top-4 right-4 z-30 p-3 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all pointer-events-auto"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
      )}

      {/* --- NAV (kompakt, weniger vertikaler Platz) --- */}
      <div className="relative z-20 max-w-[1920px] mx-auto px-4 sm:px-6 pt-3 md:pt-4 pb-1">
         <button 
           onClick={onBack} 
           className="inline-flex items-center gap-2 sm:gap-3 group text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
         >
            <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="hidden sm:inline font-medium tracking-widest uppercase">
              Back to Dashboard
            </span>
            <span className="sm:hidden font-medium tracking-widest uppercase">
              Back
            </span>
         </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 mt-2 lg:mt-4 flex flex-col lg:flex-row gap-6 lg:gap-12 pb-8">
          
          {/* LEFT: COVER / HEADER */}
          <div className="w-full lg:w-[360px] xl:w-[450px] 2xl:w-[520px] flex flex-col lg:h-full pb-4 lg:pb-0 shrink-0 order-2 lg:order-1">
              
              {/* Show Header / Cover für Desktop/Tablet (Beschreibung im alt-Text) */}
              <div className="hidden lg:block mb-6 px-1 w-full">
                  <div className="flex flex-col items-center w-full">
                      {/* LARGE COVER IMAGE - FULL WIDTH, BUT SLIGHTLY SMALLER ON TABLET LANDSCAPE */}
                      <div 
                        className="relative w-full aspect-[4/5] xl:aspect-square max-h-[60vh] mb-2 group cursor-pointer overflow-hidden rounded-3xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
                        onClick={() => setIsLightboxOpen(true)}
                      >
                         <img 
                            src={show.coverUrl} 
                            alt={coverAlt}
                            title={aiCoverLabel || undefined}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                         />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg scale-150" />
                         </div>

                         {/* Desktop-Tooltip mit \"About the show\"-Text */}
                         {(show.longDescription || show.description) && (
                           <div className="pointer-events-none absolute inset-x-4 bottom-4 bg-black/75 rounded-2xl border border-white/10 px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <p className="text-[11px] text-gray-200 leading-relaxed line-clamp-4">
                               {show.longDescription || show.description}
                             </p>
                           </div>
                         )}
                      </div>
                  </div>
              </div>

          </div>

          {/* RIGHT: CHAT / TRANSCRIPT (Source: segments via apiService) */}
          <div className="flex-1 flex flex-col h-full relative min-w-0 pb-32 lg:pb-0 order-1 lg:order-2">

             {/* Show Meta oben über den Speakern (kompakter Block, auch auf Mobile sichtbar) */}
             <div className="mb-4">
               <div className="w-full rounded-2xl bg-black/40 lg:bg-black/30 border border-white/5 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                 <div className="flex flex-col gap-1 min-w-0">
                   <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                     {show.date}
                     {releaseTimeLabel && ` · ${releaseTimeLabel}`}
                   </span>
                   <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight truncate">
                     {show.title}
                   </h1>
                   <span className="text-[11px] sm:text-xs text-cyan-400 font-semibold uppercase tracking-widest">
                     {show.hosts}
                   </span>
                   {relativeReleaseLabel && (
                     <span className="text-[11px] text-gray-500">
                       {relativeReleaseLabel}
                     </span>
                   )}
                 </div>
                 <div className="hidden sm:flex flex-col items-end gap-1">
                   <span className="text-cyan-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                     Live Transcript
                   </span>
                   <span className="text-xs text-gray-400">
                     {displayedSegment.title}
                   </span>
                 </div>
               </div>
             </div>

             {/* Transcript Scroll Area */}
             <div className="flex-1 relative rounded-3xl lg:border lg:border-white/5 bg-transparent lg:bg-[#0A0A0A]/50 lg:backdrop-blur-sm flex flex-col">
                 
                {/* Transcript Header - Desktop Only */}
                <div className="hidden lg:flex p-4 border-b border-white/5 items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 z-10 backdrop-blur-md justify-between">
                    <div className="flex items-center gap-2">
                       <MessageSquare size={16} className="text-cyan-500" />
                       <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Show Script</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                       <Play size={10} /> Läuft automatisch mit der Show
                    </span>
                </div>

                {/* SHOW SCRIPT VIEW (Teleprompter-style) */}
                <div className="flex-1 px-4 lg:px-10 flex items-center justify-center">
                    {transcript.length > 0 ? (
                        <div className="w-full max-w-4xl h-[180px] md:h-[210px] lg:h-[240px] flex items-center justify-center">
                            <div className="w-full flex flex-col items-stretch justify-center gap-2.5 lg:gap-3">
                              {visibleLineIndices.map((lineIndex) => {
                              const line = transcript[lineIndex];
                              const conf = speakerConfig.get(line.speaker) || {
                                side: 'left',
                                theme: 'cyan',
                              };
                              const isRight = conf.side === 'right';
                              const isCenter = lineIndex === activeLineIndex;
                              const isAbove = lineIndex < activeLineIndex;
                              const isPink = conf.theme === 'pink';

                              const opacityClass = isCenter ? 'opacity-100' : 'opacity-35';
                              const scaleClass = isCenter ? 'scale-100' : 'scale-95';
                              const translateClass = isCenter
                                ? 'translate-y-0'
                                : isAbove
                                  ? '-translate-y-1'
                                  : 'translate-y-1';

                              const accentColor = isPink ? 'text-fuchsia-400' : 'text-cyan-400';

                              const avatarUrl = getAvatarUrl(line.speaker);

                              const directionClass = isRight ? 'flex-row-reverse text-right' : 'flex-row text-left';
                              const alignMetaClass = isRight ? 'justify-end' : 'justify-start';

                              // Zeige im Teleprompter nur die aktive Zeile (kein Ghost-Overflow).
                              const visibilityClass = isCenter ? 'flex' : 'hidden';

                              // Leichter Fade-In beim Wechsel der Zeile
                              const animationClass = isCenter ? 'animate-line-fade-in' : '';

                              return (
                                <button
                                  key={lineIndex}
                                  type="button"
                                  onClick={() => handleTranscriptClick(line.timestamp)}
                                  className={`group ${visibilityClass} ${directionClass} items-center gap-3 lg:gap-5 transition-all duration-700 ease-out ${opacityClass} ${scaleClass} ${translateClass} ${animationClass}`}
                                >
                                  {/* Avatar / Speaker Icon (größer, mit genug Platz für Glow) */}
                                  <div className="shrink-0 flex flex-col">
                                    {avatarUrl ? (
                                      <img
                                        src={avatarUrl}
                                        alt={line.speaker}
                                        className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border ${
                                          isCenter
                                            ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.7)]'
                                            : 'border-white/10'
                                        }`}
                                      />
                                    ) : (
                                      <div
                                        className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-sm lg:text-2xl font-bold border ${
                                          isCenter
                                            ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100'
                                            : 'border-white/10 bg-white/5 text-gray-400'
                                        }`}
                                      >
                                        {line.speaker.charAt(0)}
                                      </div>
                                    )}
                                  </div>

                                  {/* Text Column */}
                                  <div className={`flex-1 min-w-0 flex flex-col gap-2 ${alignMetaClass}`}>
                                    <div
                                      className={`flex items-baseline gap-2 ${
                                        isRight ? 'flex-row-reverse' : 'flex-row'
                                      }`}
                                    >
                                      <span
                                        className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest ${accentColor}`}
                                      >
                                        {line.speaker}
                                      </span>
                                      <span className="text-[10px] text-gray-600 font-mono">
                                        {Math.floor(line.timestamp / 60)}:
                                        {(Math.floor(line.timestamp) % 60).toString().padStart(2, '0')}
                                      </span>
                                    </div>
                                    {(() => {
                                      // Wortweises Hervorheben für die aktive Zeile (Karaoke-Style)
                                      const baseClass =
                                        'text-base lg:text-2xl leading-relaxed font-sans transition-colors duration-500';

                                      if (!isCenter) {
                                        return (
                                          <p className={`${baseClass} text-gray-400`}>
                                            {line.text}
                                          </p>
                                        );
                                      }

                                      const nextLine = transcript[lineIndex + 1];
                                      const start = line.timestamp;
                                      const end = nextLine
                                        ? nextLine.timestamp
                                        : line.timestamp + 10;
                                      const span = Math.max(end - start, 0.1);

                                      // Leicht vorgezogener Fortschritt, damit Worte etwas früher highlighten
                                      const rawProgress = Math.min(
                                        Math.max((relativeCurrentTime - start) / span, 0),
                                        1,
                                      );
                                      const localProgress = Math.min(rawProgress + 0.12, 1); // 0.12 ~ 12% Vorsprung

                                      const words = line.text.split(' ');
                                      const activeWordCount = Math.max(
                                        1,
                                        Math.round(localProgress * words.length),
                                      );

                                      return (
                                        <p className={baseClass}>
                                          {words.map((word, wordIndex) => {
                                            const isActiveWord = wordIndex < activeWordCount;
                                            const isLast = wordIndex === words.length - 1;
                                            return (
                                              <span
                                                key={wordIndex}
                                                className={
                                                  isActiveWord
                                                    ? `${accentColor} font-semibold`
                                                    : 'text-gray-400'
                                                }
                                              >
                                                {word}
                                                {!isLast && ' '}
                                              </span>
                                            );
                                          })}
                                        </p>
                                      );
                                    })()}
                                  </div>
                                </button>
                              );
                            })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50 text-center py-20">
                            <FileText size={48} strokeWidth={1} />
                            <p className="text-sm font-bold text-gray-400">Audio Only Segment</p>
                            <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                                This segment contains music, intro/outro, or the transcript has not been processed yet.
                            </p>
                        </div>
                    )}
                </div>
             </div>

          </div>

      </div>

      {/* TOPICS & NEWS – volle Breite unterhalb von Cover & Transcript */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col min-h-0 bg-black/20 border border-white/5 rounded-3xl overflow-hidden shadow-none">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A] z-10 shrink-0">
            <div className="flex items-center gap-2">
              <ListMusic size={16} className="text-cyan-500" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                Topics & News
              </span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
              {show.segments.length}
            </span>
          </div>

          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 sm:gap-3.5 md:gap-4 min-w-full">
            {show.segments.map((segment, idx) => {
              const isSelected = idx === safeIndex;
              const isActivePlaying = activeSegmentId === segment.id;
              const hasLink = segment.sourceUrl && segment.sourceUrl.length > 0;
              // Bild-Priorität:
              // 1) articleImageUrl aus Backend (ideal, serverseitig vorbereitet)
              // 2) Twitter/X-Avatar, falls es ein Tweet-Link ist
              // 3) sonst kein Bild
              let previewImage: string | undefined = segment.articleImageUrl;
              if (!previewImage && segment.sourceUrl) {
                try {
                  const parsed = new URL(segment.sourceUrl);
                  const hostname = parsed.hostname.toLowerCase();
                  const pathParts = parsed.pathname.split('/').filter(Boolean);
                  const username = pathParts[0] || '';

                  if (
                    username &&
                    (hostname.includes('twitter.com') || hostname.includes('x.com'))
                  ) {
                    previewImage = `https://unavatar.io/twitter/${username}`;
                  }
                } catch {
                  // ignore invalid URLs
                }
              }
              const hasThumbnail = !!previewImage;

              const isIntroSegment = idx === 0 && !hasLink;
              const isOutroSegment =
                idx === show.segments.length - 1 && !hasLink && show.segments.length > 1;
              const isMetaSegment = isIntroSegment || isOutroSegment;

              const publishedAt = segment.sourcePublishedAt
                ? new Date(segment.sourcePublishedAt)
                : null;
              const publishedDateTimeLabel =
                publishedAt && !isNaN(publishedAt.getTime())
                  ? `${publishedAt.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })} · ${publishedAt.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : null;

              return (
                <div
                  key={segment.id}
                  onClick={() => {
                    setDisplayedSegmentIndex(idx);
                    if (segment.id !== activeSegmentId) {
                      const audioEl = document.querySelector('audio');
                      if (audioEl && segment.startTime !== undefined) {
                        audioEl.currentTime = segment.startTime;
                      }
                      onPlay(idx);
                    }
                  }}
                  className={`
                    w-full max-w-xs sm:max-w-sm group relative flex flex-col justify-between px-3 py-3.5 rounded-2xl cursor-pointer transition-all border overflow-hidden
                    aspect-[21/9] shrink-0
                    ${isSelected ? 'bg-white/10 border-white/20' : 'bg-[#111]/60 border-white/5 hover:bg-white/5'}
                  `}
                >
                  {/* Header: Source Badge & Time */}
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <div
                      className="flex items-center gap-2 group/badge"
                      onClick={(e) => hasLink && handleOpenLink(e, segment.sourceUrl)}
                    >
                      <div
                        className={`p-1 rounded bg-white/5 ${
                          isActivePlaying ? 'text-cyan-400' : 'text-gray-500'
                        }`}
                      >
                        {isActivePlaying ? (
                          <BarChart3 size={12} className="animate-pulse" />
                        ) : (
                          <Newspaper size={12} />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider truncate max-w-[180px] ${
                          hasLink
                            ? 'text-cyan-200 group-hover/badge:text-cyan-400 group-hover/badge:underline decoration-cyan-500/50'
                            : 'text-gray-400'
                        }`}
                      >
                        {isIntroSegment
                          ? 'Intro'
                          : isOutroSegment
                          ? 'Outro'
                          : segment.sourceName || 'Topic'}
                      </span>
                      {hasLink && (
                        <ExternalLink
                          size={10}
                          className="text-gray-600 group-hover/badge:text-cyan-400"
                        />
                      )}
                      {publishedDateTimeLabel && (
                        <span className="text-[10px] text-gray-500 ml-2">{publishedDateTimeLabel}</span>
                      )}
                    </div>
                    {segment.category && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/30 text-cyan-400 border border-cyan-500/20 uppercase">
                        {segment.category}
                      </span>
                    )}
                  </div>

                  {/* CONTENT BODY: Title + Summary + Thumb */}
                  <div className="flex flex-1 gap-3 md:gap-4 items-stretch">
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        disabled={!hasLink}
                        onClick={(e) => hasLink && handleOpenLink(e as any, segment.sourceUrl)}
                        className={`text-left w-full ${
                          isMetaSegment ? 'text-[11px]' : 'text-[13px] md:text-sm'
                        } font-bold leading-snug mb-1 transition-colors ${
                          hasLink
                            ? isActivePlaying
                              ? 'text-cyan-50 hover:text-cyan-300'
                              : 'text-gray-200 group-hover:text-white hover:text-cyan-200'
                            : isActivePlaying
                            ? 'text-cyan-50'
                            : 'text-gray-200'
                        }`}
                      >
                        {isIntroSegment
                          ? 'Intro'
                          : isOutroSegment
                          ? 'Outro'
                          : segment.articleTitle || segment.title}
                      </button>

                      {segment.articleDescription && segment.articleDescription.length > 0 && (
                        <p
                          className={`text-xs text-gray-500 leading-relaxed ${
                            isMetaSegment ? 'opacity-70' : ''
                          } line-clamp-3`}
                        >
                          {segment.articleDescription}
                        </p>
                      )}
                    </div>

                    {hasThumbnail && (
                      <div className="shrink-0 w-20 md:w-24 rounded-lg overflow-hidden bg-white/5 border border-white/10 mt-1">
                        <img
                          src={previewImage}
                          alt="Article"
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}