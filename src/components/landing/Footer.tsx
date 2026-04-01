import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-secondary)] py-12 pb-28 md:pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* 브랜드 */}
          <div>
            <h3 className="mb-3 text-base font-bold text-[var(--color-text)]">WeddingCraft</h3>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              세상에 하나뿐인 모바일 청첩장.
              <br />
              당신의 특별한 날을 더 특별하게.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              서비스
            </h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">기능 소개</Link></li>
              <li><Link href="#pricing" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">가격</Link></li>
              <li><Link href="/demo" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">데모</Link></li>
              <li><Link href="/demo/arcade" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">아케이드 모드</Link></li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              고객지원
            </h4>
            <ul className="space-y-2">
              <li><Link href="#faq" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">자주 묻는 질문</Link></li>
              <li><a href="mailto:support@weddingcraft.kr" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">이메일 문의</a></li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              법적 고지
            </h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">이용약관</Link></li>
              <li><Link href="#" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)]">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border-light)] pt-6 text-center">
          <p className="text-[10px] text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} WeddingCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
