'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Hook: trigger an Anime.js animation when element scrolls into view.
 * Uses IntersectionObserver — replaces GSAP ScrollTrigger.
 * @param {object} animeProps - Anime.js animation properties (without `targets`).
 * @param {object} options - { threshold, rootMargin, once }
 * @returns {React.RefObject} ref to attach to the element.
 */
export default function useAnimeOnScroll(animeProps, options = {}) {
    const ref = useRef(null);
    const hasAnimated = useRef(false);
    const { threshold = 0.12, rootMargin = '0px 0px -12% 0px', once = true } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && (!once || !hasAnimated.current)) {
                        hasAnimated.current = true;
                        anime({
                            targets: el,
                            ...animeProps,
                        });
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
}
