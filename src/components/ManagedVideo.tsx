import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type SyntheticEvent,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleMotion } from '../store/motionSlice';

export interface ManagedVideoHandle {
  retry: () => void;
}

export interface ManagedVideoProps {
  id: string;
  className?: string;
  src: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
  muted?: boolean;
  playsInline?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  tabIndex?: number;
  ariaDescribedBy?: string;
  ariaHidden?: boolean;
  ambient?: boolean;
  onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onErrorChange?: (hasError: boolean) => void;
}

export const ManagedVideo = forwardRef<ManagedVideoHandle, ManagedVideoProps>(function ManagedVideo(
  {
    id,
    className = '',
    src,
    mobileSrc,
    poster,
    mobilePoster,
    muted = true,
    playsInline = true,
    loop = true,
    preload = 'none',
    tabIndex = -1,
    ariaDescribedBy,
    ariaHidden,
    ambient = false,
    onTimeUpdate,
    onErrorChange,
  },
  ref
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dispatch = useAppDispatch();
  const motionPaused = useAppSelector((state) => state.motion.motionPaused);
  const [isVisible, setIsVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 600px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15);
    }, { threshold: [0, 0.15] });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const activeSrc = isMobile && mobileSrc ? mobileSrc : src;
  const activePoster = isMobile && mobilePoster ? mobilePoster : poster;
  const allowed = !motionPaused && !isBlocked && isVisible && tabVisible;

  // Own decoder lifetime separately from playback. Run before the playback effect
  // so a breakpoint change never clears the source that was just started.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setIsReady(false);
    setIsBlocked(false);
    onErrorChange?.(false);
    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [activeSrc, motionPaused, onErrorChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowed) return;
    let cancelled = false;
    if (video.getAttribute('src') !== activeSrc) {
      video.muted = true;
      video.preload = 'metadata';
      video.src = activeSrc;
      video.load();
    }
    void video.play().then(() => {
      if (!cancelled && document.hidden) video.pause();
    }).catch((error: unknown) => {
      if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return;
      setIsBlocked(true);
      setIsReady(false);
      onErrorChange?.(true);
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [activeSrc, allowed, retryVersion, onErrorChange]);

  const handleRetry = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
    setIsReady(false);
    setIsBlocked(false);
    onErrorChange?.(false);
    if (motionPaused) dispatch(toggleMotion());
    setRetryVersion((version) => version + 1);
  }, [dispatch, motionPaused, onErrorChange]);

  useImperativeHandle(ref, () => ({
    retry: handleRetry,
  }), [handleRetry]);

  const handlePlaying = () => {
    if (!allowed || document.hidden) {
      videoRef.current?.pause();
      return;
    }
    setIsReady(true);
    setIsBlocked(false);
    onErrorChange?.(false);
  };

  const handleError = () => {
    setIsBlocked(true);
    setIsReady(false);
    onErrorChange?.(true);
  };

  const combinedClassName = [
    className,
    isReady ? 'is-ready' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <video
      ref={videoRef}
      id={id}
      className={combinedClassName}
      poster={activePoster}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
      preload={preload}
      tabIndex={tabIndex}
      aria-describedby={ariaDescribedBy}
      aria-hidden={ariaHidden}
      data-managed-video=""
      data-ambient={ambient ? '' : undefined}
      onPlaying={handlePlaying}
      onError={handleError}
      onTimeUpdate={onTimeUpdate}
    />
  );
});
