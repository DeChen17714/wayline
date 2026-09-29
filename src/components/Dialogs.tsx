import { useEffect, useRef, type ChangeEvent, type MouseEvent, type SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectLocation, setConnectionState } from '../store/connectionSlice';
import { LOCATIONS, CONNECTION_COPY, isLocationKey, type DialogId, type LocationKey } from '../types';

export interface DialogsProps {
  activeDialog: DialogId | null;
  triggerElement: HTMLElement | null;
  onClose: () => void;
}

const CONNECT_DURATION_MS = 1100;

export function Dialogs({ activeDialog, triggerElement, onClose }: DialogsProps): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedLocation = useAppSelector((state) => state.connection.selectedLocation);
  const connectionState = useAppSelector((state) => state.connection.connectionState);

  const demoDialogRef = useRef<HTMLDialogElement | null>(null);
  const wifiDialogRef = useRef<HTMLDialogElement | null>(null);
  const vpnDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (connectionState !== 'connecting') return;
    if (activeDialog !== 'demo-dialog') {
      dispatch(setConnectionState({ state: 'idle', announcement: 'Connection cancelled. Ready to explore.' }));
      return;
    }
    const location = LOCATIONS[selectedLocation];
    const timer = window.setTimeout(() => {
      dispatch(setConnectionState({
        state: 'connected',
        announcement: `Connected · demo. Preview connected to ${location.city}, ${location.country}. Your network is unchanged.`,
      }));
    }, CONNECT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeDialog, connectionState, selectedLocation, dispatch]);

  useEffect(() => {
    const dialogs = {
      'demo-dialog': demoDialogRef.current,
      'guide-wifi-dialog': wifiDialogRef.current,
      'guide-vpn-dialog': vpnDialogRef.current,
    };
    const dialog = activeDialog ? dialogs[activeDialog] : null;
    if (!dialog) return;
    dialog.showModal();
    document.body.dataset.dialogOpen = 'true';
    return () => {
      dialog.close();
      delete document.body.dataset.dialogOpen;
      if (triggerElement?.isConnected) triggerElement.focus();
    };
  }, [activeDialog, triggerElement]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    const dialog = e.currentTarget;
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!isInside) {
        onClose();
      }
    }
  };

  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (isLocationKey(value)) {
      dispatch(selectLocation({ location: value, announce: true }));
    }
  };

  const handleConnectToggle = () => {
    const loc = LOCATIONS[selectedLocation];
    if (connectionState === 'idle') {
      dispatch(
        setConnectionState({
          state: 'connecting',
          announcement: `Finding your Wayline… Simulating a private connection to ${loc.city}, ${loc.country}.`,
        })
      );
    } else if (connectionState === 'connecting') {
      dispatch(setConnectionState({ state: 'idle', announcement: 'Connection cancelled. Ready to explore.' }));
    } else if (connectionState === 'connected') {
      dispatch(
        setConnectionState({
          state: 'idle',
          announcement: 'Disconnected. Ready to explore.',
        })
      );
    }
  };

  const copy = CONNECTION_COPY[connectionState];

  return (
    <>
      <dialog
        id="demo-dialog"
        ref={demoDialogRef}
        className="demo-dialog"
        aria-labelledby="demo-title"
        onClick={handleBackdropClick}
        onCancel={handleCancel}
      >
        <button
          type="button"
          className="dialog-close"
          data-close-dialog=""
          aria-label="Close preview"
          onClick={onClose}
        >
          ×
        </button>
        <div className="demo-dialog-layout">
          <div className="demo-intro">
            <span className="small-wordmark">wayline</span>
            <p className="eyebrow">Take a little test flight</p>
            <h2 id="demo-title">
              Your next stop?
              <br />
              <span>Somewhere good.</span>
            </h2>
            <p>
              Pick a place. Try the connection.
              <br />
              Get a feel for a simpler kind of VPN.
            </p>
            <p className="demo-disclaimer">
              A product experience to explore. This showcase doesn't create a VPN connection or install an app.
            </p>
          </div>
          <div
            className="demo-controls"
            data-connection-preview=""
            data-state={connectionState}
            aria-busy={connectionState === 'connecting'}
          >
            <label htmlFor="demo-location">Choose your destination</label>
            <select
              id="demo-location"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="lisbon">Lisbon, Portugal</option>
              <option value="kyoto">Kyoto, Japan</option>
              <option value="vancouver">Vancouver, Canada</option>
            </select>
            <h3 data-connection-status="">{copy.status}</h3>
            <button
              type="button"
              className="power-control"
              data-connect=""
              onClick={handleConnectToggle}
            >
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
              <span className="power-label" data-connection-label="">
                {copy.label}
              </span>
            </button>
            <p className="app-detail" data-connection-detail="">
              {copy.detail}
            </p>
          </div>
        </div>
      </dialog>

      <dialog
        id="guide-wifi-dialog"
        ref={wifiDialogRef}
        className="article-dialog"
        aria-labelledby="wifi-article-title"
        onClick={handleBackdropClick}
        onCancel={handleCancel}
      >
        <button
          type="button"
          className="dialog-close"
          data-close-dialog=""
          aria-label="Close field note"
          onClick={onClose}
        >
          ×
        </button>
        <article>
          <p className="eyebrow">Field note / Out in the world</p>
          <h2 id="wifi-article-title">
            Make public Wi-Fi
            <br />
            less public.
          </h2>
          <img
            className="article-image"
            src="./media/guide-public-wifi.webp"
            width={1536}
            height={1024}
            alt="A seaside café terrace."
            loading="lazy"
          />
          <p className="article-lead">
            Free Wi-Fi is a small travel pleasure. A few simple habits can help keep it that way.
          </p>
          <h3>Check the name before you join.</h3>
          <p>
            Ask the café, hotel or airport for the correct network name. An open network with a familiar-looking name
            isn't necessarily theirs. Turn off automatic connection to open networks and forget networks you no longer
            use.
          </p>
          <h3>Keep the basics switched on.</h3>
          <p>
            Keep your device and browser updated. Use HTTPS websites, enable multi-factor authentication and avoid
            ignoring certificate warnings. If a task is particularly sensitive and you're unsure about a network, use a
            trusted cellular connection instead.
          </p>
          <h3>Know what a VPN adds.</h3>
          <p>
            A VPN encrypts traffic between your device and the VPN server. That can reduce what someone on the local
            network can inspect. It does not make a phishing website safe, remove malware or prevent you from sharing
            information with a site you're logged into.
          </p>
          <h3>A little care goes a long way.</h3>
          <p>
            A trustworthy provider, good device security and thoughtful browsing work together. No single tool does the
            whole job.
          </p>
          <div className="article-end">
            A Wayline field note. General information, not a claim about a live Wayline service.
          </div>
        </article>
      </dialog>

      <dialog
        id="guide-vpn-dialog"
        ref={vpnDialogRef}
        className="article-dialog"
        aria-labelledby="vpn-article-title"
        onClick={handleBackdropClick}
        onCancel={handleCancel}
      >
        <button
          type="button"
          className="dialog-close"
          data-close-dialog=""
          aria-label="Close field note"
          onClick={onClose}
        >
          ×
        </button>
        <article>
          <p className="eyebrow">Field note / The bigger picture</p>
          <h2 id="vpn-article-title">
            What a VPN does.
            <br />
            And doesn't.
          </h2>
          <p className="article-lead">
            Think of a VPN as a different route for your connection. Not an invisibility cloak.
          </p>
          <h3>A private path to a server.</h3>
          <p>
            A VPN sends your traffic through an encrypted connection to a server run by the provider. Websites will
            usually see that server's public IP address rather than your ordinary one. Your internet provider can still
            see that you're connected to a VPN.
          </p>
          <h3>You still leave other clues.</h3>
          <p>
            If you sign in to an account, that service knows it's you. Cookies and browser fingerprinting can also
            recognize your device. A VPN does not automatically block trackers, stop scams or prevent malware.
          </p>
          <h3>Trust moves; it doesn't disappear.</h3>
          <p>
            The VPN provider becomes part of your connection. Before choosing a real service, read its privacy policy,
            look for meaningful independent security work and understand who operates it. Marketing promises alone
            aren't evidence.
          </p>
          <h3>Choose the tool for the moment.</h3>
          <p>
            A VPN can be a useful part of your privacy routine. Pair it with software updates, strong unique passwords
            and multi-factor authentication. Keep your expectations practical and your habits consistent.
          </p>
          <div className="article-end">
            Wayline is a fictional design concept. No provider, audit or network performance is being represented here.
          </div>
        </article>
      </dialog>
    </>
  );
}
