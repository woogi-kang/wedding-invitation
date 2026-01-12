'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Section, SectionTitle, HorizontalDivider } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { useCountdown } from '@/hooks/useCountdown';

export function WeddingInfo() {
  const { date, dateDisplay, venue } = WEDDING_INFO;
  const countdown = useCountdown(date);

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
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <Section id="info" background="white">
      <SectionTitle title="결혼식 안내" subtitle="일정" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Date & Time Display */}
        <motion.div variants={itemVariants} className="mb-8 min-[375px]:mb-10 text-center">
          <div className="mb-3 min-[375px]:mb-4 inline-flex items-center gap-1.5 min-[375px]:gap-2 rounded-full bg-[var(--color-botanical-light)]/50 px-4 min-[375px]:px-5 py-1.5 min-[375px]:py-2">
            <Calendar className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 text-[var(--color-primary)]" />
            <span className="font-serif text-xs min-[375px]:text-sm tracking-wider text-[var(--color-primary)]">
              {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
            </span>
          </div>
          <p className="font-serif text-xl min-[375px]:text-2xl font-light tracking-wide text-[var(--color-text)] sm:text-3xl">
            {dateDisplay.dayOfWeek}
          </p>
          <div className="mt-2 min-[375px]:mt-3 flex items-center justify-center gap-1.5 min-[375px]:gap-2 text-[var(--color-text-light)]">
            <Clock className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4" />
            <span className="text-xs min-[375px]:text-sm tracking-wider">{dateDisplay.time}</span>
          </div>
        </motion.div>

        {/* Elegant Calendar */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-8 min-[375px]:mb-10 max-w-[280px] min-[375px]:max-w-xs sm:max-w-sm overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white shadow-sm"
        >
          {/* Calendar Header */}
          <div className="bg-[var(--color-primary)] px-4 min-[375px]:px-6 py-3 min-[375px]:py-4 text-center">
            <span className="font-serif text-base min-[375px]:text-lg tracking-[0.15em] min-[375px]:tracking-[0.2em] text-white">
              {dateDisplay.year}
            </span>
            <span className="mx-1.5 min-[375px]:mx-2 text-white/50">|</span>
            <span className="font-serif text-base min-[375px]:text-lg tracking-[0.1em] text-white">
              {String(dateDisplay.month).padStart(2, '0')}
            </span>
          </div>

          <div className="p-3 min-[375px]:p-4 sm:p-5">
            {/* Week Days */}
            <div className="mb-2 min-[375px]:mb-3 grid grid-cols-7 gap-0.5 min-[375px]:gap-1 text-center">
              {weekDays.map((day, index) => (
                <span
                  key={day + index}
                  className={`text-[10px] min-[375px]:text-xs font-medium tracking-wider ${
                    index === 0
                      ? 'text-[var(--color-rose)]'
                      : index === 6
                      ? 'text-[var(--color-botanical)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 min-[375px]:gap-1 text-center text-xs min-[375px]:text-sm">
              {calendarDays.map((day, index) => {
                const isWeddingDay = day === dateDisplay.day;
                const isSunday = index % 7 === 0;
                const isSaturday = index % 7 === 6;

                return (
                  <div
                    key={index}
                    className={`relative flex h-7 w-7 min-[375px]:h-8 min-[375px]:w-8 sm:h-9 sm:w-9 items-center justify-center ${
                      isWeddingDay ? 'z-10' : ''
                    }`}
                  >
                    {isWeddingDay && (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border border-[var(--color-primary)] opacity-50"
                        />
                      </>
                    )}
                    <span
                      className={`relative ${
                        isWeddingDay
                          ? 'font-serif text-sm min-[375px]:text-base font-semibold text-white'
                          : day
                          ? isSunday
                            ? 'text-[var(--color-rose)]'
                            : isSaturday
                            ? 'text-[var(--color-botanical)]'
                            : 'text-[var(--color-text)]'
                          : ''
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* D-Day Countdown */}
        {!countdown.isExpired && (
          <motion.div variants={itemVariants} className="mb-8 min-[375px]:mb-10">
            <div className="flex justify-center gap-2 min-[375px]:gap-3 sm:gap-4">
              {[
                { value: countdown.days, label: '일' },
                { value: String(countdown.hours).padStart(2, '0'), label: '시간' },
                { value: String(countdown.minutes).padStart(2, '0'), label: '분' },
                { value: String(countdown.seconds).padStart(2, '0'), label: '초' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="flex h-14 w-14 min-[375px]:h-16 min-[375px]:w-16 items-center justify-center rounded-lg border border-[var(--color-border-light)] bg-white shadow-sm sm:h-20 sm:w-20"
                    style={{
                      background: `linear-gradient(180deg, white 0%, var(--color-secondary) 100%)`,
                    }}
                  >
                    <span className="font-serif text-xl min-[375px]:text-2xl font-light text-[var(--color-primary)] sm:text-3xl">
                      {item.value}
                    </span>
                  </div>
                  <span className="mt-1.5 min-[375px]:mt-2 block text-[9px] min-[375px]:text-[10px] uppercase tracking-[0.1em] min-[375px]:tracking-[0.15em] text-[var(--color-text-muted)]">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <HorizontalDivider />

        {/* Venue Info */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="mb-3 min-[375px]:mb-4 inline-flex items-center gap-1.5 min-[375px]:gap-2 text-[var(--color-primary)]">
            <MapPin className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5" />
            <span className="font-serif text-lg min-[375px]:text-xl font-medium">{venue.name}</span>
          </div>
          <p className="text-xs min-[375px]:text-sm text-[var(--color-text-light)]">{venue.hall}</p>
          <p className="mt-2 min-[375px]:mt-3 text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text)]">
            {venue.roadAddress}
          </p>
          <p className="mt-1.5 min-[375px]:mt-2 text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">
            Tel. {venue.tel}
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
