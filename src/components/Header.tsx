import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleMotion } from '../store/motionSlice';

export interface HeaderProps {
  onOpenDemo: () => void;
}

export function Header({ onOpenDemo }: HeaderProps): JSX.Element {
  const dispatch = useAppDispatch();
  const motionPaused = useAppSelector((state) => state.motion.motionPaused);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);
  const primaryNavRef = useRef<HTMLElement | null>(null);

  // Sentinel scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const rect = sentinel.getBoundingClientRect();
    setIsScrolled(rect.bottom < 0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsScrolled(!entry.isIntersecting);
        }
      },
      { threshold: [0] }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Responsive mobile navigation and inert handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobileQuery = window.matchMedia('(max-width: 800px)');

    const updateNavInert = (isOpen: boolean) => {
      const nav = primaryNavRef.current;
      if (!nav) return;
      const isMobile = mobileQuery.matches;
      const shouldBeInert = isMobile && !isOpen;
      if (shouldBeInert) {
        nav.setAttribute('inert', '');
        (nav as HTMLElement & { inert?: boolean }).inert = true;
      } else {
        nav.removeAttribute('inert');
        (nav as HTMLElement & { inert?: boolean }).inert = false;
      }
    };

    updateNavInert(menuOpen);

    const onMediaChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        // Switched to desktop (> 800px)
        setMenuOpen(false);
        updateNavInert(false);
      } else {
        // Switched to mobile (<= 800px)
        updateNavInert(menuOpen);
      }
    };

    mobileQuery.addEventListener('change', onMediaChange);
    return () => {
      mobileQuery.removeEventListener('change', onMediaChange);
    };
  }, [menuOpen]);

  // Outside click and escape key handlers for menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const header = headerRef.current;
      const target = event.target as Node | null;
      if (header && target && !header.contains(target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleNavClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest('a');
    if (anchor && typeof window !== 'undefined' && window.matchMedia('(max-width: 800px)').matches) {
      setMenuOpen(false);
    }
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <button
        type="button"
        className="skip-link motion-shortcut"
        data-motion-toggle=""
        aria-pressed={motionPaused}
        aria-label={motionPaused ? 'Enable page animations' : 'Pause page animations'}
        onClick={() => dispatch(toggleMotion())}
      >
        <span data-motion-label>{motionPaused ? 'Motion off' : 'Motion on'}</span>
      </button>

      <div id="header-sentinel" ref={sentinelRef} aria-hidden="true" />

      <header
        id="site-header"
        ref={headerRef}
        className="site-header"
        data-scrolled={isScrolled ? 'true' : 'false'}
        data-menu-open={menuOpen ? 'true' : 'false'}
      >
        <a className="brand" href="#top" aria-label="Wayline home">
          <img src="./media/brand-kite.webp" width={48} height={48} alt="" />
          <span>wayline</span>
        </a>

        <nav
          id="primary-nav"
          ref={primaryNavRef}
          className="primary-nav"
          aria-label="Main navigation"
          onClick={handleNavClick}
        >
          <a href="#why-wayline">Features</a>
          <a href="#locations">VPN locations</a>
          <a href="#the-app">Apps &amp; devices</a>
          <a href="#field-notes">Privacy guides</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="button button-small button-cream"
            data-open-dialog="demo-dialog"
            onClick={onOpenDemo}
          >
            Try Wayline <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            id="menu-toggle"
            ref={menuToggleRef}
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-controls="primary-nav"
            aria-expanded={menuOpen}
            onClick={handleToggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
