import { useEffect } from 'react';
import { useAppSelector } from '../store';

export function useScrollReveals(): void {
  const motionPaused = useAppSelector((state) => state.motion.motionPaused);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const docEl = document.documentElement;

    if (motionPaused) {
      docEl.classList.remove('motion-enabled');
      return;
    }

    docEl.classList.add('motion-enabled');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => {
      // If already visible, don't re-observe
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
      docEl.classList.remove('motion-enabled');
    };
  }, [motionPaused]);
}
