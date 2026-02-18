'use client';

import { useRef, useEffect } from 'react';
import anime from 'animejs';

export default function Template({ children }) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Simple fade-in and slide-up transition for page content
        anime({
            targets: wrapperRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutQuad',
            duration: 600,
        });
    }, []);

    return (
        <div ref={wrapperRef} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
