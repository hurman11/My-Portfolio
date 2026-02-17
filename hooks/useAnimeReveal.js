'use client';

import { useEffect } from 'react';
import anime from 'animejs';

/**
 * Valid configuration options for anime.js
 * @typedef {Object} AnimeConfig
 * @property {string|number|Array} [translateY]
 * @property {string|number|Array} [translateX]
 * @property {string|number|Array} [scale]
 * @property {string|number|Array} [opacity]
 * @property {number} [duration]
 * @property {string} [easing]
 * @property {number|function} [delay]
 * @property {string} [targets]
 */

/**
 * Hook to trigger Anime.js animations when elements scroll into view.
 * Supports reversible animations: plays forward on enter, reverses/resets on leave.
 * Optimized with `will-change` for smooth 60fps performance.
 *
 * @param {React.MutableRefObject} containerRef - Ref to the container element
 * @param {string} selector - CSS selector for elements to observe
 * @param {AnimeConfig} animeConfig - Anime.js configuration options (must use [from, to] array syntax for props)
 * @param {Object} options - { threshold, rootMargin, childSelector }
 */
export default function useAnimeReveal(
    containerRef,
    selector,
    animeConfig = {},
    options = {}
) {
    const { threshold = 0.15, rootMargin = '0px', childSelector = null } = options;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Select elements to observe
        const elements = container.querySelectorAll(selector);
        if (elements.length === 0) return;

        // 1. Calculate "hidden" state from the provided config
        const hiddenState = {};
        const props = ['translateY', 'translateX', 'scale', 'opacity', 'rotate', 'skewY'];
        props.forEach(prop => {
            if (Array.isArray(animeConfig[prop])) {
                hiddenState[prop] = animeConfig[prop][0];
            }
        });

        // 2. Set initial state immediately + optimized layering
        elements.forEach((el) => {
            const targets = childSelector ? el.querySelectorAll(childSelector) : [el];
            targets.forEach(target => {
                // Promote to compositor layer to prevent jank
                target.style.willChange = 'transform, opacity';

                // Apply inline styles for hydration safety/initial paint
                if (hiddenState.opacity !== undefined) target.style.opacity = hiddenState.opacity;

                let transform = '';
                if (hiddenState.translateY !== undefined) {
                    const val = hiddenState.translateY;
                    transform += `translateY(${typeof val === 'number' ? val + 'px' : val}) `;
                }
                if (hiddenState.translateX !== undefined) {
                    const val = hiddenState.translateX;
                    transform += `translateX(${typeof val === 'number' ? val + 'px' : val}) `;
                }
                if (hiddenState.scale !== undefined) transform += `scale(${hiddenState.scale}) `;

                if (transform) target.style.transform = transform;
            });
        });

        // 3. Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const targets = childSelector ? el.querySelectorAll(childSelector) : el;

                if (entry.isIntersecting) {
                    // REVEAL
                    anime({
                        targets: targets,
                        easing: 'easeOutCubic',
                        duration: 1000,
                        ...animeConfig,
                    });
                } else {
                    // HIDE / RESET
                    anime({
                        targets: targets,
                        easing: 'easeOutQuad',
                        duration: 600,
                        delay: 0,
                        ...hiddenState
                    });
                }
            });
        }, { threshold, rootMargin });

        elements.forEach((el) => observer.observe(el));

        // Cleanup: Disconnect observer AND reset will-change to save memory when unmounting
        return () => {
            observer.disconnect();
            elements.forEach((el) => {
                const targets = childSelector ? el.querySelectorAll(childSelector) : [el];
                targets.forEach(target => {
                    target.style.willChange = 'auto';
                });
            });
        };
    }, [containerRef, selector, childSelector, JSON.stringify(animeConfig), threshold, rootMargin]);
}
