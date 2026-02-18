'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SmoothScrollContext = createContext(null);

export function useLenis() {
    return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 2,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            smooth: true,
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothTouch: false,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <SmoothScrollContext.Provider value={lenisRef}>
            {children}
        </SmoothScrollContext.Provider>
    );
}
