'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-background)] px-4 pt-16">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-rose-light)] opacity-30 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-botanical-light)] opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* 목업 이미지 placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mb-10 h-[320px] w-[200px] rounded-[2rem] border border-[var(--color-border)] bg-white shadow-2xl sm:h-[400px] sm:w-[240px]"
        >
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="h-8 w-8 rounded-full bg-[var(--color-rose-light)]" />
            <p className="text-xs text-[var(--color-text-muted)]">청첩장 미리보기</p>
            <div className="mt-2 space-y-2">
              <div className="mx-auto h-2 w-24 rounded bg-[var(--color-border-light)]" />
              <div className="mx-auto h-2 w-20 rounded bg-[var(--color-border-light)]" />
              <div className="mx-auto h-2 w-16 rounded bg-[var(--color-border-light)]" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-4 font-[var(--font-heading)] text-3xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl md:text-5xl"
        >
          우리만의 이야기를 담은,
          <br />
          <span className="text-[var(--color-primary)]">세상에 하나뿐인</span> 모바일 청첩장
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-8 text-base leading-relaxed text-[var(--color-text-light)] sm:text-lg"
        >
          18가지 섹션을 자유롭게 조합하고, RPG 게임으로 초대하세요
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <Link
            href="#pricing"
            className="w-full rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl sm:w-auto"
          >
            3분 만에 만들어보기
          </Link>
          <Link
            href="/demo"
            className="w-full rounded-full border border-[var(--color-border)] bg-white px-8 py-3.5 text-center text-sm font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-primary-light)] hover:bg-[var(--color-secondary)] sm:w-auto"
          >
            데모 체험하기
          </Link>
        </motion.div>

        {/* 신뢰 뱃지 - 초기에는 숨김 */}
        {/* <p className="mt-6 text-sm text-[var(--color-text-muted)]">1,000+ 커플이 선택</p> */}
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-[var(--color-text-muted)] p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
