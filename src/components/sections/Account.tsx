'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';
import type { AccountInfo } from '@/types';

interface AccountGroupProps {
  title: string;
  accounts: AccountInfo[];
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}

function AccountGroup({ title, accounts, isOpen, onToggle, accentColor }: AccountGroupProps) {
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

  // Filter out accounts with empty bank info
  const validAccounts = accounts.filter(acc => acc.bank && acc.number);

  if (validAccounts.length === 0) return null;

  return (
    <div className="border-b border-[var(--color-border-light)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-4 transition-colors hover:bg-[var(--color-secondary)]/50"
      >
        <span
          className="text-base"
          style={{
            fontFamily: 'var(--font-heading)',
            color: accentColor,
          }}
        >
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-5 space-y-3">
              {validAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-sm"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {account.bank}
                    </p>
                    <p
                      className="text-sm tracking-wider mb-1"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {account.number}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-light)' }}
                    >
                      {account.holder}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(account, index)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-sm border transition-all hover:opacity-70"
                    style={{
                      borderColor: accentColor,
                      color: accentColor,
                    }}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        복사
                      </>
                    )}
                  </button>
                </div>
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
      <div ref={sectionRef} className="max-w-md mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <p
            className="mb-4 text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            Gift
          </p>
          <h2
            className="text-2xl min-[375px]:text-3xl mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            마음 전하기
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            참석이 어려우신 분들을 위해
            <br />
            계좌번호를 안내드립니다.
          </p>
        </motion.div>

        {/* Account Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-sm border border-[var(--color-border-light)] overflow-hidden"
        >
          <AccountGroup
            title="신랑측 계좌번호"
            accounts={groomAccounts}
            isOpen={openSection === 'groom'}
            onToggle={() => setOpenSection(openSection === 'groom' ? null : 'groom')}
            accentColor="var(--color-groom)"
          />
          <AccountGroup
            title="신부측 계좌번호"
            accounts={brideAccounts}
            isOpen={openSection === 'bride'}
            onToggle={() => setOpenSection(openSection === 'bride' ? null : 'bride')}
            accentColor="var(--color-bride)"
          />
        </motion.div>
      </div>
    </Section>
  );
}
