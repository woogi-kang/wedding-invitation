# GuestSnap Deploy Checklist

Vercel 배포에서 `GuestSnap`이 안정적으로 동작하도록 점검하는 체크리스트입니다.

## 권장 구조

- 인증 방식은 `OAuth`보다 `service account`를 권장합니다.
- 단, `service account`는 반드시 `Shared Drive` 루트 폴더와 함께 사용합니다.
- 배포 환경에서는 `GOOGLE_DRIVE_AUTH_MODE=service_account`를 명시합니다.
- 서비스 계정 JSON은 `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64` 하나로 관리합니다.
- 사용하지 않는 `OAuth` 변수는 Vercel에서 제거합니다.

이유:

- OAuth refresh token은 `invalid_grant`로 깨질 수 있습니다.
- 서비스 계정은 `My Drive`에 업로드할 저장소 quota가 없어서 실제 업로드가 실패합니다.
- Base64 문자열은 Vercel 환경변수에 넣을 때 줄바꿈/이스케이프 문제를 줄입니다.
- `GOOGLE_DRIVE_AUTH_MODE=service_account`를 명시하면 다른 인증값이 남아 있어도 잘못된 경로로 빠지지 않습니다.

## 1. Google Drive 준비

- GuestSnap 업로드용 루트 폴더를 `Shared Drive` 안에 1개 준비합니다.
- 폴더 URL에서 `GOOGLE_DRIVE_ROOT_FOLDER_ID` 값을 복사합니다.
- `My Drive` 폴더라면 `service account`를 쓰지 말고 OAuth로 운영하거나, 폴더를 `Shared Drive`로 옮깁니다.

## 2. 서비스 계정 준비

- Google Cloud에서 GuestSnap 전용 서비스 계정을 만듭니다.
- Drive API가 활성화되어 있는지 확인합니다.
- 서비스 계정 JSON 키를 1개 발급합니다.
- 루트 폴더를 서비스 계정 이메일에 `편집자` 권한으로 공유합니다.
- Shared Drive라면 해당 Drive 멤버로 서비스 계정을 추가합니다.

## 3. Base64 변환

macOS 기준:

```bash
base64 -i guestsnap-service-account.json | tr -d '\n'
```

출력된 한 줄 문자열을 `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64` 값으로 사용합니다.

## 4. Vercel 환경변수 설정

필수:

```bash
GOOGLE_DRIVE_AUTH_MODE=service_account
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64=...
GOOGLE_DRIVE_ROOT_FOLDER_ID=...
```

선택:

```bash
GOOGLE_DRIVE_SHARED_DRIVE_ID=...
GUEST_SNAP_DISCORD_WEBHOOK_URL=...
```

정리:

- `GOOGLE_DRIVE_OAUTH_CLIENT_ID` 삭제
- `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` 삭제
- `GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN` 삭제

권장 환경:

- `Production`
- `Preview`
- `Development`

## 5. 배포 전 점검

- `GOOGLE_DRIVE_AUTH_MODE`가 `service_account`인지 확인
- `GOOGLE_DRIVE_ROOT_FOLDER_ID`가 실제 폴더 ID인지 확인
- 서비스 계정이 해당 폴더를 열 수 있는지 확인
- Base64 값이 JSON 원본에서 새로 생성된 값인지 확인
- 오래된 OAuth 값이 남아 있지 않은지 확인

## 6. 배포 후 스모크 테스트

아래 순서로 확인합니다.

1. `GET /api/guestsnap/status`
2. `storageAvailable: true` 확인
3. 필요하면 `storageErrorCode` 확인
4. `/guestsnap`에서 이름 입력 후 Step 2 진입
5. 세션 생성이 되는지 확인
6. 작은 이미지 1장 업로드 테스트

예시:

```bash
curl -sS https://your-domain.vercel.app/api/guestsnap/status
```

정상 기대값:

```json
{
  "serviceEnabled": true,
  "storageAvailable": true,
  "configurationValid": true,
  "authMode": "service_account"
}
```

## 7. 장애 대응

### `storageErrorCode=drive_auth_invalid_grant`

- OAuth refresh token 문제가 원인입니다.
- 서비스 계정 방식으로 전환하거나 refresh token을 다시 발급해야 합니다.

### `storageErrorCode=missing_root_folder_id`

- 루트 폴더 ID가 비어 있거나 잘못되었습니다.

### `storageErrorCode=drive_root_inaccessible`

- 폴더가 삭제되었거나 서비스 계정 권한이 부족합니다.

### `storageErrorCode=missing_service_account_credentials`

- Base64 값 또는 JSON 경로/문자열이 비어 있습니다.

### `storageErrorCode=service_account_requires_shared_drive`

- 현재 루트 폴더가 `My Drive`에 있습니다.
- 서비스 계정 방식은 `Shared Drive` 루트 폴더로 바꾸거나, OAuth 방식으로 전환해야 합니다.

## 8. 운영 규칙

- GuestSnap 전용 Google Cloud 서비스 계정을 따로 유지합니다.
- 서비스 계정 JSON 원본은 Git에 올리지 않습니다.
- 환경변수 변경 전에는 기존 값을 안전한 비밀 저장소에 백업합니다.
- 인증 방식 전환 시 `auth mode`와 실제 값 세트를 동시에 바꿉니다.
- 배포 직후 `status` API를 항상 확인합니다.

## 9. 롤백 전략

- 새 값 적용 후 `status`가 실패하면 즉시 이전 Base64 값으로 되돌립니다.
- OAuth와 service account를 동시에 섞어서 복구하지 않습니다.
- `GOOGLE_DRIVE_AUTH_MODE`와 자격증명 세트는 항상 같은 방식으로 맞춥니다.
