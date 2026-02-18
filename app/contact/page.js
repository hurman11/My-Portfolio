'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import anime from 'animejs';
import Footer from '@/components/Footer';
import useAnimeReveal from '@/hooks/useAnimeReveal';

// Dynamic import for Leaflet CSS (client only)
const ContactMap = dynamic(() => import('@/components/ContactMap'), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)' }} />,
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactPage() {
    const pageTitleRef = useRef(null);
    const formRef = useRef(null);
    const mainRef = useRef(null);
    const [formState, setFormState] = useState('idle'); // idle | loading | success

    // JS-driven scroll reveals (Anime.js)
    useAnimeReveal(mainRef, '.reveal-up', {
        translateY: [40, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 1000,
    });

    // Page title default entrance animation
    useEffect(() => {
        if (pageTitleRef.current) {
            anime({
                targets: pageTitleRef.current,
                translateY: ['100%', '0%'],
                duration: 1200,
                delay: 200,
                easing: 'easeOutQuart',
            });
        }
    }, []);

    // Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;

        // Clear previous errors
        const groups = form.querySelectorAll('.form-group');
        groups.forEach((g) => g.classList.remove('error', 'success'));

        let isValid = true;
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const subject = form.querySelector('#subject');
        const message = form.querySelector('#message');

        if (!name.value.trim()) {
            name.closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!email.value.trim() || !isValidEmail(email.value)) {
            email.closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!subject.value.trim()) {
            subject.closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!message.value.trim()) {
            message.closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            const errorGroups = form.querySelectorAll('.form-group.error');
            anime({
                targets: errorGroups,
                translateX: [-8, 0],
                duration: 400,
                easing: 'easeOutElastic(1, 0.3)',
            });
            return;
        }

        setFormState('loading');

        // Remove previous error banner
        const existingError = form.querySelector('.form-error-banner');
        if (existingError) existingError.remove();

        try {
            const response = await fetch(`${BACKEND_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    message: `[${subject.value.trim()}]\n\n${message.value.trim()}`,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFormState('success');
            } else {
                let errorMsg = 'Something went wrong. Please try again.';
                if (typeof data.detail === 'string') {
                    errorMsg = data.detail;
                } else if (Array.isArray(data.detail) && data.detail.length > 0) {
                    errorMsg = data.detail
                        .map((err) => err.msg || err.message || '')
                        .filter(Boolean)
                        .join('. ');
                }
                throw new Error(errorMsg);
            }
        } catch (err) {
            setFormState('idle');

            const errorBanner = document.createElement('div');
            errorBanner.className = 'form-error-banner';
            errorBanner.textContent =
                err.message || 'Could not connect to server. Please try again later.';
            errorBanner.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: var(--font-ui);
        font-size: 14px;
        text-align: center;
        animation: fadeIn 0.3s ease;
      `;
            const submitBtn = form.querySelector('#submitBtn');
            form.insertBefore(errorBanner, submitBtn);

            setTimeout(() => {
                if (errorBanner.parentNode) {
                    errorBanner.style.opacity = '0';
                    errorBanner.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => errorBanner.remove(), 300);
                }
            }, 5000);
        }
    };

    // Real-time validation
    const handleBlur = (e) => {
        const input = e.target;
        const group = input.closest('.form-group');
        if (input.value.trim()) {
            group.classList.remove('error');
            group.classList.add('success');
        }
    };

    const handleInput = (e) => {
        const input = e.target;
        const group = input.closest('.form-group');
        if (group.classList.contains('error') && input.value.trim()) {
            group.classList.remove('error');
        }
    };

    return (
        <div ref={mainRef}>
            {/* Leaflet CSS globally for contact page */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />

            <section className="page-container">
                {/* Page Title */}
                <h1 className="page-title">
                    <span
                        ref={pageTitleRef}
                        style={{ display: 'inline-block', transform: 'translateY(100%)' }}
                    >
                        Let&rsquo;s Talk
                    </span>
                </h1>

                <div className="content-block reveal-up">
                    <p>
                        Have a project idea, a collaboration in mind, or just want to connect? Drop me
                        a message and I&rsquo;ll get back to you.
                    </p>
                </div>

                {/* Contact Layout: Form + Info */}
                <div className="contact-layout">
                    {/* Contact Form */}
                    {formState !== 'success' && (
                        <form
                            className="contact-form"
                            id="contactForm"
                            ref={formRef}
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group reveal-up">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder=" "
                                    required
                                    autoComplete="name"
                                    onBlur={handleBlur}
                                    onInput={handleInput}
                                />
                                <label htmlFor="name">Your Name</label>
                                <span className="error-message">Please enter your name</span>
                            </div>

                            <div className="form-group reveal-up" style={{ transitionDelay: '0.1s' }}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder=" "
                                    required
                                    autoComplete="email"
                                    onBlur={handleBlur}
                                    onInput={handleInput}
                                />
                                <label htmlFor="email">Email Address</label>
                                <span className="error-message">Please enter a valid email</span>
                            </div>

                            <div className="form-group reveal-up" style={{ transitionDelay: '0.2s' }}>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    placeholder=" "
                                    required
                                    onBlur={handleBlur}
                                    onInput={handleInput}
                                />
                                <label htmlFor="subject">Subject</label>
                                <span className="error-message">Please enter a subject</span>
                            </div>

                            <div className="form-group reveal-up" style={{ transitionDelay: '0.3s' }}>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    placeholder=" "
                                    required
                                    onBlur={handleBlur}
                                    onInput={handleInput}
                                ></textarea>
                                <label htmlFor="message">Your Message</label>
                                <span className="error-message">Please enter your message</span>
                            </div>

                            <button
                                type="submit"
                                className={`submit-btn reveal-up ${formState === 'loading' ? 'loading' : ''}`}
                                id="submitBtn"
                                style={{ transitionDelay: '0.4s' }}
                            >
                                <span>Send Message</span>
                            </button>
                        </form>
                    )}

                    {/* Success Message */}
                    {formState === 'success' && (
                        <div className="form-success show">
                            <div className="check-icon">✓</div>
                            <h3>Message Sent!</h3>
                            <p>
                                Thank you for reaching out. I&rsquo;ll get back to you as soon as
                                possible.
                            </p>
                        </div>
                    )}

                    {/* Contact Info Panel */}
                    <div className="contact-info">
                        <div className="contact-info-block reveal-up" style={{ transitionDelay: '0.2s' }}>
                            <h4>Email</h4>
                            <a href="mailto:hurmanejaz@gmail.com">hurmanejaz@gmail.com</a>
                        </div>

                        <div className="contact-info-block reveal-up" style={{ transitionDelay: '0.3s' }}>
                            <h4>Based In</h4>
                            <p>
                                Pakistan
                                <br />
                                PKT (UTC+5:00)
                            </p>
                        </div>

                        <div className="contact-info-block reveal-up" style={{ transitionDelay: '0.4s' }}>
                            <h4>Connect</h4>
                            <p>
                                <a href="#" target="_blank" rel="noopener">
                                    LinkedIn
                                </a>
                                <br />
                                <a href="#" target="_blank" rel="noopener">
                                    GitHub
                                </a>
                            </p>
                        </div>

                        {/* Leaflet Map */}
                        <div className="map-container reveal-up" style={{ transitionDelay: '0.5s' }}>
                            <ContactMap />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Footer ===== */}
            <Footer />
        </div>
    );
}
