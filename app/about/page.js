'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import Footer from '@/components/Footer';
import useAnimeReveal from '@/hooks/useAnimeReveal';

export default function AboutPage() {
    const pageTitleRef = useRef(null);
    const mainRef = useRef(null);

    // JS-driven scroll reveals (Anime.js)
    useAnimeReveal(mainRef, '.reveal-up', {
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 1000,
    });

    useAnimeReveal(mainRef, '.reveal-left', {
        translateX: [-30, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 800,
    });

    useAnimeReveal(mainRef, '.reveal-scale', {
        scale: [0.85, 1],
        opacity: [0, 1],
        easing: 'easeOutBack',
        duration: 600,
    });

    // Page title entrance animation (not scroll-triggered)
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

    return (
        <div ref={mainRef}>
            <section className="page-container">
                {/* Page Title */}
                <h1 className="page-title">
                    <span
                        ref={pageTitleRef}
                        style={{ display: 'inline-block', transform: 'translateY(100%)' }}
                    >
                        About Me
                    </span>
                </h1>

                {/* Bio Section */}
                <div className="content-block reveal-up">
                    <span className="section-label">Who is Hurman?</span>
                    <p>
                        I am a cybersecurity and digital forensics student pursuing my BS in Defence
                        Forensic and Cyber Security in Pakistan. My academic journey focuses on
                        understanding security systems, analyzing digital evidence, and building secure
                        applications.
                    </p>
                    <p>
                        With hands-on experience in Python and web development, I continuously work on
                        practical projects that strengthen my technical foundation and problem-solving
                        abilities. I approach every challenge with curiosity, discipline, and a
                        commitment to growth — because in cybersecurity, standing still means falling
                        behind.
                    </p>
                </div>

                {/* Education Section */}
                <div className="content-block reveal-up" style={{ transitionDelay: '0.1s' }}>
                    <span className="section-label">Education</span>
                    <ul className="experience-list">
                        <li className="experience-item reveal-left">
                            <span className="company">BS Defence Forensic &amp; Cyber Security</span>
                            <span className="role">University Student</span>
                            <span className="period">Present</span>
                        </li>
                    </ul>
                </div>

                {/* Core Focus Section */}
                <div className="content-block reveal-up" style={{ transitionDelay: '0.15s' }}>
                    <span className="section-label">Core Focus Areas</span>
                    <ul className="experience-list">
                        <li className="experience-item reveal-left">
                            <span className="company">Cybersecurity</span>
                            <span className="role">
                                Network security, vulnerability analysis, threat assessment
                            </span>
                            <span className="period"></span>
                        </li>
                        <li className="experience-item reveal-left">
                            <span className="company">Digital Forensics</span>
                            <span className="role">
                                Evidence analysis, forensic investigation, data recovery
                            </span>
                            <span className="period"></span>
                        </li>
                        <li className="experience-item reveal-left">
                            <span className="company">Python Development</span>
                            <span className="role">Scripting, automation, security tools</span>
                            <span className="period"></span>
                        </li>
                        <li className="experience-item reveal-left">
                            <span className="company">Web Development</span>
                            <span className="role">Frontend, secure application development</span>
                            <span className="period"></span>
                        </li>
                    </ul>
                </div>

                {/* Skills Section */}
                <div className="content-block skills-section reveal-up">
                    <span className="section-label">Skills &amp; Tools</span>
                    <div className="skills-grid">
                        <span className="skill-tag reveal-scale">Python</span>
                        <span className="skill-tag reveal-scale">Web Development</span>
                        <span className="skill-tag reveal-scale">Cybersecurity</span>
                        <span className="skill-tag reveal-scale">Digital Forensics</span>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="content-block values-section reveal-up">
                    <span className="section-label">My Approach</span>
                    <div className="values-grid">
                        <div className="value-card reveal-up">
                            <h4>Continuous Learning</h4>
                            <p>
                                Cybersecurity evolves daily. I stay committed to learning new attack
                                vectors, defense strategies, and forensic techniques to stay ahead.
                            </p>
                        </div>
                        <div className="value-card reveal-up">
                            <h4>Hands-On Practice</h4>
                            <p>
                                Theory builds the foundation, but practical application cements
                                understanding. I build real projects to test and sharpen my skills.
                            </p>
                        </div>
                        <div className="value-card reveal-up">
                            <h4>Security-First Mindset</h4>
                            <p>
                                Whether writing code or analyzing systems, security is never an
                                afterthought — it&rsquo;s the starting point of every decision I make.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Footer ===== */}
            <Footer />
        </div>
    );
}
