'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Check, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';
import type { AccountInfo } from '@/types';

interface AccountCardProps {
  title: string;
  label: string;
  accounts: AccountInfo[];
  isOpen: boolean;
  onToggle: () => void;
  accentColor: 'primary' | 'rose';
}

function AccountCard({ title, label, accounts, isOpen, onToggle, accentColor }: AccountCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (account: AccountInfo, index: number) => {
    const success = await copyToClipboard(account.number);
    if (success) {
      setCopiedIndex(index);
      toast.success('계좌번호가 복사되었습니다');
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      toast.error('복사에 실패했습니다');
    }
  };

  const accentStyles = {
    primary: {
      gradient: 'from-[var(--color-primary)] to-[var(--color-botanical)]',
      bg: 'bg-[var(--color-primary)]',
      hover: 'hover:border-[var(--color-botanical)]',
    },
    rose: {
      gradient: 'from-[var(--color-rose)] to-[var(--color-rose-light)]',
      bg: 'bg-[var(--color-rose)]',
      hover: 'hover:border-[var(--color-rose)]',
    },
  };

  const styles = accentStyles[accentColor];

  return (
    <div className={`overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white transition-all duration-300 ${styles.hover}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="group relative flex w-full items-center justify-between p-4 min-[375px]:p-5 text-left transition-colors"
      >
        {/* Accent line */}
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${styles.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

        <div className="flex items-center gap-2.5 min-[375px]:gap-3">
          <div className={`flex h-9 w-9 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full ${styles.bg}/10`}>
            <CreditCard className={`h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 ${accentColor === 'primary' ? 'text-[var(--color-primary)]' : 'text-[var(--color-rose)]'}`} />
          </div>
          <div>
            <span className="text-[9px] min-[375px]:text-[10px] uppercase tracking-[0.1em] min-[375px]:tracking-[0.15em] text-[var(--color-text-muted)]">{label}</span>
            <p className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">{title}</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-text-muted)]" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="space-y-2.5 min-[375px]:space-y-3 border-t border-[var(--color-border-light)] px-4 min-[375px]:px-5 py-3 min-[375px]:py-4">
              {accounts.map((account, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-[var(--color-secondary)] p-3 min-[375px]:p-4"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">
                      {account.bank}
                    </p>
                    <p className="text-sm min-[375px]:text-base font-medium tracking-wide text-[var(--color-text)] truncate">
                      {account.number}
                    </p>
                    <p className="text-xs min-[375px]:text-sm text-[var(--color-text-light)]">
                      {account.holder}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(account, index)}
                    className={`flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full ${styles.bg} text-white shadow-md transition-all hover:shadow-lg flex-shrink-0`}
                    aria-label="계좌번호 복사"
                  >
                    <AnimatePresence mode="wait">
                      {copiedIndex === index ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Account() {
  const { groom, bride } = WEDDING_INFO;
  const [openSection, setOpenSection] = useState<'groom' | 'bride' | null>(null);

  const groomAccounts: AccountInfo[] = [
    groom.account,
    groom.fatherAccount,
    groom.motherAccount,
  ];

  const brideAccounts: AccountInfo[] = [
    bride.account,
    bride.fatherAccount,
    bride.motherAccount,
  ];

  return (
    <Section id="account" background="white">
      <SectionTitle title="마음 전하기" subtitle="축의금" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 min-[375px]:mb-8 text-center"
      >
        <p className="font-serif text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">
          참석이 어려우신 분들을 위해
          <br />
          계좌번호를 안내드립니다.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="space-y-3 min-[375px]:space-y-4"
      >
        {/* Groom Side */}
        <AccountCard
          title="신랑측 계좌번호"
          label="신랑"
          accounts={groomAccounts}
          isOpen={openSection === 'groom'}
          onToggle={() => setOpenSection(openSection === 'groom' ? null : 'groom')}
          accentColor="primary"
        />

        {/* Bride Side */}
        <AccountCard
          title="신부측 계좌번호"
          label="신부"
          accounts={brideAccounts}
          isOpen={openSection === 'bride'}
          onToggle={() => setOpenSection(openSection === 'bride' ? null : 'bride')}
          accentColor="rose"
        />
      </motion.div>
    </Section>
  );
}
