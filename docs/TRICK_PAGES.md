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

### 2. 3D Journey (`/invitation/3d`)

Three.js 기반 스크롤 드리븐 3D 경험

**컨셉: Git History as Love Story**
```
git init love-story     → 첫 만남
git commit -m "..."     → 함께한 시간들
git merge life/together → 두 삶이 하나로
git tag v1.0.0-release  → 결혼식
```

**씬 구성:**
1. `Scene1_GitInit` - 첫 만남 (git init)
2. `Scene2_CommitHistory` - 커밋 히스토리 타임라인
3. `Scene3_Merge` - 두 브랜치 머지
4. `Scene4_Release` - 결혼식 정보 (v1.0.0 배포)
5. `Scene5_Closing` - 감사 메시지

**기술 스택:**
- React Three Fiber
- @react-three/drei (ScrollControls, Text, Float, Stars, Line)
- @react-three/postprocessing (Bloom, ChromaticAberration, Vignette)
- Framer Motion

## 라우팅 로직

`useTrickRouter` 훅이 테마 선택을 관리:

```typescript
// 시간 기반 선택
- 밤 (20:00~06:00): Glitch 80% 우선
- 낮 (06:00~20:00): 3D 80% 우선

// 번갈아 표시
- localStorage에 마지막 테마 저장
- 다음 방문 시 다른 테마로 라우팅

// WebGL 미지원 시
- 자동으로 Glitch 버전으로 fallback
```

## 파일 구조

```
src/
├── app/invitation/
│   ├── layout.tsx              # Easter Egg 감지 래퍼
│   ├── glitch/page.tsx         # Glitch 페이지
│   └── 3d/page.tsx             # 3D Journey 페이지
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
│   ├── 3d/
│   │   ├── Scene.tsx           # 기본 3D 씬 (레거시)
│   │   ├── ParticleField.tsx   # 파티클 시스템
│   │   ├── FloatingObject.tsx  # 떠다니는 오브젝트
│   │   ├── DevWorkspace.tsx    # 개발자 작업공간
│   │   └── index.ts
│   └── 3d-journey/
│       ├── JourneyScene.tsx    # 스크롤 드리븐 3D 씬
│       └── index.ts
├── hooks/
│   ├── useKonamiCode.ts        # Konami/dev 감지
│   └── useTrickRouter.ts       # 테마 라우팅
└── lib/
    └── trick-content.ts        # 컨텐츠 변환 유틸리티
```

## 설치된 패키지

```json
{
  "three": "^0.176.0",
  "@react-three/fiber": "^9.1.2",
  "@react-three/drei": "^10.0.6",
  "@react-three/postprocessing": "^3.0.4",
  "postprocessing": "^6.36.7"
}
```

## 향후 개선 계획

### 3D 페이지 업그레이드 옵션

현재 3D 페이지는 기본적인 수준입니다. 더 인상적인 경험을 위해 다음 오픈소스 프로젝트 클론을 고려:

#### Option A: JS Mastery 3D Portfolio (추천)
- **GitHub:** https://github.com/adrianhajdin/threejs-portfolio
- **Live Demo:** https://threejscc-portfolio.vercel.app/
- **특징:** 3D Hacker Room, Globe, Timeline 애니메이션
- **웨딩 적용:** Hacker Room → Wedding Room으로 변환

#### Option B: Bruno Simon Course Projects
- **GitHub:** https://github.com/pmndrs/threejs-journey
- **특징:** Portal Scene, Galaxy Generator 등 고퀄리티 씬들
- **웨딩 적용:** Portal을 통해 다른 씬으로 이동

#### Option C: Next.js 3D Portfolio
- **GitHub:** https://github.com/Shivam-Sharma-1/3D-Portfolio
- **특징:** Next.js 기반, 3D Earth 모델
- **웨딩 적용:** Earth에 예식장 위치 표시

## 참고 자료

- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [drei Docs](https://github.com/pmndrs/drei)
- [Best Three.js Portfolios 2025](https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025)
