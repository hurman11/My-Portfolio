'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const isMobile = window.matchMedia('(max-width: 809px)').matches;
        if (isMobile) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let animationId;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const animate = () => {
            // Smooth follow
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
            animationId = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', onMouseMove);
        animationId = requestAnimationFrame(animate);

        // Hover state for interactive elements
        const addHoverListeners = () => {
            const hoverTargets = document.querySelectorAll(
                'a, button, .project-card, .skill-tag, .value-card, input, textarea'
            );
            hoverTargets.forEach((el) => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        };

        // Run once and on DOM changes (for dynamically added elements)
        addHoverListeners();
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        // Hide cursor when leaving window
        const onMouseLeave = () => { cursor.style.opacity = '0'; };
        const onMouseEnter = () => { cursor.style.opacity = '1'; };
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            observer.disconnect();
        };
    }, []);

    return <div className="cursor" ref={cursorRef} />;
}
