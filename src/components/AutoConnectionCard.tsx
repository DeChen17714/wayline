import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../store';
import { LOCATIONS } from '../types';

const storyLocations = Object.values(LOCATIONS);

const storyPhases = [
  {
    state: 'connecting',
    status: 'Finding your Wayline…',
    label: 'Connecting',
    detail: 'A new place. The same familiar feeling.',
    duration: 650,
  },
  {
    state: 'connected',
    status: "You're connected",
    label: 'Connected',
    detail: 'A little peace of mind. Wherever you are.',
    duration: 1800,
  },
  {
    state: 'idle',
    status: 'Ready to explore',
    label: 'Connect',
    detail: 'Your next destination is one tap away.',
    duration: 200,
  },
] as const;

export function AutoConnectionCard(): JSX.Element {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const motionPaused = useAppSelector((state) => state.motion.motionPaused);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);

  // Intersection observer for visibility
  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === card) {
            const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
            setIsVisible(visible);
            if (visible) {
              setPhaseIndex(0);
            }
          }
        }
      },
      { threshold: [0, 0.15] }
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Story step timer
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isVisible || motionPaused || !tabVisible) {
      return;
    }

    const currentPhase = storyPhases[phaseIndex];
    const timer = window.setTimeout(() => {
      const nextPhase = (phaseIndex + 1) % storyPhases.length;
      if (nextPhase === 0) {
        setLocationIndex((previous) => (previous + 1) % storyLocations.length);
      }
      setPhaseIndex(nextPhase);
    }, currentPhase.duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVisible, motionPaused, phaseIndex, tabVisible]);

  // Tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
      if (!document.hidden && isVisible && !motionPaused) {
        setPhaseIndex(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible, motionPaused]);

  const currentPhase = storyPhases[motionPaused ? 1 : phaseIndex];
  const currentLocation = storyLocations[locationIndex];

  return (
    <div
      ref={cardRef}
      className="connection-app"
      data-auto-connection=""
      data-state={currentPhase.state}
      aria-label="Automatic connection demonstration"
    >
      <div className="app-topline">
        <span className="small-wordmark">wayline</span>
        <span className="app-window-dots" aria-hidden="true">
          ···
        </span>
      </div>
      <p className="app-eyebrow">Your little corner of the internet</p>
      <h3 data-story-status="">{currentPhase.status}</h3>
      <p className="app-location">
        <span data-story-city="">{currentLocation.city}</span>,{' '}
        <span data-story-country="">{currentLocation.country}</span>
      </p>
      <div className="power-control">
        <span className="power-ring" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 3v9M6.4 5.8a8 8 0 1 0 11.2 0" />
          </svg>
        </span>
        <span className="power-label" data-story-label="">
          {currentPhase.label}
        </span>
      </div>
      <p className="app-detail" data-story-detail="">
        {currentPhase.detail}
      </p>
      <div className="app-foot">
        <span className="small-dot" /> Your private path <span aria-hidden="true">↗</span>
      </div>
    </div>
  );
}
