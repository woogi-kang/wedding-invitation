'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Link2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { saveToCalendar, copyToClipboard, shareUrl } from '@/lib/utils';

// Kakao Icon
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.9 5.36 4.72 6.77-.15.53-.96 3.38-1 3.56 0 0-.02.13.06.18.08.05.18.02.18.02.24-.03 2.78-1.82 3.93-2.55.69.1 1.4.15 2.11.15 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}

export function Share() {
  const { groom, bride, date, dateDisplay, venue } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleSaveCalendar = () => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    saveToCalendar(
      `${groom.name} & ${bride.name} 결혼식`,
      `${venue.name} ${venue.hall}`,
      venue.roadAddress,
      startDate,
      endDate
    );

    toast.success('캘린더에 저장되었습니다');
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast.success('링크가 복사되었습니다');
    } else {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleShare = async () => {
    await shareUrl();
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.Share) {
      if (!window.Kakao.isInitialized()) {
        toast.info('카카오 SDK가 초기화되지 않았습니다');
        return;
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${groom.name} & ${bride.name} 결혼식에 초대합니다`,
          description: `${dateDisplay.year}.${dateDisplay.month}.${dateDisplay.day} ${dateDisplay.dayOfWeek} ${dateDisplay.time}\n${venue.name}`,
          imageUrl: `${window.location.origin}/images/og-image.jpg`,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      // Kakao SDK not loaded - fallback to link copy
      handleCopyLink();
      toast.info('카카오톡 공유 대신 링크가 복사되었습니다');
    }
  };

  return (
    <Section id="share" background="secondary">
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
            Share
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            공유하기
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Calendar Save */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleSaveCalendar}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)] transition-all hover:border-[var(--color-primary)]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-botanical-light)' }}
            >
              <Calendar className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
            </div>
            <div className="text-left">
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                캘린더에 저장
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                결혼식 일정을 캘린더에 추가합니다
              </p>
            </div>
          </button>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center gap-6"
        >
          <button
            onClick={handleKakaoShare}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FEE500' }}
            >
              <KakaoIcon className="h-6 w-6 text-[#3C1E1E]" />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              카카오톡
            </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
              <Link2 className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              링크 복사
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
              <Share2 className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              공유
            </span>
          </button>
        </motion.div>
      </div>
    </Section>
  );
}
