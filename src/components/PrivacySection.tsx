import { AutoConnectionCard } from './AutoConnectionCard';

export function PrivacySection(): JSX.Element {
  return (
    <section id="why-wayline" className="privacy-section section-space shell" aria-labelledby="privacy-title">
      <div className="section-copy reveal">
        <p className="eyebrow">01 / Everyday privacy</p>
        <h2 id="privacy-title">
          Less exposed.
          <br />
          <span>More at ease.</span>
        </h2>
        <p className="section-intro">
          A private connection, without
          <br className="desktop-break" /> the complicated part.
        </p>
        <div className="feature-accordion">
          <details name="privacy-features" open>
            <summary>
              <span>One small tap.</span>
              <span className="expand-mark" aria-hidden="true" />
            </summary>
            <p>Choose a location. Make the connection. Then get back to the things you opened your laptop for.</p>
          </details>
          <details name="privacy-features">
            <summary>
              <span>A little care on public Wi-Fi.</span>
              <span className="expand-mark" aria-hidden="true" />
            </summary>
            <p>
              A VPN can help protect traffic between your device and its server. A useful extra layer when the network
              isn't your own.
            </p>
          </details>
          <details name="privacy-features">
            <summary>
              <span>Privacy, without the mystery.</span>
              <span className="expand-mark" aria-hidden="true" />
            </summary>
            <p>
              No magic invisibility cloak. Just a simpler way to understand your connection, and where a VPN fits into
              it.
            </p>
          </details>
        </div>
        <a className="inline-link" href="#field-notes">
          Get to know your connection <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="privacy-visual reveal">
        <img
          className="privacy-coast"
          src="./media/privacy-coast.webp"
          width={1536}
          height={1024}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <AutoConnectionCard />
        <span className="visual-note">A little less complicated.</span>
      </div>
    </section>
  );
}
