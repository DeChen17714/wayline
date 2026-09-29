export interface GuidesSectionProps {
  onOpenWifiGuide: (trigger: HTMLElement) => void;
  onOpenVpnGuide: (trigger: HTMLElement) => void;
}

export function GuidesSection({ onOpenWifiGuide, onOpenVpnGuide }: GuidesSectionProps): JSX.Element {
  return (
    <section id="field-notes" className="guides-section section-space shell" aria-labelledby="guides-title">
      <div className="guides-heading reveal">
        <div>
          <p className="eyebrow">A field guide to privacy</p>
          <h2 id="guides-title">
            A little knowledge.
            <br />
            <span>A lot more confidence.</span>
          </h2>
        </div>
        <p className="body-copy">
          No jargon. No scare stories.
          <br />
          Just a few things worth knowing.
        </p>
      </div>

      <div className="guides-grid">
        <article className="guide-card reveal">
          <button
            type="button"
            data-open-dialog="guide-wifi-dialog"
            onClick={(e) => onOpenWifiGuide(e.currentTarget)}
          >
            <span className="guide-image">
              <img
                src="./media/guide-public-wifi.webp"
                width={1536}
                height={1024}
                alt="Coffee and a travel bag on a sunny seaside café terrace."
                loading="lazy"
                decoding="async"
              />
              <span className="guide-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
            <span className="guide-category">Out in the world</span>
            <span className="guide-title">
              Make public Wi-Fi
              <br />
              less public.
            </span>
            <span className="guide-read">
              Read the field note <span aria-hidden="true">↗</span>
            </span>
          </button>
        </article>

        <article className="guide-card guide-card-small reveal" data-reveal-delay="1">
          <button
            type="button"
            data-open-dialog="guide-vpn-dialog"
            onClick={(e) => onOpenVpnGuide(e.currentTarget)}
          >
            <span className="guide-image">
              <img
                src="./media/guide-vpn-basics.webp"
                width={1254}
                height={1254}
                alt="An orange kite drifting between pale clouds."
                loading="lazy"
                decoding="async"
              />
              <span className="guide-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
            <span className="guide-category">The bigger picture</span>
            <span className="guide-title">
              What a VPN does.
              <br />
              And doesn't.
            </span>
            <span className="guide-read">
              Read the field note <span aria-hidden="true">↗</span>
            </span>
          </button>
        </article>
      </div>
    </section>
  );
}
