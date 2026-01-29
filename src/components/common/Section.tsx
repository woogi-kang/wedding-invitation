'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'white' | 'secondary' | 'primary';
  /** Use Intersection Observer instead of Framer Motion (default: false) */
  useIntersectionObserver?: boolean;
  /** Animation delay in ms */
  delay?: number;
}

export function Section({
  children,
  className,
  id,
  background = 'default',
  useIntersectionObserver = false,
  delay = 0,
}: SectionProps) {
  const bgColors = {
    default: 'bg-[var(--color-background)]',
    white: 'bg-white',
    secondary: 'bg-[var(--color-secondary)]',
    primary: 'bg-[var(--color-primary)]',
  };

  // Intersection Observer based animation
  const scrollAnimation = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
    rootMargin: '-80px',
    duration: 700,
    delay,
  });

  // Use Intersection Observer approach
  if (useIntersectionObserver) {
    return (
      <section
        ref={scrollAnimation.ref}
        id={id}
        className={cn('section relative', bgColors[background], scrollAnimation.className, className)}
        style={scrollAnimation.style}
      >
        <div className="mx-auto w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl">
          {children}
        </div>
      </section>
    );
  }

  // Default: Framer Motion approach
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: delay / 1000 }}
      className={cn('section relative', bgColors[background], className)}
    >
      <div className="mx-auto w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl">
        {children}
      </div>
    </motion.section>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  /** Use Intersection Observer instead of Framer Motion */
  useIntersectionObserver?: boolean;
  /** Animation delay in ms */
  delay?: number;
}

export function SectionTitle({
  title,
  subtitle,
  className,
  useIntersectionObserver = false,
  delay = 100,
}: SectionTitleProps) {
  const scrollAnimation = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
    duration: 500,
    delay,
  });

  if (useIntersectionObserver) {
    const isVisible = scrollAnimation.isInView || scrollAnimation.hasAnimated;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const style: React.CSSProperties = prefersReducedMotion
      ? {
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }
      : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition:
            'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        };

    return (
      <div ref={scrollAnimation.ref} className={cn('mb-12 text-center', className)} style={style}>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={cn('mb-12 text-center', className)}
    >
      {subtitle && (
        <p
          className="text-[11px] tracking-[0.4em] uppercase mb-3"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-primary)',
          }}
        >
          {subtitle}
        </p>
      )}
      <h2
        className="text-2xl mb-3"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
      </div>
    </motion.div>
  );
}

interface DividerProps {
  className?: string;
  /** Use Intersection Observer instead of Framer Motion */
  useIntersectionObserver?: boolean;
}

export function Divider({ className, useIntersectionObserver = false }: DividerProps) {
  const scrollAnimation = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
    duration: 500,
  });

  if (useIntersectionObserver) {
    const isVisible = scrollAnimation.isInView || scrollAnimation.hasAnimated;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const style: React.CSSProperties = prefersReducedMotion
      ? {
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }
      : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
          transition:
            'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        };

    return <div ref={scrollAnimation.ref} className={cn('divider', className)} style={style} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('divider', className)}
    />
  );
}

export function HorizontalDivider({
  className,
  useIntersectionObserver = false,
}: DividerProps) {
  const scrollAnimation = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
    duration: 500,
  });

  if (useIntersectionObserver) {
    const isVisible = scrollAnimation.isInView || scrollAnimation.hasAnimated;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const style: React.CSSProperties = prefersReducedMotion
      ? {
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }
      : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition:
            'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        };

    return (
      <div ref={scrollAnimation.ref} className={cn('divider-horizontal', className)} style={style} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('divider-horizontal', className)}
    />
  );
}
