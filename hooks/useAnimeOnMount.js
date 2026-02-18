'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Hook: run an Anime.js animation once on mount.
 * @param {object} animeProps - Anime.js animation properties (without `targets`).
 * @param {object} options - { delay: ms before running, enabled: boolean }
 * @returns {React.RefObject} ref to attach to the target element(s).
 */
export default function useAnimeOnMount(animeProps, options = {}) {
    const ref = useRef(null);
    const { delay = 0, enabled = true } = options;

    useEffect(() => {
        if (!enabled || !ref.current) return;

        const timeout = setTimeout(() => {
            anime({
                targets: ref.current,
                ...animeProps,
            });
        }, delay);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return ref;
}
