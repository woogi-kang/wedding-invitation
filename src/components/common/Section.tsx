'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'white' | 'secondary';
}

export function Section({
  children,
  className,
  id,
  background = 'default',
}: SectionProps) {
  const bgColors = {
    default: 'bg-[var(--color-background)]',
    white: 'bg-white',
    secondary: 'bg-[var(--color-secondary)]',
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className={cn('section relative', bgColors[background], className)}
    >
      <div className="mx-auto w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl">{children}</div>
    </motion.section>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn('mb-12 text-center', className)}
    >
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className="section-subtitle">{subtitle}</p>
      )}
    </motion.div>
  );
}

export function Divider({ className }: { className?: string }) {
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

export function HorizontalDivider({ className }: { className?: string }) {
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
