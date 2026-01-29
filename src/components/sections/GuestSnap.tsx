'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Upload } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { GUEST_SNAP_CONFIG, WEDDING_INFO } from '@/lib/constants';
import { GuestNameModal } from '@/components/guestsnap/GuestNameModal';
import { UploadModal } from '@/components/guestsnap/UploadModal';
import type { GuestSnapModalState, GuestSnapFile } from '@/types/guestsnap';

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
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--color-secondary)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="p-8 text-center">
            {/* Camera Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-white)',
                border: '2px solid var(--color-primary)',
              }}
            >
              <Camera className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
            </motion.div>

            {/* Description */}
            <p
              className="mb-6 text-[15px] leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
              }}
            >
              결혼식에서 찍어주신 사진과 영상을
              <br />
              저희에게 공유해주세요
            </p>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUploadClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Upload className="w-4 h-4" />
              {messages.uploadButtonText}
            </motion.button>

            {/* Not yet available message */}
            {showNotYetMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 rounded-lg px-4 py-3"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {messages.notYetOpen}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  {messages.notYetOpenSubtitle}
                </p>
              </motion.div>
            )}

            {/* File count info */}
            <p
              className="mt-6 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              사진/영상 최대 {GUEST_SNAP_CONFIG.limits.maxFilesPerSession}개까지 공유 가능
            </p>
          </div>
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
