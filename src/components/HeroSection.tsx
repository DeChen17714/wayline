import { useAppSelector } from '../store';
import { LOCATIONS } from '../types';
import { ManagedVideo } from './ManagedVideo';

export interface HeroSectionProps {
  onOpenDemo: () => void;
}

export function HeroSection({ onOpenDemo }: HeroSectionProps): JSX.Element {
  const selectedLocation = useAppSelector((state) => state.connection.selectedLocation);
  const locationInfo = LOCATIONS[selectedLocation];

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="scene-media hero-media" aria-hidden="true">
        <picture className="scene-poster">
          <source media="(max-width: 800px)" srcSet="./media/hero-mobile.webp" />
          <img
            src="./media/hero-poster.webp"
            width={1280}
            height={720}
            alt=""
          />
        </picture>
        <ManagedVideo
          id="hero-video"
          className="scene-video"
          src="./media/hero.mp4"
          mobileSrc="./media/hero-small.mp4"
          poster="./media/hero-poster.webp"
          ambient
          tabIndex={-1}
        />
      </div>

      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-copy">
        <p className="eyebrow light">A little more freedom</p>
        <h1 id="hero-title">
          Go anywhere.
          <br />
          Stay private.
        </h1>
        <p className="hero-description">
          A calmer, simpler VPN for
          <br className="desktop-break" /> wherever life takes you.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="button button-cream"
            data-open-dialog="demo-dialog"
            onClick={onOpenDemo}
          >
            Find your Wayline <span aria-hidden="true">↗</span>
          </button>
          <a className="text-action light-action" href="#the-app">
            <span className="play-glyph" aria-hidden="true">
              ▷
            </span>{' '}
            See how it works
          </a>
        </div>
      </div>

      <button
        type="button"
        className="hero-connection"
        data-open-dialog="demo-dialog"
        onClick={onOpenDemo}
        aria-label={`Explore the ${locationInfo.city} connection preview`}
      >
        <span className="connection-dot" />
        <span>
          <small>A little peace of mind</small>
          <strong>
            {locationInfo.city}, {locationInfo.country}
          </strong>
          <span className="connection-caption">Explore the connection preview</span>
        </span>
        <span className="mini-power" aria-hidden="true">
          ⏻
        </span>
      </button>

      <div className="hero-bottom">
        <span className="hero-note">
          <span aria-hidden="true">↓</span> A wider world awaits
        </span>
      </div>
      <div className="shoreline shoreline-bottom" aria-hidden="true" />
    </section>
  );
}
