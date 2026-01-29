'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function WeddingInfo() {
  const { dateDisplay, venue } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Generate calendar data
  const generateCalendar = () => {
    const year = dateDisplay.year;
    const month = dateDisplay.month - 1;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDate; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = generateCalendar();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Section id="info" background="white">
      <div ref={sectionRef} className="max-w-md mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Schedule
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            예식 안내
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <p
            className="text-lg tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {dateDisplay.year}년 {dateDisplay.month}월 {dateDisplay.day}일 {dateDisplay.dayOfWeek}
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.time}
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10 bg-white rounded-sm border border-[var(--color-border-light)] overflow-hidden"
        >
          {/* Calendar Header */}
          <div
            className="py-4 text-center border-b"
            style={{
              backgroundColor: 'var(--color-secondary)',
              borderColor: 'var(--color-border-light)',
            }}
          >
            <span
              className="text-lg tracking-widest"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}
            </span>
          </div>

          {/* Calendar Body */}
          <div className="p-4">
            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <span
                  key={day}
                  className="text-center text-xs py-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: index === 0 ? 'var(--color-bride)' : index === 6 ? 'var(--color-groom)' : 'var(--color-text-muted)',
                  }}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isWeddingDay = day === dateDisplay.day;
                const isSunday = index % 7 === 0;
                const isSaturday = index % 7 === 6;

                return (
                  <div
                    key={index}
                    className="relative flex h-9 items-center justify-center"
                  >
                    {isWeddingDay && (
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{ backgroundColor: 'var(--color-bride)' }}
                      />
                    )}
                    <span
                      className={`relative text-sm ${isWeddingDay ? 'font-medium text-white' : ''}`}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: isWeddingDay
                          ? 'white'
                          : day
                            ? isSunday
                              ? 'var(--color-bride)'
                              : isSaturday
                                ? 'var(--color-groom)'
                                : 'var(--color-text)'
                            : 'transparent',
                      }}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Venue Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin
              className="w-4 h-4"
              style={{ color: 'var(--color-primary)' }}
            />
            <span
              className="text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {venue.name}
            </span>
          </div>
          <p
            className="text-sm mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {venue.hall}
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-muted)',
            }}
          >
            {venue.roadAddress}
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Tel. {venue.tel}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
