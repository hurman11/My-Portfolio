'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useLenis } from './SmoothScrollProvider';
import MenuOverlay from './MenuOverlay';

export default function Header() {
    const { toggleTheme } = useTheme();
    const lenisRef = useLenis();
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    // Time display
    useEffect(() => {
        const timeEl = document.getElementById('time');
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
            });
            if (timeEl) timeEl.textContent = `LOCAL ${timeString}`;
        }
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Header scroll behavior
    useEffect(() => {
        const header = headerRef.current;
        if (!header || !lenisRef?.current) return;

        let lastScrollY = 0;
        const scrollThreshold = 100;

        const onScroll = ({ scroll }) => {
            if (scroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (scroll > scrollThreshold) {
                if (scroll > lastScrollY + 5) {
                    header.classList.add('hidden');
                } else if (scroll < lastScrollY - 5) {
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('hidden');
            }
            lastScrollY = scroll;
        };

        lenisRef.current.on('scroll', onScroll);
        return () => {
            if (lenisRef.current) {
                lenisRef.current.off('scroll', onScroll);
            }
        };
    }, [lenisRef]);

    const handleToggleMenu = useCallback(() => {
        setMenuOpen((prev) => !prev);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setMenuOpen(false);
    }, []);

    // Lock/unlock Lenis scroll when menu opens/closes
    useEffect(() => {
        if (!lenisRef?.current) return;
        if (menuOpen) {
            lenisRef.current.stop();
        } else {
            lenisRef.current.start();
        }
    }, [menuOpen, lenisRef]);

    // Close on Escape key
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);

    return (
        <>
            <MenuOverlay isOpen={menuOpen} onClose={handleCloseMenu} />

            <header id="header" ref={headerRef}>
                <div className="header-left">
                    <span id="time">LOCAL 00:00</span>
                </div>
                <div className="header-center">
                    <button
                        className="menu-toggle"
                        id="menuToggle"
                        aria-label="Toggle menu"
                        onClick={handleToggleMenu}
                    >
                        <div className="dot-row">
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                        <div className="dot-row">
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </button>
                </div>
                <div className="header-right">
                    <button
                        className="theme-toggle"
                        id="themeToggle"
                        aria-label="Toggle theme"
                        onClick={toggleTheme}
                    >
                        <svg
                            className="icon-sun"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        <svg
                            className="icon-moon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </button>
                    <Link href="/contact" className="lets-talk">
                        <span>Let&rsquo;s Talk &mdash;&gt;</span>
                    </Link>
                </div>
            </header>
        </>
    );
}
