# GuestSnap 기능 구현 현황

> 마지막 업데이트: 2026-01-31

## 구현 상태 요약

| 구분 | 상태 | 비고 |
|------|------|------|
| 프론트엔드 UI | ✅ 완료 | Sample 8 미니멀 스타일 |
| GuestSnapDialog | ✅ 완료 | 폴라로이드 스타일, 결혼식 후 표시 |
| API 라우트 | ✅ 완료 | session, upload, status |
| Synology 클라이언트 | ✅ 완료 | 인증, 폴더 생성, 업로드 |
| 파일 검증 | ✅ 완료 | 클라이언트+서버, 매직바이트 |
| 환경변수 설정 | ⚠️ 필요 | .env.local 설정 필요 |

---

## TODO 체크리스트

### 1. 환경변수 설정 (필수)

`.env.local` 파일에 다음 환경변수 추가:

```env
# Synology NAS 설정
SYNOLOGY_HOST=https://your-nas-ip-or-domain
SYNOLOGY_PORT=5001
SYNOLOGY_USERNAME=admin
SYNOLOGY_PASSWORD=your-password
SYNOLOGY_SHARED_FOLDER=GuestSnap
```

- [ ] Synology NAS IP/도메인 확인
- [ ] HTTPS 포트 확인 (기본 5001)
- [ ] 관리자 계정 정보 확인
- [ ] GuestSnap 공유 폴더 생성

### 2. Synology NAS 설정

- [ ] 공유 폴더 `GuestSnap` 생성
- [ ] 업로드 계정에 쓰기 권한 부여
- [ ] HTTPS 활성화 (권장)
- [ ] 외부 접근 시 포트 포워딩 설정

### 3. 테스트 항목

- [ ] 세션 생성 테스트 (`/api/guestsnap/session`)
- [ ] 파일 업로드 테스트 (`/api/guestsnap/upload`)
- [ ] NAS 상태 확인 테스트 (`/api/guestsnap/status`)
- [ ] 대용량 파일 업로드 테스트 (영상 500MB)
- [ ] 동시 업로드 테스트 (3개 병렬)
- [ ] 재시도 로직 테스트

### 4. 결혼식 당일 준비

- [ ] NAS 저장 공간 확인
- [ ] 네트워크 안정성 확인
- [ ] 백업 계획 수립

---

## 파일 구조

```
src/
├── app/api/guestsnap/
│   ├── session/route.ts    # 세션 생성/조회
│   ├── upload/route.ts     # 파일 업로드
│   └── status/route.ts     # NAS 상태 확인
├── components/
│   ├── guestsnap/
│   │   ├── GuestNameModal.tsx
│   │   └── UploadModal.tsx
│   ├── sections/
│   │   └── GuestSnap.tsx   # 메인 섹션 (Sample 8)
│   └── ui/
│       └── GuestSnapDialog.tsx  # 폴라로이드 다이얼로그
├── hooks/
│   └── useGuestSnapUpload.ts
├── lib/guestsnap/
│   ├── synology-client.ts  # Synology API 클라이언트
│   ├── file-validator.ts   # 파일 검증
│   └── queue-manager.ts    # 업로드 큐 관리
└── types/
    └── guestsnap.ts        # 타입 정의
```

---

## 업로드 플로우

```
1. 사용자 진입
   ├─ 결혼식 시작 전 → RSVPDialog 표시
   └─ 결혼식 시작 후 → GuestSnapDialog 표시 (폴라로이드)

2. GuestSnapDialog
   └─ "사진/비디오 업로드하기" 클릭
      └─ GuestSnap 섹션으로 스크롤

3. GuestSnap 섹션
   └─ "SHARE PHOTOS" 클릭
      └─ GuestNameModal (이름 입력)
         └─ UploadModal (파일 선택/업로드)
            └─ Synology NAS 저장
```

---

## 파일 제한

| 항목 | 제한 |
|------|------|
| 이미지 최대 크기 | 30MB |
| 영상 최대 크기 | 500MB |
| 세션당 최대 파일 수 | 50개 |
| 동시 업로드 수 | 3개 |
| 지원 이미지 | .jpg, .jpeg, .png, .heic, .webp |
| 지원 영상 | .mp4, .mov |

---

## 보안 기능

- [x] 파일 확장자 검증
- [x] MIME 타입 검증
- [x] 매직 바이트 검증 (서버)
- [x] Rate limiting (IP 기반)
- [x] HttpOnly/Secure 쿠키
- [x] 위험 확장자 블락 (.exe, .bat 등)

---

## 폴더 구조 (Synology NAS)

```
/GuestSnap/
└── 2026-04-05/              # 결혼 날짜
    ├── 홍길동/               # 게스트 이름
    │   ├── IMG_001_1704067600000.jpg
    │   └── VID_001_1704067640000.mp4
    └── 김선경/
        └── ...
```

---

## 참고 사항

- 개발 환경에서 GuestSnap 섹션의 "Dialog 테스트" 버튼으로 다이얼로그 미리보기 가능
- 결혼식 시작 시간: 2026-04-05 14:10 KST
- 시작 전: RSVPDialog, 시작 후: GuestSnapDialog
