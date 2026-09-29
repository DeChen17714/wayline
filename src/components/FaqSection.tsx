export interface FaqSectionProps {
  onOpenDemo: (trigger: HTMLElement) => void;
}

export function FaqSection({ onOpenDemo }: FaqSectionProps): JSX.Element {
  return (
    <section className="faq-section shell" aria-labelledby="faq-title">
      <div className="reveal">
        <p className="eyebrow">A few good questions</p>
        <h2 id="faq-title">
          Let's clear
          <br />
          <span>the air.</span>
        </h2>
      </div>
      <div className="faq-list reveal">
        <details>
          <summary>
            Where does a VPN fit into my day?
            <span className="expand-mark" aria-hidden="true" />
          </summary>
          <p>
            At your desk, on a hotel network, or between flights: a VPN adds an encrypted path between your device and
            its server. Choose your location, make the connection, and carry on.
          </p>
        </details>
        <details>
          <summary>
            Does a VPN make me anonymous?
            <span className="expand-mark" aria-hidden="true" />
          </summary>
          <p>
            No. Accounts, cookies and browser fingerprints can still identify you. A VPN is one part of a thoughtful
            privacy routine, alongside software updates, strong passwords and multi-factor authentication.
          </p>
        </details>
        <details>
          <summary>
            One experience across my devices?
            <span className="expand-mark" aria-hidden="true" />
          </summary>
          <p>
            A familiar connection, on the screens you use every day. Explore the desktop and mobile experience above, or
            take the connection for a test flight.
          </p>
          <button
            type="button"
            className="inline-link"
            data-open-dialog="demo-dialog"
            onClick={(e) => onOpenDemo(e.currentTarget)}
          >
            Explore Wayline <span aria-hidden="true">↗</span>
          </button>
        </details>
      </div>
    </section>
  );
}
