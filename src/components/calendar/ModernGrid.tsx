'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function ModernGrid({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  // Generate mini calendar
  const generateCalendar = () => {
    const year = dateDisplay.year;
    const month = dateDisplay.month - 1;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center justify-center py-4 px-4 ${className}`}
    >
      {/* Date & Time Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <p
          className="text-3xl sm:text-4xl font-light"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
          }}
        >
          {dateDisplay.year}.{String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')}
        </p>
        <p
          className="text-sm tracking-wider mt-2"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.time}
        </p>
      </motion.div>

      {/* Mini Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-[280px] p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <span
              key={`header-${index}`}
              className="text-center text-[10px] font-medium py-1"
              style={{
                fontFamily: 'var(--font-accent)',
                color: index === 0 ? 'var(--color-bride)' : index === 6 ? 'var(--color-groom)' : 'var(--color-text-muted)',
              }}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isWeddingDay = day === dateDisplay.day;
            const isSunday = index % 7 === 0;
            const isSaturday = index % 7 === 6;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.01 }}
                className="relative flex items-center justify-center h-8"
              >
                {isWeddingDay && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                    className="absolute inset-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-bride)' }}
                  />
                )}
                <span
                  className={`relative text-xs ${isWeddingDay ? 'font-medium' : ''}`}
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
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
}
