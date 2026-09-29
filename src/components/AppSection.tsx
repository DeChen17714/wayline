import { useState, useRef, type SyntheticEvent } from 'react';
import { ManagedVideo, type ManagedVideoHandle } from './ManagedVideo';

const steps = [
  { number: '01', text: 'Pick your place.' },
  { number: '02', text: 'Make the connection.' },
  { number: '03', text: 'Get on with your day.' },
];

export function AppSection(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const videoHandleRef = useRef<ManagedVideoHandle | null>(null);

  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const time = video.currentTime;
    // Coordinated timing from MediaUpscale: 0-2.5s (step 0), 2.5-6.5s (step 1), 6.5-10s (step 2)
    const phase = time < 2.5 ? 0 : time < 6.5 ? 1 : 2;
    setActiveStep(phase);
  };

  const handleRetryClick = () => {
    setHasError(false);
    videoHandleRef.current?.retry();
  };

  return (
    <section id="the-app" className="app-section section-space" aria-labelledby="app-title">
      <div className="app-section-heading shell reveal">
        <p className="eyebrow">03 / Made for your everyday</p>
        <h2 id="app-title">
          A familiar face.
          <br />
          <span>On every screen.</span>
        </h2>
        <p className="section-intro">
          At your desk. In your pocket. Along for the ride.
          <br /> One Wayline, wherever the day takes you.
        </p>
        <ul className="platform-list" aria-label="Wayline platforms">
          <li>
            <span className="platform-icon platform-window" aria-hidden="true">
              ⊞
            </span>
            Windows
          </li>
          <li>
            <span className="platform-icon" aria-hidden="true">
              ⌘
            </span>
            macOS
          </li>
          <li>
            <span className="platform-icon platform-phone" aria-hidden="true" />
            iOS
          </li>
          <li>
            <span className="platform-icon platform-phone" aria-hidden="true" />
            Android
          </li>
          <li>
            <span className="platform-icon platform-terminal" aria-hidden="true">
              ›_
            </span>
            Linux
          </li>
        </ul>
      </div>

      <figure className="app-showcase shell reveal">
        <div className="showcase-stage">
          <picture className="app-video-poster">
            <source media="(max-width: 600px)" srcSet="./media/app-mobile-end.webp" />
            <img
              src="./media/app-end.webp"
              width={1280}
              height={720}
              alt="Wayline on desktop and phone."
              loading="lazy"
            />
          </picture>
          <ManagedVideo
            ref={videoHandleRef}
            id="app-video"
            src="./media/app-demo.mp4"
            mobileSrc="./media/app-mobile.mp4"
            poster="./media/app-poster.webp"
            mobilePoster="./media/app-mobile-poster.webp"
            ariaDescribedBy="app-video-description"
            onTimeUpdate={handleTimeUpdate}
            onErrorChange={setHasError}
          />
        </div>
        <figcaption id="app-video-description" className="showcase-description">
          A click on desktop. A tap on mobile. And you're on your way.
        </figcaption>
        <p className="media-error" data-video-error="app-video" hidden={!hasError}>
          The animation couldn't load.{' '}
          <button type="button" data-video-retry="app-video" onClick={handleRetryClick}>
            Play animation
          </button>
        </p>
      </figure>

      <div className="app-steps shell">
        {steps.map((step, index) => (
          <div key={step.number} className={index === activeStep ? 'is-active' : ''}>
            <span className="step-number">{step.number}</span>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
