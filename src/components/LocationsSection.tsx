import { useAppDispatch, useAppSelector } from '../store';
import { selectLocation } from '../store/connectionSlice';
import { LOCATIONS, type LocationKey } from '../types';

export interface LocationsSectionProps {
  onOpenDemo: () => void;
}

const locationKeys: LocationKey[] = ['lisbon', 'kyoto', 'vancouver'];

export function LocationsSection({ onOpenDemo }: LocationsSectionProps): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedLocation = useAppSelector((state) => state.connection.selectedLocation);
  const locationInfo = LOCATIONS[selectedLocation];

  const handleSelectLocation = (key: LocationKey) => {
    dispatch(selectLocation({ location: key, announce: true }));
  };

  return (
    <section id="locations" className="locations-section section-space shell" aria-labelledby="locations-title">
      <div className="locations-visual reveal">
        <div id="location-map" className="location-map" data-selected-location={selectedLocation}>
          <img
            src="./media/locations-atlas.webp"
            width={1536}
            height={1024}
            alt="An illustrated archipelago with three fictional destination markers."
            loading="lazy"
            decoding="async"
          />
          <span className="map-route" aria-hidden="true" />
          <span className="map-marker marker-lisbon" aria-hidden="true" />
          <span className="map-marker marker-kyoto" aria-hidden="true" />
          <span className="map-marker marker-vancouver" aria-hidden="true" />
          <div className="map-label">
            <span className="connection-dot" />
            <strong data-selected-city="">{locationInfo.city}</strong>
            <span data-selected-country="">{locationInfo.country}</span>
          </div>
          <span className="map-caption">A wider world</span>
        </div>

        <div className="location-options" role="group" aria-label="Preview a destination">
          {locationKeys.map((key) => {
            const info = LOCATIONS[key];
            const isSelected = selectedLocation === key;
            return (
              <button
                key={key}
                type="button"
                data-location={key}
                aria-pressed={isSelected}
                onClick={() => handleSelectLocation(key)}
              >
                <span className="location-dot" />
                <span>
                  {info.city}
                  <small>{info.country}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section-copy locations-copy reveal" data-reveal-delay="1">
        <p className="eyebrow">02 / A wider world</p>
        <h2 id="locations-title">
          Your usual internet.
          <br />
          <span>A different view.</span>
        </h2>
        <p className="section-intro">
          A familiar feeling.
          <br /> A new point of departure.
        </p>
        <p className="body-copy">
          Some days, a change of scenery is all you need. Find your next connection, from a morning in Lisbon to an
          evening in Kyoto.
        </p>
        <p className="destination-note" data-selected-location-note="">
          {locationInfo.note}
        </p>
        <button
          type="button"
          className="inline-link"
          data-open-dialog="demo-dialog"
          onClick={onOpenDemo}
        >
          Explore this destination <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
