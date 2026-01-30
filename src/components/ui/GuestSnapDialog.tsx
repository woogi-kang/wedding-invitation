'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload } from 'lucide-react';
import { isBeforeWeddingStart } from '@/lib/utils';

const STORAGE_KEY_DISMISSED = 'guestsnap_dialog_dismissed';

interface GuestSnapDialogProps {
  forceOpen?: boolean; // 테스트용 강제 열기
  onClose?: () => void;
}

export function GuestSnapDialog({ forceOpen = false, onClose }: GuestSnapDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // forceOpen이면 바로 열기 (테스트용)
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // 결혼식 시작 전이면 표시하지 않음 (시작 후에만 표시)
    if (isBeforeWeddingStart()) return;

    // 이미 dismiss 했으면 표시하지 않음
    const hasDismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (hasDismissed) return;

    // 2초 후 dialog 표시
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleGoToGuestSnap = () => {
    localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    setIsOpen(false);
    onClose?.();
    // 게스트스냅 섹션으로 스크롤
    const element = document.getElementById('guestsnap');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            </button>

            {/* Polaroid Card */}
            <div
              className="p-4 pb-6"
              style={{
                backgroundColor: 'var(--color-white)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 8px 48px rgba(0,0,0,0.08)',
                transform: 'rotate(-1deg)',
              }}
            >
              {/* Photo Area */}
              <div
                className="aspect-square mb-4 rounded flex flex-col items-center justify-center p-6"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <Camera
                  className="w-16 h-16 mb-4"
                  style={{ color: 'var(--color-primary)', opacity: 0.6 }}
                />
                <p
                  className="text-lg text-center mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
                >
                  저희의 스냅 작가님이<br />되어주세요!
                </p>
                <p
                  className="text-sm text-center"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
                >
                  여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
                </p>
              </div>

              {/* Caption Area */}
              <div className="text-center">
                <p
                  className="text-sm mb-3"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
                >
                  이런 사진이면 완벽해요 ✨
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {['웃는 모습', '몰카', '함께 찍은 컷', '셀카'].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'var(--color-botanical-light)',
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p
                  className="text-xs mb-4"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
                >
                  🎁 찐 베스트컷 보내주시면 밥 쏩니다!
                </p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoToGuestSnap}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <Upload className="w-4 h-4" />
                  사진/비디오 업로드하기
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
