import { useState, useRef, type KeyboardEvent } from 'react';
import { ManagedVideo } from './ManagedVideo';
import { CONTEXTS, type ContextKey } from '../types';

export interface EverydaySectionProps {
  onOpenDemo: () => void;
}

const contextKeys: ContextKey[] = ['home', 'travel', 'wifi'];

const tabLabels: Record<ContextKey, string> = {
  home: 'At home',
  travel: 'On the move',
  wifi: 'On public Wi-Fi',
};

export function EverydaySection({ onOpenDemo }: EverydaySectionProps): JSX.Element {
  const [selectedContext, setSelectedContext] = useState<ContextKey>('home');
  const tabsRef = useRef<Record<ContextKey, HTMLButtonElement | null>>({
    home: null,
    travel: null,
    wifi: null,
  });

  const contextData = CONTEXTS[selectedContext];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = contextKeys.indexOf(selectedContext);
    if (currentIndex === -1) return;

    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % contextKeys.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + contextKeys.length) % contextKeys.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = contextKeys.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextKey = contextKeys[nextIndex];
    setSelectedContext(nextKey);
    tabsRef.current[nextKey]?.focus();
  };

  return (
    <section
      id="everyday"
      className="everyday-section"
      data-context={selectedContext}
      aria-labelledby="everyday-title"
    >
      <div className="scene-media" aria-hidden="true">
        <picture className="scene-poster">
          <source media="(max-width: 600px)" srcSet="./media/everyday-mobile.webp" />
          <img
            src="./media/everyday-poster.webp"
            width={1280}
            height={720}
            alt=""
            loading="lazy"
          />
        </picture>
        <ManagedVideo
          id="everyday-video"
          className="scene-video"
          src="./media/everyday.mp4"
          mobileSrc="./media/everyday-small.mp4"
          poster="./media/everyday-poster.webp"
          ambient
          tabIndex={-1}
        />
      </div>

      <div className="everyday-shade" aria-hidden="true" />
      <div className="shoreline shoreline-top" aria-hidden="true" />

      <div className="everyday-inner shell">
        <div className="everyday-copy reveal">
          <p className="eyebrow light">Life happens everywhere</p>
          <h2 id="everyday-title">
            One quiet connection.
            <br />
            Everywhere you go.
          </h2>
          <p>
            From your morning coffee
            <br />
            to your next departure.
          </p>
          <button
            type="button"
            className="button button-cream"
            data-open-dialog="demo-dialog"
            onClick={onOpenDemo}
          >
            Find your Wayline <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div
          id="context-panel"
          className="context-card reveal"
          role="tabpanel"
          aria-labelledby={`context-${selectedContext}`}
          tabIndex={0}
        >
          <span className="context-kite" aria-hidden="true">
            <img src="./media/brand-kite.webp" width={60} height={60} alt="" loading="lazy" />
          </span>
          <span className="eyebrow">Room to be you</span>
          <h3 data-context-title="">{contextData.title}</h3>
          <p data-context-copy="">{contextData.copy}</p>
          <div className="context-card-footer">
            <span className="small-dot" />
            <span data-context-location="">{contextData.location}</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>

        <div
          id="context-tabs"
          className="context-tabs"
          role="tablist"
          aria-label="Everyday moments"
          onKeyDown={handleKeyDown}
        >
          {contextKeys.map((key) => {
            const isSelected = selectedContext === key;
            return (
              <button
                key={key}
                id={`context-${key}`}
                ref={(el) => {
                  tabsRef.current[key] = el;
                }}
                type="button"
                role="tab"
                data-context={key}
                aria-controls="context-panel"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedContext(key)}
              >
                {tabLabels[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="shoreline shoreline-bottom" aria-hidden="true" />
    </section>
  );
}
