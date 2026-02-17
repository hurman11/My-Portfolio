'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import anime from 'animejs';
import Footer from '@/components/Footer';
import useAnimeReveal from '@/hooks/useAnimeReveal';

export default function ProjectDetailClient({ project }) {
    const pageTitleRef = useRef(null);
    const mainRef = useRef(null);

    // JS-driven scroll reveals (Anime.js)

    // 1. Generic reveal-up elements
    useAnimeReveal(mainRef, '.reveal-up', {
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 1000,
    });

    // 2. Tech stack tags (staggered)
    useAnimeReveal(mainRef, '.detail-tags', {
        scale: [0.8, 1],
        opacity: [0, 1],
        easing: 'easeOutBack',
        duration: 500,
        delay: anime.stagger(50),
    }, { childSelector: '.detail-tag', threshold: 0.2 });

    // 3. Features list (staggered)
    useAnimeReveal(mainRef, '.detail-features', {
        translateX: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 600,
        delay: anime.stagger(80),
    }, { childSelector: 'li', threshold: 0.2 });

    // 4. Gallery (staggered)
    useAnimeReveal(mainRef, '.detail-gallery', {
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 600,
        delay: anime.stagger(100),
    }, { childSelector: '.gallery-placeholder', threshold: 0.2 });

    // 5. Footer (simple reveal)
    useAnimeReveal(mainRef, '.footer-wrapper', {
        translateY: [30, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 800,
    });

    // Page title entrance animation (on mount, not scroll)
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
                {/* Back Link */}
                <Link href="/#work" className="back-link">
                    <span className="arrow">&larr;</span> Back to Projects
                </Link>

                {/* Project Meta */}
                <div className="project-meta reveal-up">
                    <span className="meta-label">{project.category}</span>
                </div>

                {/* Project Title */}
                <h1 className="project-detail-title">
                    <span
                        ref={pageTitleRef}
                        style={{ display: 'inline-block', transform: 'translateY(100%)' }}
                        dangerouslySetInnerHTML={{ __html: project.titleHtml }}
                    />
                </h1>

                {/* Hero Image / Gradient */}
                <div className="project-hero-image reveal-up" style={{ transitionDelay: '0.1s' }}>
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.imageAlt || project.title}
                            width={1360}
                            height={600}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    ) : (
                        <div
                            className="project-hero-gradient"
                            style={{ background: project.gradient }}
                        >
                            {project.isPlaceholder && (
                                <span>Project Image — Coming Soon</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Placeholder content for Project 3 */}
                {project.isPlaceholder && (
                    <div className="placeholder-content reveal-up">
                        <h3>🚧 Coming Soon</h3>
                        <p>
                            This project is currently in development. Check back for a full
                            breakdown of the tech, features, and goals behind it.
                        </p>
                    </div>
                )}

                {/* Full content for non-placeholder projects */}
                {!project.isPlaceholder && (
                    <>
                        {/* Description */}
                        <div className="detail-section reveal-up">
                            <span className="detail-section-label">Overview</span>
                            <p>{project.description}</p>
                        </div>

                        {/* Tech Stack - Staggered via hook targeting .detail-tags > .detail-tag */}
                        <div className="detail-section">
                            <span className="detail-section-label reveal-up">Tech Stack</span>
                            <div className="detail-tags">
                                {project.techStack.map((tech) => (
                                    <span className="detail-tag" key={tech}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Key Features - Staggered via hook targeting .detail-features > li */}
                        {project.features.length > 0 && (
                            <div className="detail-section">
                                <span className="detail-section-label reveal-up">Key Features</span>
                                <ul className="detail-features">
                                    {project.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Screenshots - Staggered via hook targeting .detail-gallery > .gallery-placeholder */}
                        {project.screenshots.length > 0 && (
                            <div className="detail-section">
                                <span className="detail-section-label reveal-up">Screenshots</span>
                                <div className="detail-gallery">
                                    {project.screenshots.map((label, i) => (
                                        <div className="gallery-placeholder" key={i}>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* ===== Footer ===== */}
            <div className="footer-wrapper">
                <Footer />
            </div>
        </div>
    );
}
