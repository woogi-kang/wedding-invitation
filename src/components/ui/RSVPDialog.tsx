'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { WEDDING_INFO } from '@/lib/constants';
import { isBeforeWedding } from '@/lib/utils';

interface RSVPFormData {
  name: string;
  side: 'groom' | 'bride';
  attendance: 'yes' | 'no';
  guestCount: number;
  mealType: 'yes' | 'no' | 'undecided';
  message: string;
}

const STORAGE_KEY = 'wedding_rsvp_submitted';

export function RSVPDialog() {
  const { rsvp } = WEDDING_INFO;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    side: 'groom',
    attendance: 'yes',
    guestCount: 1,
    mealType: 'undecided',
    message: '',
  });

  useEffect(() => {
    // 결혼식 전이고, RSVP가 활성화되어 있고, 이미 제출하지 않았으면 2초 후 dialog 표시
    if (!rsvp.enabled || !isBeforeWedding()) return;

    const hasSubmitted = localStorage.getItem(STORAGE_KEY);
    if (hasSubmitted) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [rsvp.enabled]);

  const handleClose = () => {
    setIsOpen(false);
  };

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

      localStorage.setItem(STORAGE_KEY, 'true');
      toast.success('참석 여부가 전달되었습니다. 감사합니다!');
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '전송에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
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
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          >
            {/* Modal Header */}
            <div className="relative p-5 pb-4 border-b border-[var(--color-border-light)]">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              </button>

              <h3
                className="text-lg"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                참석 여부
              </h3>
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ color: 'var(--color-text-light)' }}
              >
                저희의 첫걸음에 함께해 주세요
                <br />
                감사한 마음 평생 잊지 않겠습니다
              </p>
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

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 text-sm rounded-md border border-[var(--color-border-light)] hover:bg-[var(--color-secondary)] transition-colors"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  나중에
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-white rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
