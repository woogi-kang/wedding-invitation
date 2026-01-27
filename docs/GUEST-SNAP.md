# Guest Snap - 하객 사진/영상 업로드

하객들이 결혼식 사진과 영상을 직접 Synology NAS에 업로드할 수 있는 기능입니다.

## 기능 개요

- 하객이 이름을 입력하고 사진/영상을 업로드
- Synology NAS WebDAV를 통한 직접 업로드
- 오프라인 지원 (IndexedDB 큐)
- 파일 유효성 검사 (크기, 타입, 매직 바이트)
- 재시도 로직 및 진행률 표시
- 세션 기반 업로드 제한

## 사용자 흐름

1. **Guest Snap 버튼 클릭**: 메인 페이지에서 "사진 공유하기" 버튼 클릭
2. **이름 입력**: 한글 또는 영문 이름 입력 (2-20자)
3. **파일 선택**: 사진 또는 영상 파일 선택 (다중 선택 가능)
4. **업로드 진행**: 실시간 진행률 확인
5. **완료**: 업로드 완료 메시지 표시

## 지원 파일 형식

### 이미지
| 형식 | MIME 타입 | 최대 크기 |
|------|----------|----------|
| JPEG | image/jpeg | 50MB |
| PNG | image/png | 50MB |
| HEIC | image/heic | 50MB |
| WebP | image/webp | 50MB |

### 비디오
| 형식 | MIME 타입 | 최대 크기 |
|------|----------|----------|
| MP4 | video/mp4 | 200MB |
| MOV | video/quicktime | 200MB |
| WebM | video/webm | 200MB |

## 설정

### 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```bash
# Synology NAS 설정
SYNOLOGY_HOST=192.168.1.100          # NAS IP 또는 도메인
SYNOLOGY_WEBDAV_PORT=5006            # WebDAV HTTPS 포트
SYNOLOGY_USERNAME=guest_upload        # WebDAV 전용 사용자
SYNOLOGY_PASSWORD=secure_password     # 사용자 비밀번호
SYNOLOGY_BASE_PATH=/wedding-photos    # 업로드 기본 경로
```

### 상수 설정

`src/lib/constants.ts`에서 Guest Snap 옵션을 설정할 수 있습니다:

```typescript
guestSnap: {
  enabled: true,                    // 기능 활성화 여부
  maxFileSizeMB: 50,                // 이미지 최대 크기 (MB)
  maxVideoSizeMB: 200,              // 비디오 최대 크기 (MB)
  maxUploadsPerGuest: 20,           // 하객당 최대 업로드 수
  sessionDurationHours: 24,         // 세션 유효 시간
  allowedImageTypes: [
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/webp'
  ],
  allowedVideoTypes: [
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ],
}
```

## 아키텍처

### 컴포넌트 구조

```
src/
├── components/
│   └── sections/
│       └── GuestSnap.tsx           # 메인 컴포넌트
├── lib/
│   └── guestsnap/
│       ├── index.ts                # 모듈 진입점
│       ├── file-validator.ts       # 파일 유효성 검사
│       ├── queue-manager.ts        # IndexedDB 큐 관리
│       └── synology-client.ts      # NAS API 클라이언트
├── app/
│   └── api/
│       └── guestsnap/
│           ├── session/route.ts    # 세션 관리 API
│           └── upload/route.ts     # 파일 업로드 API
└── types/
    └── guestsnap.ts                # 타입 정의
```

### 데이터 흐름

```
[파일 선택] → [유효성 검사] → [IndexedDB 큐] → [업로드 API] → [Synology NAS]
                                      ↓
                               [오프라인 대기]
                                      ↓
                               [재시도 로직]
```

## API 엔드포인트

### POST /api/guestsnap/session

세션을 생성하거나 기존 세션을 조회합니다.

**Request:**
```json
{
  "guestName": "홍길동"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-v4",
  "guestName": "홍길동",
  "guestFolder": "/wedding-photos/guests/홍길동_abc123",
  "uploadCount": 0,
  "uploadLimit": 20,
  "expiresAt": "2025-01-28T15:00:00Z"
}
```

### POST /api/guestsnap/upload

파일을 업로드합니다.

**Request:** `multipart/form-data`
- `file`: 업로드할 파일
- `sessionId`: 세션 ID

**Response:**
```json
{
  "success": true,
  "fileId": "uuid-v4",
  "fileName": "photo_001.jpg",
  "uploadedAt": "2025-01-27T15:00:00Z"
}
```

## 오프라인 지원

Guest Snap은 IndexedDB를 사용하여 오프라인 업로드를 지원합니다:

1. **큐 저장**: 선택된 파일은 IndexedDB에 저장됩니다
2. **오프라인 감지**: `navigator.onLine` API로 연결 상태 모니터링
3. **자동 재시도**: 연결 복구 시 대기 중인 파일 자동 업로드
4. **탭 간 동기화**: BroadcastChannel로 여러 탭 간 상태 동기화

## 보안

### 파일 검증

1. **확장자 검사**: 허용된 확장자만 업로드 가능
2. **MIME 타입 검사**: Content-Type 헤더 검증
3. **매직 바이트 검사**: 파일 시그니처 검증으로 위장 파일 차단
4. **파일 크기 제한**: 설정된 최대 크기 초과 시 거부

### Rate Limiting

- 분당 최대 10회 업로드
- 게스트당 일일 최대 업로드 수 제한
- 세션 만료 시간 설정

### 입력 검증

- 이름: 한글/영문 2-20자
- 특수문자 제거 (파일 시스템 안전)
- XSS 방지를 위한 입력 정제

## 문제 해결

### 업로드 실패

**증상:** 파일 업로드가 계속 실패합니다.

**해결책:**
1. Synology NAS의 WebDAV 서비스가 활성화되어 있는지 확인
2. 환경 변수가 올바르게 설정되어 있는지 확인
3. 방화벽에서 WebDAV 포트(5006)가 열려 있는지 확인
4. NAS 사용자에게 해당 폴더 쓰기 권한이 있는지 확인

### 큰 파일 업로드 시 타임아웃

**증상:** 대용량 비디오 업로드 시 타임아웃 오류가 발생합니다.

**해결책:**
1. `next.config.ts`에서 API 타임아웃 설정 확인
2. 비디오 최대 크기 설정을 낮춤
3. Synology NAS의 WebDAV 타임아웃 설정 확인

### IndexedDB 오류

**증상:** "Database blocked" 오류가 발생합니다.

**해결책:**
1. 브라우저의 다른 탭을 모두 닫고 다시 시도
2. 브라우저 캐시 및 사이트 데이터 삭제
3. 시크릿/프라이빗 모드에서 테스트

## 테스트

### 단위 테스트 실행

```bash
# 모든 테스트 실행
npm run test

# 커버리지 포함
npm run test:coverage

# 특정 파일 테스트
npm run test -- file-validator
```

### 테스트 커버리지 목표

| 모듈 | 목표 | 현재 |
|------|------|------|
| file-validator.ts | 90%+ | 79% |
| queue-manager.ts | 80%+ | 92% |

## 추후 개선 사항

- [ ] 이미지 압축 (클라이언트 측)
- [ ] 썸네일 미리보기 생성
- [ ] 업로드 일시정지/재개
- [ ] 관리자 대시보드
- [ ] 업로드 통계 및 분석
