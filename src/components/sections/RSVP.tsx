'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Heart, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

interface RSVPFormData {
  name: string;
  side: 'groom' | 'bride';
  attendance: 'yes' | 'no';
  guestCount: number;
  mealType: 'yes' | 'no' | 'undecided';
  message: string;
}

export function RSVP() {
  const { rsvp } = WEDDING_INFO;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    side: 'groom',
    attendance: 'yes',
    guestCount: 1,
    mealType: 'undecided',
    message: '',
  });

  if (!rsvp.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('성함을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '전송에 실패했습니다.');
      }

      toast.success('참석 여부가 전달되었습니다. 감사합니다!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        side: 'groom',
        attendance: 'yes',
        guestCount: 1,
        mealType: 'undecided',
        message: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '전송에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="rsvp" background="white">
      <SectionTitle title="참석 여부" subtitle="RSVP" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        {/* Decorative Icon */}
        <div className="relative mb-6 min-[375px]:mb-8 inline-block">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex h-16 w-16 min-[375px]:h-20 min-[375px]:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-botanical-light)] to-[var(--color-secondary)]"
          >
            <ClipboardCheck className="h-7 w-7 min-[375px]:h-9 min-[375px]:w-9 text-[var(--color-primary)]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute inset-0 -m-1.5 min-[375px]:-m-2 rounded-full border border-[var(--color-botanical)]/30"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-1.5 min-[375px]:mb-2 font-serif text-base min-[375px]:text-lg text-[var(--color-text)]">
            결혼식에 참석하시겠습니까?
          </p>
          <p className="mb-6 min-[375px]:mb-8 text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">
            축하연 준비에 참고하겠습니다.
            <br />
            참석 여부를 알려주세요.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-2 min-[375px]:gap-3 rounded-md bg-[var(--color-primary)] px-6 min-[375px]:px-8 py-3 min-[375px]:py-4 text-sm min-[375px]:text-base font-medium text-white shadow-lg transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl"
        >
          <Heart className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 transition-transform group-hover:scale-110" />
          <span className="tracking-wide">참석 의사 전달하기</span>
        </motion.button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-light)]">
                <h3
                  className="text-lg"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                  }}
                >
                  참석 여부 전달
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Name */}
                <div>
                  <label
                    className="block text-sm mb-1.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    성함 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="성함을 입력해주세요"
                    className="w-full px-3 py-2.5 text-sm border border-[var(--color-border-light)] rounded-md focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {/* Side */}
                <div>
                  <label
                    className="block text-sm mb-1.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    하객 구분 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'groom', label: '신랑측' },
                      { value: 'bride', label: '신부측' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, side: option.value as 'groom' | 'bride' })}
                        className={`flex-1 py-2.5 text-sm rounded-md border transition-all ${
                          formData.side === option.value
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                            : 'border-[var(--color-border-light)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <label
                    className="block text-sm mb-1.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    참석 여부 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'yes', label: '참석' },
                      { value: 'no', label: '불참' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, attendance: option.value as 'yes' | 'no' })}
                        className={`flex-1 py-2.5 text-sm rounded-md border transition-all ${
                          formData.attendance === option.value
                            ? option.value === 'yes'
                              ? 'border-[var(--color-botanical)] bg-[var(--color-botanical)] text-white'
                              : 'border-[var(--color-text-muted)] bg-[var(--color-text-muted)] text-white'
                            : 'border-[var(--color-border-light)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional fields for attendance=yes */}
                {formData.attendance === 'yes' && (
                  <>
                    {/* Guest Count */}
                    <div>
                      <label
                        className="block text-sm mb-1.5"
                        style={{ color: 'var(--color-text)' }}
                      >
                        참석 인원
                      </label>
                      <select
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-sm border border-[var(--color-border-light)] rounded-md focus:outline-none focus:border-[var(--color-primary)] transition-colors bg-white"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}명
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Meal */}
                    <div>
                      <label
                        className="block text-sm mb-1.5"
                        style={{ color: 'var(--color-text)' }}
                      >
                        식사 여부
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: 'yes', label: '예정' },
                          { value: 'no', label: '안함' },
                          { value: 'undecided', label: '미정' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, mealType: option.value as 'yes' | 'no' | 'undecided' })}
                            className={`flex-1 py-2 text-sm rounded-md border transition-all ${
                              formData.mealType === option.value
                                ? 'border-[var(--color-primary)] bg-[var(--color-secondary)]'
                                : 'border-[var(--color-border-light)] hover:border-[var(--color-primary)]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label
                    className="block text-sm mb-1.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    축하 메시지 (선택)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="축하 메시지를 남겨주세요"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-[var(--color-border-light)] rounded-md focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      전달하기
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
