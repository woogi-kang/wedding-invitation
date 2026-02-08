# Trick Pages - Developer Easter Egg

개발자 손님들을 위한 숨겨진 Easter Egg 페이지들입니다.

## 접근 방법

일반 청첩장 페이지(`/invitation`)에서 다음 방법으로 접근 가능:

| 방법 | 설명 |
|-----|-----|
| **Konami Code** | ↑↑↓↓←→←→BA 입력 |
| **"dev" 타이핑** | 키보드로 "dev" 입력 |
| **Triple Tap** | 모바일에서 3번 연속 탭 |

## 페이지 구성

### 1. Glitch Cyberpunk (`/invitation/glitch`)

CRT 모니터 + Matrix 스타일의 사이버펑크 테마

**컴포넌트:**
- `MatrixRain` - 캔버스 기반 Matrix 코드 비 효과
- `CRTOverlay` - CRT 스캔라인, 플리커, 비네트 효과
- `GlitchText` - RGB 분리 글리치 텍스트
- `TypingGlitch` - 터미널 타이핑 애니메이션

**특징:**
- 부팅 시퀀스 애니메이션
- 터미널 스타일 UI
- `prefers-reduced-motion` 지원

### 2. Arcade (`/invitation/arcade`)

레트로 아케이드 게임 스타일의 인터랙티브 테마

## 라우팅 로직

`useTrickRouter` 훅이 테마 선택을 관리:

```typescript
// 시간 기반 선택
- 밤 (20:00~06:00): Glitch 60%, Arcade 40%
- 낮 (06:00~20:00): Arcade 55%, Glitch 45%

// 번갈아 표시
- localStorage에 마지막 테마 저장
- 다음 방문 시 다른 테마로 라우팅
```

## 파일 구조

```
src/
├── app/invitation/
│   ├── layout.tsx              # Easter Egg 감지 래퍼
│   ├── glitch/page.tsx         # Glitch 페이지
│   └── arcade/page.tsx         # Arcade 페이지
├── components/trick/
│   ├── glitch/
│   │   ├── MatrixRain.tsx      # Matrix 비 효과
│   │   ├── CRTOverlay.tsx      # CRT 모니터 효과
│   │   ├── GlitchText.tsx      # 글리치 텍스트
│   │   ├── GlitchHero.tsx      # 히어로 섹션
│   │   ├── GlitchTimeline.tsx  # 타임라인 섹션
│   │   ├── GlitchGallery.tsx   # 갤러리 섹션
│   │   ├── GlitchLocation.tsx  # 위치 섹션
│   │   ├── GlitchAccount.tsx   # 계좌 섹션
│   │   └── index.ts
│   ├── arcade/                 # Arcade 게임 컴포넌트
│   └── shared/                 # 공유 컴포넌트
├── hooks/
│   ├── useKonamiCode.ts        # Konami/dev 감지
│   └── useTrickRouter.ts       # 테마 라우팅
└── lib/
    └── trick-content.ts        # 컨텐츠 변환 유틸리티
```

## 참고 자료

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
