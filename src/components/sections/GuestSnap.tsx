'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { Button } from '@/components/ui/Button';
import { GUEST_SNAP_CONFIG, WEDDING_INFO } from '@/lib/constants';
import { GuestNameModal } from '@/components/guestsnap/GuestNameModal';
import { UploadModal } from '@/components/guestsnap/UploadModal';
import type { GuestSnapModalState, GuestSnapFile } from '@/types/guestsnap';

export function GuestSnap() {
  const { messages } = GUEST_SNAP_CONFIG;

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
      // Auto-hide after 3 seconds
      setTimeout(() => setShowNotYetMessage(false), 3000);
      return;
    }

    // If guest name is already in session, skip to upload modal
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
      <SectionTitle
        title={messages.sectionTitle}
        subtitle={messages.sectionSubtitle}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-secondary)]"
        >
          <Camera className="h-10 w-10 text-[var(--color-primary)]" />
        </motion.div>

        {/* Description */}
        <p className="mb-8 text-center text-sm text-[var(--color-text-light)] leading-relaxed max-w-[280px]">
          결혼식에서 찍어주신 사진과 영상을<br />
          저희에게 공유해주세요
        </p>

        {/* Upload button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleUploadClick}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            {messages.uploadButtonText}
          </Button>
        </motion.div>

        {/* Not yet available message */}
        {showNotYetMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-lg bg-[var(--color-secondary)] px-4 py-3 text-center"
          >
            <p className="text-sm font-medium text-[var(--color-text)]">
              {messages.notYetOpen}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-light)]">
              {messages.notYetOpenSubtitle}
            </p>
          </motion.div>
        )}

        {/* File count info */}
        <p className="mt-4 text-xs text-[var(--color-text-light)]">
          사진/영상 최대 {GUEST_SNAP_CONFIG.limits.maxFilesPerSession}개까지 공유 가능
        </p>
      </motion.div>

      {/* Name Input Modal (FIRST STEP) */}
      <GuestNameModal
        isOpen={modalState === 'name'}
        onClose={handleCloseModal}
        onSubmit={handleNameSubmit}
        initialName={guestName}
      />

      {/* Upload Modal (SECOND STEP) */}
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
