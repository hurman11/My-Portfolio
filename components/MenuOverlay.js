'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import anime from 'animejs';

export default function MenuOverlay({ isOpen, onClose }) {
    const overlayRef = useRef(null);
    const itemsRef = useRef([]);

    // Animate menu items on open
    useEffect(() => {
        if (!overlayRef.current) return;

        if (isOpen) {
            overlayRef.current.classList.add('active');

            // Reset items first
            itemsRef.current.forEach((el) => {
                if (el) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(80px) skewY(4deg)';
                }
            });

            // Stagger reveal
            anime({
                targets: itemsRef.current.filter(Boolean),
                translateY: [80, 0],
                opacity: [0, 1],
                skewY: [4, 0],
                duration: 800,
                delay: anime.stagger(80, { start: 150 }),
                easing: 'easeOutCubic',
            });
        } else {
            // Animate out
            anime({
                targets: itemsRef.current.filter(Boolean),
                translateY: [0, -40],
                opacity: [1, 0],
                duration: 400,
                delay: anime.stagger(40),
                easing: 'easeInQuad',
                complete: () => {
                    if (overlayRef.current) {
                        overlayRef.current.classList.remove('active');
                    }
                },
            });
        }
    }, [isOpen]);

    const handleItemClick = useCallback(() => {
        onClose();
    }, [onClose]);

    const setItemRef = useCallback((el, index) => {
        itemsRef.current[index] = el;
    }, []);

    const menuLinks = [
        { href: '/', label: 'Home' },
        { href: '/#work', label: 'Work' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <div className="menu-overlay" id="menuOverlay" ref={overlayRef}>
            <div className="menu-content">
                {menuLinks.map((link, i) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="menu-item"
                        ref={(el) => setItemRef(el, i)}
                        onClick={handleItemClick}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="menu-footer">
                <div className="menu-footer-col">
                    <span>Pakistan</span>
                    <span>Cybersecurity &amp; Forensics</span>
                </div>
                <div className="menu-footer-col">
                    <span>&copy; 2026</span>
                </div>
            </div>
        </div>
    );
}
