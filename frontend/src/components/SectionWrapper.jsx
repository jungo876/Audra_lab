import React, { useEffect, useRef, useState } from 'react';

export default function SectionWrapper({ children, className = '', id = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section-container ${className} ${isVisible ? 'visible' : ''} ${className.includes('full-width') ? 'full-width' : ''}`}
    >
      {children}
    </section>
  );
}
