import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { systemReducedMotionChanged } from './store/motionSlice';
import { useScrollReveals } from './hooks/useScrollReveals';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WelcomeStrip } from './components/WelcomeStrip';
import { PrivacySection } from './components/PrivacySection';
import { LocationsSection } from './components/LocationsSection';
import { AppSection } from './components/AppSection';
import { EverydaySection } from './components/EverydaySection';
import { GuidesSection } from './components/GuidesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Dialogs } from './components/Dialogs';
import { Announcement } from './components/Announcement';
import type { DialogId } from './types';

function MotionPreferences(): null {
  const dispatch = useAppDispatch();
  const paused = useAppSelector((state) => state.motion.motionPaused);
  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(paused);
    return () => { delete document.documentElement.dataset.motionPaused; };
  }, [paused]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      dispatch(systemReducedMotionChanged(e.matches));
    };

    reducedMotionQuery.addEventListener('change', handleMotionChange);
    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [dispatch]);

  return null;
}

export function App(): JSX.Element {
  const [activeDialog, setActiveDialog] = useState<DialogId | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  useScrollReveals();

  const handleOpenDialog = (id: DialogId, trigger?: HTMLElement) => {
    if (activeDialog) return;
    setTriggerElement(trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null));
    setActiveDialog(id);
  };
  const handleCloseDialog = useCallback(() => setActiveDialog(null), []);

  return (
    <>
      <MotionPreferences />
      <Header onOpenDemo={() => handleOpenDialog('demo-dialog')} />

      <main id="main">
        <HeroSection onOpenDemo={() => handleOpenDialog('demo-dialog')} />
        <WelcomeStrip />
        <PrivacySection />
        <LocationsSection onOpenDemo={() => handleOpenDialog('demo-dialog')} />
        <AppSection />
        <EverydaySection onOpenDemo={() => handleOpenDialog('demo-dialog')} />
        <GuidesSection
          onOpenWifiGuide={(trigger) => handleOpenDialog('guide-wifi-dialog', trigger)}
          onOpenVpnGuide={(trigger) => handleOpenDialog('guide-vpn-dialog', trigger)}
        />
        <FaqSection onOpenDemo={(trigger) => handleOpenDialog('demo-dialog', trigger)} />
      </main>

      <Footer />

      <Dialogs
        activeDialog={activeDialog}
        triggerElement={triggerElement}
        onClose={handleCloseDialog}
      />

      <Announcement />
    </>
  );
}
