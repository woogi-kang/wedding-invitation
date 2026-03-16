# Guest Snap - 하객 사진/영상 업로드

하객들이 결혼식 사진과 영상을 Google Drive로 업로드할 수 있는 기능입니다.

## 기능 개요

- 하객이 이름 입력 후 사진/영상 업로드
- Google Drive API 기반 서버 업로드
- 오프라인 지원 (IndexedDB 큐)
- 파일 유효성 검사 (확장자, MIME, 매직 바이트, 크기)
- 재시도 로직 및 진행률 표시
- 세션 기반 업로드 제한
- 업로드 묶음(batch) 단위 Discord 알림

## 업로드 폴더 설계

Guest Snap은 아래 구조로 폴더를 자동 생성합니다.

```text
{GOOGLE_DRIVE_ROOT_FOLDER_ID}/
└── {guestName[_n]}/                  # 중복 이름은 _2, _3 ...
    ├── IMG_001_<ts>.jpg
    ├── IMG_001_<ts>.heic
    └── VID_001_<ts>.mp4
```

### 설계 의도

- 하객명 1-depth 배치: 폴더 진입 단계를 최소화해 접근 단순화
- 이름 중복 자동 처리: 같은 이름 하객 충돌 방지
- 파일명 규칙 표준화: `IMG`/`VID` prefix로 미디어 타입 즉시 식별

## 사용자 흐름

1. Guest Snap 버튼 클릭
2. 이름 입력 (2-20자)
3. 사진/영상 선택
4. 업로드 진행
5. 완료 메시지 표시

## 환경 변수

`.env.local`에 아래 값을 설정합니다.

```bash
# 선택: 업로드 알림 Discord Webhook
GUEST_SNAP_DISCORD_WEBHOOK_URL=

# 인증 방식 명시
# auto | oauth | service_account
GOOGLE_DRIVE_AUTH_MODE=auto

# 권장(내 드라이브): OAuth 사용자 토큰
GOOGLE_DRIVE_OAUTH_CLIENT_ID=
GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=
GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=

# 권장(배포/Vercel): 서비스 계정 JSON Base64
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64=

# 권장(로컬): 서비스 계정 JSON 파일 경로
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH=/absolute/path/to/guestsnap-service-account.json

# 대안: JSON 문자열 직접 저장
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON=

# 레거시 대안(호환용): client email + private key 분리 입력
GOOGLE_DRIVE_CLIENT_EMAIL=
GOOGLE_DRIVE_PRIVATE_KEY=

GOOGLE_DRIVE_ROOT_FOLDER_ID=your_google_drive_root_folder_id
GOOGLE_DRIVE_SHARED_DRIVE_ID=   # Shared Drive 사용 시 선택
```

### 배포 권장안

- Vercel 배포는 `Shared Drive` 루트 폴더 + `GOOGLE_DRIVE_AUTH_MODE=service_account` 조합을 권장
- 서비스 계정 JSON은 `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64`로 저장
- 기존 OAuth 값은 남겨두지 말고 제거해서 인증 경로가 흔들리지 않게 유지
- 배포 후 `/api/guestsnap/status`에서 `storageAvailable: true`와 `storageErrorCode`를 확인
- `My Drive` 루트 폴더에서는 서비스 계정 업로드가 quota 문제로 실패하므로 OAuth를 사용하거나 Shared Drive로 이동

### 권한 설정

1. OAuth 방식이면 본인 계정에 루트 폴더 생성 후 `GOOGLE_DRIVE_ROOT_FOLDER_ID`만 설정
2. 서비스 계정 방식이면 `Shared Drive` 루트 폴더를 서비스 계정 이메일에 편집자 권한으로 공유
3. Shared Drive를 쓰는 경우 서비스 계정을 해당 Drive 멤버로 추가

## 주요 코드 위치

```text
src/
├── lib/guestsnap/
│   ├── file-validator.ts       # 파일/입력 검증
│   ├── queue-manager.ts        # IndexedDB 큐
│   ├── google-drive-client.ts  # Google Drive 클라이언트
│   ├── discord-notifier.ts     # Discord 웹훅 알림
│   ├── qr-code.ts              # GuestSnap QR 생성 유틸
│   └── index.ts                # 서버 유틸 export
├── app/api/guestsnap/
│   ├── session/route.ts        # 세션 생성 + 게스트 폴더 생성
│   ├── upload/route.ts         # 파일 업로드
│   ├── notify/route.ts         # 업로드 완료 묶음 알림
│   └── status/route.ts         # 저장소 상태 확인
├── app/guestsnap/page.tsx      # GuestSnap 전용 업로드 페이지
├── app/guestsnap/poster/page.tsx # 인쇄용 QR 포스터 페이지
└── types/guestsnap.ts          # 타입 정의
```

## 데이터 흐름

```text
[파일 선택]
  -> [서버 검증]
  -> [IndexedDB 큐]
  -> [업로드 API]
  -> [Google Drive]
```

## API 요약

### `POST /api/guestsnap/session`

- 입력: `guestName`
- 동작: 이름 검증 -> Google Drive 게스트 폴더 생성 -> 세션 쿠키 발급
- 응답의 `guestFolder` 값은 **Google Drive 폴더 ID**입니다.

### `POST /api/guestsnap/upload`

- 입력: `multipart/form-data` (`file`)
- 동작: 세션 검증 -> 업로드 제한 확인 -> 파일 검증 -> Google Drive 업로드

### `POST /api/guestsnap/notify`

- 입력: `uploadedCount`, `failedCount`, `totalCount`
- 동작: 업로드 완료 시점에 **1회만** Discord 웹훅 알림 전송
- 포함 정보: 하객 이름, 요청 파일 수, 성공/실패 요약

### `GET /api/guestsnap/status`

- 동작: 기능 활성화 여부 + Google Drive 접근 가능 여부 반환

## 전용 페이지

- 업로드 전용: `/guestsnap`
- 인쇄용 포스터: `/guestsnap/poster`

## UI 개편 문서

- `docs/GUEST-SNAP-UI-REFRESH.md`: 결혼식 전 GuestSnap 업로드 페이지 UI 개편안 / 와이어프레임
- `docs/GUEST-SNAP-DEPLOY-CHECKLIST.md`: Vercel 배포 / 환경변수 / 운영 체크리스트

## 문제 해결

### 업로드 실패

- 서비스 계정 이메일/키/폴더 ID 환경변수 확인
- 서비스 계정이 루트 폴더에 편집 권한이 있는지 확인
- Shared Drive 사용 시 `GOOGLE_DRIVE_SHARED_DRIVE_ID` 및 멤버 권한 확인

### 세션은 생성되는데 업로드만 실패

- 루트 폴더 하위 생성 권한은 있으나 파일 쓰기 권한이 부족한 상태인지 확인
- Google Cloud 프로젝트에서 Drive API 활성화 여부 확인

### 상태 API가 `storageAvailable: false`

- `GOOGLE_DRIVE_ROOT_FOLDER_ID` 오타/이동/휴지통 여부 확인
- 서비스 계정 권한 재확인
