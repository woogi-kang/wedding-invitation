'use client';

import { motion } from 'framer-motion';
import { Share2, Calendar, User, Link2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { saveToCalendar, saveContact, copyToClipboard, shareUrl } from '@/lib/utils';

export function Share() {
  const { groom, bride, date, dateDisplay, venue } = WEDDING_INFO;

  const handleSaveCalendar = () => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    saveToCalendar(
      `${groom.name} & ${bride.name} Wedding`,
      `Wedding ceremony at ${venue.name} ${venue.hall}`,
      venue.roadAddress,
      startDate,
      endDate
    );

    toast.success('캘린더에 저장되었습니다');
  };

  const handleSaveGroomContact = () => {
    saveContact(
      `${groom.name} (신랑)`,
      groom.phone,
      `결혼식: ${dateDisplay.year}.${dateDisplay.month}.${dateDisplay.day}`
    );
    toast.success('연락처가 저장되었습니다');
  };

  const handleSaveBrideContact = () => {
    saveContact(
      `${bride.name} (신부)`,
      bride.phone,
      `결혼식: ${dateDisplay.year}.${dateDisplay.month}.${dateDisplay.day}`
    );
    toast.success('연락처가 저장되었습니다');
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
    toast.success('공유하기');
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // Initialize with your Kakao App Key
        // window.Kakao.init('YOUR_KAKAO_APP_KEY');
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${groom.name} & ${bride.name} Wedding`,
          description: `${dateDisplay.year}.${dateDisplay.month}.${dateDisplay.day} ${dateDisplay.dayOfWeek} ${dateDisplay.time}\n${venue.name} ${venue.hall}`,
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
      toast.info('카카오 SDK 설정이 필요합니다');
    }
  };

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
    <Section id="share" background="white">
      <SectionTitle title="공유하기" subtitle="저장 및 공유" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-4"
      >
        {/* Calendar Save */}
        <motion.div
          variants={itemVariants}
          className="group rounded-lg border border-[var(--color-border-light)] bg-[var(--color-secondary)]/50 p-4 min-[375px]:p-5 transition-all hover:border-[var(--color-botanical)] hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-[375px]:gap-4">
              <div className="flex h-10 w-10 min-[375px]:h-12 min-[375px]:w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                <Calendar className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">캘린더에 저장</p>
                <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)] truncate">결혼식 일정을 캘린더에 추가</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveCalendar}
              className="rounded-md bg-[var(--color-primary)] px-3 min-[375px]:px-4 py-1.5 min-[375px]:py-2 text-xs min-[375px]:text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-md flex-shrink-0"
            >
              저장
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Save */}
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-[var(--color-secondary)]/50 p-4 min-[375px]:p-5"
        >
          <div className="mb-3 min-[375px]:mb-4 flex items-center gap-3 min-[375px]:gap-4">
            <div className="flex h-10 w-10 min-[375px]:h-12 min-[375px]:w-12 items-center justify-center rounded-full bg-white shadow-sm flex-shrink-0">
              <User className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">연락처 저장</p>
              <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">휴대폰 연락처에 저장</p>
            </div>
          </div>
          <div className="flex gap-2 min-[375px]:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveGroomContact}
              className="flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 min-[375px]:px-4 py-2.5 min-[375px]:py-3 text-xs min-[375px]:text-sm font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:shadow-sm"
            >
              신랑 {groom.name}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveBrideContact}
              className="flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 min-[375px]:px-4 py-2.5 min-[375px]:py-3 text-xs min-[375px]:text-sm font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-rose)] hover:shadow-sm"
            >
              신부 {bride.name}
            </motion.button>
          </div>
        </motion.div>

        {/* Share Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 min-[375px]:gap-3">
          {/* Kakao */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleKakaoShare}
            className="flex flex-col items-center gap-2 min-[375px]:gap-3 rounded-lg bg-[#FEE500] p-4 min-[375px]:p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <MessageCircle className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 text-[#3C1E1E]" />
            <span className="text-[10px] min-[375px]:text-xs font-medium text-[#3C1E1E]">카카오톡</span>
          </motion.button>

          {/* Link Copy */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 min-[375px]:gap-3 rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5 shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <Link2 className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 text-[var(--color-primary)]" />
            <span className="text-[10px] min-[375px]:text-xs font-medium text-[var(--color-text)]">링크 복사</span>
          </motion.button>

          {/* Native Share */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex flex-col items-center gap-2 min-[375px]:gap-3 rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5 shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <Share2 className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 text-[var(--color-primary)]" />
            <span className="text-[10px] min-[375px]:text-xs font-medium text-[var(--color-text)]">공유</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </Section>
  );
}
