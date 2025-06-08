//darkmode

import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import './ThemeSwitch.scss';

const ThemeSwitch: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const sunMoonRef = useRef<SVGSVGElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const darkMaskRef = useRef<SVGCircleElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIsDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(initialIsDark);
    applyTheme(initialIsDark);
  }, []);

  // Apply theme to document and save to localStorage
  const applyTheme = (dark: boolean) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    // Apply theme transition to the whole page
    const pageTransition = gsap.timeline();
    pageTransition.to('body', {
      backgroundColor: dark ? 'var(--bg-primary)' : 'var(--bg-primary)',
      color: dark ? 'var(--text-primary)' : 'var(--text-primary)',
      duration: 0.5,
      ease: 'power2.inOut',
    });
  };

  // Create ripple effect
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!toggleButtonRef.current || !rippleRef.current) return;

    const button = toggleButtonRef.current;
    const ripple = rippleRef.current;
    const diameter = Math.max(button.clientWidth, button.clientHeight);

    const rect = button.getBoundingClientRect();

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;

    ripple.classList.remove('animate');
    // Force reflow
    void ripple.offsetWidth;
    ripple.classList.add('animate');
  };

  // Handle the theme toggle animation and state change
  const toggleTheme = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sunMoonRef.current || !raysRef.current || !darkMaskRef.current) return;

    // Create ripple effect
    createRipple(event);

    const timeline = gsap.timeline();

    // Rotate and scale animation common to both transitions
    timeline
      .to(sunMoonRef.current, {
        rotation: 360,
        scale: 1.2,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })
      .to(
        sunMoonRef.current,
        {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.1'
      );

    if (isDark) {
      // Animate to light mode
      timeline
        .to(
          toggleButtonRef.current,
          {
            backgroundColor: '#FDB813',
            duration: 0.4,
            boxShadow: '0 0 15px 1px rgba(253, 184, 19, 0.6), 0 0 30px 4px rgba(253, 184, 19, 0.3)',
            ease: 'power2.inOut',
          },
          '-=0.7'
        )
        .to(
          raysRef.current,
          {
            opacity: 1,
            scale: 1.2,
            duration: 0.4,
          },
          '-=0.4'
        )
        .to(raysRef.current, {
          scale: 1,
          duration: 0.2,
        })
        .to(
          darkMaskRef.current,
          {
            cx: '100%',
            duration: 0.5,
            ease: 'power2.inOut',
          },
          '-=0.8'
        );
    } else {
      // Animate to dark mode
      timeline
        .to(
          toggleButtonRef.current,
          {
            backgroundColor: '#2B244D',
            duration: 0.4,
            boxShadow: '0 0 15px 1px rgba(43, 36, 77, 0.6), 0 0 30px 4px rgba(43, 36, 77, 0.3)',
            ease: 'power2.inOut',
          },
          '-=0.7'
        )
        .to(
          raysRef.current,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
          },
          '-=0.4'
        )
        .to(
          darkMaskRef.current,
          {
            cx: '50%',
            duration: 0.5,
            ease: 'power2.inOut',
          },
          '-=0.4'
        );
    }

    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
  };

  return (
    <div
      ref={toggleButtonRef}
      className={`theme-switch ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div ref={rippleRef} className="ripple"></div>
      <svg
        ref={sunMoonRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Sun circle */}
        <circle cx="12" cy="12" r="5" fill="#FDB813" stroke="none" />

        {/* Sun rays */}
        <g ref={raysRef} opacity={isDark ? 0 : 1}>
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>

        {/* Moon mask that slides over the sun */}
        <circle ref={darkMaskRef} cx={isDark ? '50%' : '100%'} cy="50%" r="6" fill="#2B244D" stroke="none" />
      </svg>
    </div>
  );
};

export default ThemeSwitch;
