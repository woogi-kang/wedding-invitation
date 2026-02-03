/**
 * AnimateOnScroll Component
 * Wrapper component for scroll-triggered fade-in-up animations
 * Uses Intersection Observer for performance
 */

'use client';

import React, { Children, cloneElement, isValidElement } from 'react';
import { useScrollAnimation, useScrollAnimationWithStagger } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationVariant = 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav' | 'span' | 'p';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** Animation variant (default: 'fadeInUp') */
  variant?: AnimationVariant;
  /** Element to render as (default: 'div') */
  as?: ElementType;
  /** Additional class names */
  className?: string;
  /** Threshold for triggering animation (0-1, default: 0.15) */
  threshold?: number;
  /** Root margin for earlier/later triggering */
  rootMargin?: string;
  /** Delay before animation starts in ms */
  delay?: number;
  /** Duration of animation in ms (default: 700) */
  duration?: number;
  /** Whether to trigger only once (default: true) */
  triggerOnce?: boolean;
  /** Disable animation */
  disabled?: boolean;
  /** Enable staggered children animations */
  staggerChildren?: boolean;
  /** Delay between each staggered child (ms) */
  staggerDelay?: number;
  /** Additional styles */
  style?: React.CSSProperties;
  /** ID for the element */
  id?: string;
}

// Animation variant styles
const getVariantStyle = (
  variant: AnimationVariant,
  isVisible: boolean,
  duration: number,
  prefersReducedMotion: boolean
): React.CSSProperties => {
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  if (prefersReducedMotion) {
    return {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration * 0.5}ms ease`,
    };
  }

  const variants: Record<AnimationVariant, { initial: React.CSSProperties; animate: React.CSSProperties }> = {
    fadeInUp: {
      initial: { opacity: 0, transform: 'translateY(40px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideInLeft: {
      initial: { opacity: 0, transform: 'translateX(-40px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    },
    slideInRight: {
      initial: { opacity: 0, transform: 'translateX(40px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    },
    scaleIn: {
      initial: { opacity: 0, transform: 'scale(0.9)' },
      animate: { opacity: 1, transform: 'scale(1)' },
    },
  };

  const { initial, animate } = variants[variant];
  const currentStyle = isVisible ? animate : initial;

  return {
    ...currentStyle,
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
  };
};

/**
 * AnimateOnScroll - Simple wrapper for scroll animations
 */
export function AnimateOnScroll({
  children,
  variant = 'fadeInUp',
  as: Component = 'div',
  className,
  threshold = 0.15,
  rootMargin = '-10%',
  delay = 0,
  duration = 700,
  triggerOnce = true,
  disabled = false,
  staggerChildren = false,
  staggerDelay = 100,
  style,
  id,
}: AnimateOnScrollProps) {
  // Count children for stagger
  const childArray = Children.toArray(children);
  const childCount = childArray.length;

  // Always call both hooks to satisfy React rules (hooks must be called in same order)
  const basicAnimation = useScrollAnimation<HTMLDivElement>({
    threshold,
    rootMargin,
    delay,
    duration,
    triggerOnce,
    disabled,
  });

  const staggerAnimation = useScrollAnimationWithStagger<HTMLDivElement>(childCount, {
    threshold,
    rootMargin,
    delay,
    duration,
    triggerOnce,
    disabled,
    staggerDelay,
  });

  // Select which animation to use
  const animation = staggerChildren ? staggerAnimation : basicAnimation;

  // Detect reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isVisible = animation.isInView || animation.hasAnimated;

  // Get animation style for the container
  const animationStyle = staggerChildren
    ? { opacity: 1 } // Parent is always visible when staggering children
    : getVariantStyle(variant, isVisible, duration, prefersReducedMotion);

  // Render children with stagger if enabled
  const renderChildren = () => {
    if (!staggerChildren) return children;

    return childArray.map((child, index) => {
      if (!isValidElement(child)) return child;

      const childStyle = staggerAnimation.getChildStyle(index);

      return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
        style: {
          ...(child.props as { style?: React.CSSProperties }).style,
          ...childStyle,
        },
      });
    });
  };

  // Create the element with proper typing
  const props = {
    ref: animation.ref,
    id,
    className: cn(animation.className, className),
    style: {
      ...animationStyle,
      ...style,
    },
    children: renderChildren(),
  };

  return React.createElement(Component, props);
}

/**
 * AnimatedSection - Pre-configured section with scroll animation
 * Integrates with the existing section styling
 */
interface AnimatedSectionProps extends Omit<AnimateOnScrollProps, 'as'> {
  /** Background style */
  background?: 'default' | 'white' | 'secondary' | 'primary';
}

export function AnimatedSection({
  children,
  className,
  background = 'default',
  variant = 'fadeInUp',
  threshold = 0.1,
  rootMargin = '-80px',
  duration = 700,
  ...props
}: AnimatedSectionProps) {
  const bgColors = {
    default: 'bg-[var(--color-background)]',
    white: 'bg-white',
    secondary: 'bg-[var(--color-secondary)]',
    primary: 'bg-[var(--color-primary)]',
  };

  return (
    <AnimateOnScroll
      as="section"
      variant={variant}
      threshold={threshold}
      rootMargin={rootMargin}
      duration={duration}
      className={cn('section relative', bgColors[background], className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl">{children}</div>
    </AnimateOnScroll>
  );
}

/**
 * AnimatedTitle - Pre-configured title with scroll animation
 */
interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export function AnimatedTitle({ title, subtitle, className, delay = 100 }: AnimatedTitleProps) {
  const animation = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
    delay,
    duration: 500,
  });

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isVisible = animation.isInView || animation.hasAnimated;

  const style: React.CSSProperties = prefersReducedMotion
    ? {
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 250ms ease',
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      };

  return (
    <div ref={animation.ref} className={cn('mb-12 text-center', className)} style={style}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

/**
 * AnimatedDivider - Divider with scroll animation
 */
export function AnimatedDivider({ className }: { className?: string }) {
  const animation = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
    duration: 500,
  });

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isVisible = animation.isInView || animation.hasAnimated;

  const style: React.CSSProperties = prefersReducedMotion
    ? {
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 250ms ease',
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      };

  return <div ref={animation.ref} className={cn('divider', className)} style={style} />;
}

export default AnimateOnScroll;
