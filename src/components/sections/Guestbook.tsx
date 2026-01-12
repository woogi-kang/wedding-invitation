'use client';

import { motion } from 'framer-motion';
import { MessageSquare, PenLine } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Guestbook() {
  const { guestbook } = WEDDING_INFO;

  if (!guestbook.enabled) return null;

  return (
    <Section id="guestbook" background="secondary">
      <SectionTitle title="방명록" subtitle="축하 메시지" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-[var(--color-border-light)] bg-gradient-to-r from-[var(--color-secondary)] to-white px-4 min-[375px]:px-6 py-3 min-[375px]:py-4">
          <div className="flex items-center gap-2.5 min-[375px]:gap-3">
            <div className="flex h-9 w-9 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
              <MessageSquare className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">메시지 남기기</p>
              <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">축하 메시지를 남겨주세요</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 min-[375px]:p-6">
          <div className="flex min-h-[180px] min-[375px]:min-h-[200px] flex-col items-center justify-center rounded-lg bg-[var(--color-secondary)]/50 p-4 min-[375px]:p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mb-3 min-[375px]:mb-4 flex h-12 w-12 min-[375px]:h-14 min-[375px]:w-14 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <PenLine className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 text-[var(--color-primary)]" />
            </motion.div>

            <p className="mb-2.5 min-[375px]:mb-3 text-xs min-[375px]:text-sm text-[var(--color-text)]">
              방명록은 Giscus로 운영됩니다
            </p>
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 min-[375px]:px-5 py-1.5 min-[375px]:py-2 text-xs min-[375px]:text-sm font-medium text-white transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-md"
            >
              Giscus
            </a>
            <p className="mt-3 min-[375px]:mt-4 text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">
              Giscus 설정을 완료하여 방명록을 활성화해주세요.
            </p>
          </div>
        </div>

        {/* Giscus Comment Widget */}
        {/*
          To enable Giscus comments:
          1. Go to https://giscus.app
          2. Configure your repository
          3. Add the script below with your settings

        <script
          src="https://giscus.app/client.js"
          data-repo={guestbook.repo}
          data-repo-id={guestbook.repoId}
          data-category={guestbook.category}
          data-category-id={guestbook.categoryId}
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="light"
          data-lang="ko"
          crossOrigin="anonymous"
          async
        />
        */}
      </motion.div>
    </Section>
  );
}
