'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import anime from 'animejs';
import Footer from '@/components/Footer';
import { projects } from '@/lib/projects';
import useAnimeReveal from '@/hooks/useAnimeReveal';

export default function HomePage() {
  const heroLinesRef = useRef([]);
  const heroSubtitleRef = useRef(null);
  const heroFooterRef = useRef(null);
  const mainRef = useRef(null);

  // JS-driven scroll reveals (Anime.js)
  // Standard up reveal
  useAnimeReveal(mainRef, '.reveal-up', {
    translateY: [60, 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: 1000,
  });

  // Left reveal
  useAnimeReveal(mainRef, '.reveal-left', {
    translateX: [-60, 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: 1000,
  });

  // Scale reveal
  useAnimeReveal(mainRef, '.reveal-scale', {
    scale: [0.85, 1],
    opacity: [0, 1],
    easing: 'easeOutBack',
    duration: 800,
  });

  // Project cards with custom stagger delay via data-delay attribute
  // Note: We use a separate selector to apply specific delay logic if needed,
  // but here we can just use .reveal-up and rely on intersection timing.
  // For true stagger, we'd observe the container, but individual observe is robust.

  // Hero entrance animations on mount
  useEffect(() => {
    const lines = heroLinesRef.current.filter(Boolean);
    if (lines.length > 0) {
      anime({
        targets: lines,
        translateY: ['100%', '0%'],
        opacity: [0, 1],
        duration: 1400,
        delay: anime.stagger(150, { start: 300 }),
        easing: 'easeOutQuart',
      });
    }

    if (heroSubtitleRef.current) {
      anime({
        targets: heroSubtitleRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 900,
        easing: 'easeOutCubic',
      });
    }

    if (heroFooterRef.current) {
      anime({
        targets: heroFooterRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 1200,
        easing: 'easeOutCubic',
      });
    }
  }, []);

  return (
    <div ref={mainRef}>
      {/* ===== Hero Section ===== */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="line">
              <span
                ref={(el) => (heroLinesRef.current[0] = el)}
                style={{ display: 'inline-block', opacity: 0, transform: 'translateY(100%)', willChange: 'transform, opacity' }}
              >
                Securing The
              </span>
            </div>
            <div className="line">
              <span
                ref={(el) => (heroLinesRef.current[1] = el)}
                style={{ display: 'inline-block', opacity: 0, transform: 'translateY(100%)', willChange: 'transform, opacity' }}
              >
                Digital Frontier
              </span>
            </div>
          </h1>
          <p
            className="hero-subtitle"
            ref={heroSubtitleRef}
            style={{ opacity: 0, transform: 'translateY(30px)', willChange: 'transform, opacity' }}
          >
            I&rsquo;m Hurman — a cybersecurity and digital forensics student with a drive
            for understanding security systems, analyzing digital evidence, and building
            secure applications.
          </p>
        </div>

        {/* Hero Bottom Bar */}
        <div
          className="hero-footer"
          ref={heroFooterRef}
          style={{ opacity: 0, transform: 'translateY(20px)', willChange: 'transform, opacity' }}
        >
          <div className="hero-footer-col">
            <span>Pakistan</span>
            <span>Hurman / Cybersecurity &amp; Digital Forensics</span>
          </div>
          <div className="hero-scroll-cue">
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'var(--text-dark)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Scroll
            </span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>

      {/* ===== Projects Section ===== */}
      <section className="projects" id="work">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            className="project-card reveal-up"
          // We can add a slight delay based on index for visual stagger
          // Anime.js can read this if we passed a function to delay, but 
          // for now let's just rely on scroll position.
          >
            <Link href={`/projects/${project.slug}`}>
              <div className="project-image">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                    priority={i === 0}
                  />
                ) : (
                  <div
                    className="project-gradient"
                    style={{ background: project.cardGradient }}
                  ></div>
                )}
              </div>
              <div className="project-info">
                <span className="project-label">{project.category}</span>
                <h2>{project.title}</h2>
                <p>{project.cardDescription}</p>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* ===== About Preview Section ===== */}
      <section className="about-preview">
        <div className="section-header reveal-up">
          <h2>About</h2>
          <span>(01)</span>
        </div>
        <div className="about-preview-content">
          <div className="about-preview-image reveal-left">
            <div className="placeholder-avatar"></div>
          </div>
          <div className="about-preview-text">
            <h3 className="reveal-up">
              Building skills
              <br />
              to defend the
              <br />
              digital world
            </h3>
            <p className="reveal-up">
              I&rsquo;m a BS student in Defence Forensic and Cyber Security from
              Pakistan, developing hands-on expertise in cybersecurity, digital
              forensics, Python development, and secure web applications.
            </p>
            <Link href="/about" className="read-more reveal-up">
              Read More <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
