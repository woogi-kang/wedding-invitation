'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Upload, Share2 } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { GUEST_SNAP_CONFIG, WEDDING_INFO } from '@/lib/constants';
import { GuestNameModal } from '@/components/guestsnap/GuestNameModal';
import { UploadModal } from '@/components/guestsnap/UploadModal';

import type { GuestSnapModalState, GuestSnapFile } from '@/types/guestsnap';

// 디자인 선택: 'sample7' | 'sample8'
const DESIGN_VARIANT: 'sample7' | 'sample8' = 'sample8';


export function GuestSnap() {
  const { messages } = GUEST_SNAP_CONFIG;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Modal state management
  const [modalState, setModalState] = useState<GuestSnapModalState>('closed');
  const [guestName, setGuestName] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<GuestSnapFile[]>([]);
  const [showNotYetMessage, setShowNotYetMessage] = useState(false);

  // Check if feature is available (wedding day or after)
  const isFeatureAvailable = useMemo(() => {
    const weddingDate = new Date(GUEST_SNAP_CONFIG.weddingDate);
    weddingDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= weddingDate;
  }, []);

  // Handle main button click
  const handleUploadClick = useCallback(() => {
    if (!isFeatureAvailable) {
      setShowNotYetMessage(true);
      setTimeout(() => setShowNotYetMessage(false), 3000);
      return;
    }

    if (guestName) {
      setModalState('upload');
    } else {
      setModalState('name');
    }
  }, [isFeatureAvailable, guestName]);

  // Handle name submission
  const handleNameSubmit = useCallback((name: string) => {
    setGuestName(name);
    setModalState('upload');
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalState('closed');
    setSelectedFiles([]);
  }, []);

  // Handle files selected
  const handleFilesSelected = useCallback((files: GuestSnapFile[]) => {
    setSelectedFiles(files);
  }, []);

  // Handle back to name modal
  const handleBackToName = useCallback(() => {
    setModalState('name');
  }, []);

  return (
    <Section id="guestsnap" background="white">
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
            {messages.sectionSubtitle}
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {messages.sectionTitle}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {DESIGN_VARIANT === 'sample7' ? (
            /* Sample 7: 폴라로이드 스타일 */
            <div className="flex justify-center">
              <div
                className="w-full max-w-sm p-4 pb-8"
                style={{
                  backgroundColor: 'var(--color-white)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 8px 48px rgba(0,0,0,0.04)',
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
                    몰래 찍어주셔도 좋아요,<br />아니 제발 찍어주세요
                  </p>
                  <p
                    className="text-sm text-center"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
                  >
                    셀카든 몰카든<br />그 순간이 저희에겐 전부예요
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
                    {['우는 신랑', '눈맞춤', '단체컷', '풍경', '아무거나'].map((tag, i) => (
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
                    MVP 스냅작가에겐 특별한 감사선물을 전달드릴게요
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    공유하기
                  </motion.button>

                  {/* Not yet available message */}
                  {showNotYetMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-lg px-4 py-3"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {messages.notYetOpen}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {messages.notYetOpenSubtitle}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Sample 8: 미니멀 라인 스타일 */
            <div className="py-4">
              {/* Top Line Decoration */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
                <Camera className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
              </div>

              {/* Main Content */}
              <div className="text-center px-4">
                <p
                  className="text-xl mb-6"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
                >
                  찍어주신 소중한 사진을 공유해주세요
                </p>

                <p
                  className="text-[15px] leading-loose mb-8"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
                >
                  그 순간을 감사히 간직하겠습니다
                </p>

                {/* Tips - Minimal List */}
                <div
                  className="inline-block text-left mb-8 p-6"
                  style={{ borderLeft: '2px solid var(--color-primary)' }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-4"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-accent)' }}
                  >
                    Photo Guide
                  </p>
                  <div className="space-y-2">
                    {['신랑이 우는 장면 (제보 환영)', '둘이 눈 마주치는 순간', '예식장 분위기가 담긴 풍경', '하객분들끼리 찍는 단체컷', '아무거나 다 좋아요 진짜로'].map((tip, i) => (
                      <p
                        key={i}
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
                      >
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Reward */}
                <p
                  className="text-sm mb-2"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
                >
                  MVP 스냅작가에겐 특별한 감사선물을 전달드릴게요
                </p>
                <p
                  className="text-xs mb-8"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
                >
                  아래 버튼으로 바로 공유 가능
                </p>

                {/* Button */}
                <div className="flex flex-col items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-3 px-8 py-4 text-sm"
                    style={{
                      border: '1px solid var(--color-primary)',
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    SHARE PHOTOS
                  </motion.button>


                </div>

                {/* Not yet available message */}
                {showNotYetMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg px-4 py-3"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {messages.notYetOpen}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {messages.notYetOpenSubtitle}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Bottom Line Decoration */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Name Input Modal */}
      <GuestNameModal
        isOpen={modalState === 'name'}
        onClose={handleCloseModal}
        onSubmit={handleNameSubmit}
        initialName={guestName}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={modalState === 'upload'}
        onClose={handleCloseModal}
        onBack={handleBackToName}
        guestName={guestName}
        selectedFiles={selectedFiles}
        onFilesSelected={handleFilesSelected}
      />

    </Section>
  );
}
