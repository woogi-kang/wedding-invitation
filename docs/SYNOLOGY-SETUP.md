# Synology NAS 설정 가이드 (Guest Snap 기능용)

Guest Snap 기능을 사용하여 결혼식 하객들이 촬영한 사진을 Synology NAS에 직접 업로드할 수 있습니다. 이 문서는 해당 기능을 위한 Synology NAS 설정 방법을 안내합니다.

---

## 1. 사전 요구사항

### 하드웨어 및 소프트웨어

- **Synology DSM 7.x** 이상 설치된 NAS
- **File Station** 패키지 설치됨
- **외부 접근** 설정 완료 (QuickConnect 또는 DDNS)
- 안정적인 인터넷 연결 (업로드 대역폭 최소 10Mbps 권장)

### 네트워크 요구사항

- 공유기에서 포트 포워딩 가능
- 고정 IP 또는 DDNS 서비스 사용 가능
- HTTPS 연결을 위한 SSL 인증서 (권장)

---

## 2. 필수 환경 변수

프로젝트의 `.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```bash
# Synology NAS 연결 정보
SYNOLOGY_HOST=your-nas.synology.me    # NAS 호스트 주소 (QuickConnect ID 또는 DDNS 주소)
SYNOLOGY_PORT=5001                     # HTTPS 포트 (기본값: 5001)
SYNOLOGY_USERNAME=guestsnap_user       # API 접근용 사용자명
SYNOLOGY_PASSWORD=your_secure_password # API 접근용 비밀번호
SYNOLOGY_SHARED_FOLDER=GuestSnap       # 공유 폴더 이름
```

> **주의**: `.env.local` 파일은 절대로 Git에 커밋하지 마세요. `.gitignore`에 포함되어 있는지 확인하세요.

---

## 3. 단계별 설정 가이드

### 3.1 전용 사용자 계정 생성

Guest Snap 기능 전용 사용자 계정을 생성합니다. **관리자 계정을 사용하지 마세요.**

1. **제어판** > **사용자 및 그룹** > **사용자** 탭으로 이동
2. **생성** 버튼 클릭
3. 다음 정보 입력:
   - **이름**: `guestsnap_user` (또는 원하는 이름)
   - **설명**: Guest Snap API 전용 계정
   - **이메일**: (선택사항)
   - **비밀번호**: 강력한 비밀번호 설정 (최소 12자, 대소문자+숫자+특수문자 조합)
4. **그룹 할당**: `users` 그룹만 선택 (관리자 그룹 제외)
5. **공유 폴더 권한**: 나중에 GuestSnap 폴더만 읽기/쓰기 권한 부여
6. **애플리케이션 권한**:
   - **File Station**: 허용
   - 그 외 모든 애플리케이션: 거부
7. **사용자 속도 제한**: 필요시 설정 (선택사항)
8. **확인**을 클릭하여 사용자 생성 완료

### 3.2 공유 폴더 생성

Guest Snap 전용 공유 폴더를 생성합니다.

1. **제어판** > **공유 폴더**로 이동
2. **생성** > **공유 폴더 생성** 클릭
3. 다음 정보 입력:
   - **이름**: `GuestSnap`
   - **설명**: 결혼식 하객 사진 저장소
   - **위치**: 원하는 볼륨 선택 (예: Volume 1)
4. **휴지통 활성화**: 권장 (실수로 삭제된 파일 복구 가능)
5. **데이터 체크섬 활성화**: 권장 (데이터 무결성 보장)
6. **다음**을 클릭하여 암호화 설정 (선택사항)
7. **권한 설정** 단계에서:
   - `guestsnap_user`: **읽기/쓰기** 권한 부여
   - `admin`: **읽기/쓰기** 권한 유지
   - 그 외 사용자: **접근 없음**
8. **적용**을 클릭하여 완료

### 3.3 File Station API 활성화

외부에서 File Station API에 접근할 수 있도록 설정합니다.

1. **제어판** > **애플리케이션 포털** > **애플리케이션** 탭으로 이동
2. **File Station** 선택 후 **편집** 클릭
3. **일반** 탭에서:
   - **HTTP 포트**: 7000 (또는 원하는 포트)
   - **HTTPS 포트**: 7001 (또는 원하는 포트)
4. **적용** 클릭

또는 DSM 기본 포트를 사용할 수 있습니다:
- HTTP: 5000
- HTTPS: 5001 (권장)

### 3.4 외부 접근 설정

#### 옵션 A: QuickConnect 사용 (권장 - 간편함)

1. **제어판** > **외부 액세스** > **QuickConnect** 탭으로 이동
2. **QuickConnect 활성화** 체크
3. **Synology 계정**: Synology 계정으로 로그인
4. **QuickConnect ID** 설정 (예: `mywedding2024`)
5. **고급 설정**에서:
   - **파일 서비스**: 활성화
6. **적용** 클릭

QuickConnect URL: `https://QuickConnectID.quickconnect.to`

#### 옵션 B: DDNS + SSL 인증서 사용 (권장 - 빠른 속도)

1. **제어판** > **외부 액세스** > **DDNS** 탭으로 이동
2. **추가** 클릭
3. **서비스 제공자**: Synology 선택 (또는 다른 DDNS 서비스)
4. **호스트 이름**: 원하는 도메인 입력 (예: `mywedding.synology.me`)
5. **외부 주소**: 자동으로 감지되거나 직접 입력
6. **적용** 클릭

**SSL 인증서 설정**:

1. **제어판** > **보안** > **인증서** 탭으로 이동
2. **추가** > **새 인증서 추가** 클릭
3. **Let's Encrypt에서 인증서 받기** 선택
4. **도메인 이름**: DDNS에서 설정한 도메인 입력
5. **적용** 클릭
6. 새 인증서를 선택하고 **구성** 클릭하여 서비스에 할당

#### 포트 포워딩 설정 (DDNS 사용 시 필수)

공유기에서 다음 포트를 NAS로 포워딩해야 합니다:

| 서비스 | 외부 포트 | 내부 포트 | 프로토콜 |
|--------|-----------|-----------|----------|
| DSM HTTPS | 5001 | 5001 | TCP |
| File Station HTTPS | 7001 | 7001 | TCP (사용시) |

> **보안 팁**: HTTP 포트(5000, 7000)는 외부에 노출하지 마세요. HTTPS만 사용하세요.

### 3.5 연결 테스트

설정이 완료되면 API 연결을 테스트합니다.

#### API 로그인 테스트

```bash
# QuickConnect 사용 시
curl -k "https://your-quickconnect-id.quickconnect.to:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=guestsnap_user&passwd=your_password&session=FileStation&format=cookie"

# DDNS 사용 시
curl -k "https://your-nas.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=guestsnap_user&passwd=your_password&session=FileStation&format=cookie"
```

#### 성공 응답 예시

```json
{
  "data": {
    "is_portal_port": false,
    "sid": "xxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "success": true
}
```

#### 폴더 목록 테스트 (sid 값 사용)

```bash
curl -k "https://your-nas.synology.me:5001/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list&folder_path=/GuestSnap&_sid=YOUR_SID_HERE"
```

#### 성공 응답 예시

```json
{
  "data": {
    "files": [],
    "offset": 0,
    "total": 0
  },
  "success": true
}
```

---

## 4. 보안 권장사항

### 필수 보안 설정

1. **HTTPS만 사용**
   - HTTP 접근을 비활성화하거나 HTTPS로 리다이렉트 설정
   - 제어판 > 로그인 포털 > DSM > "HTTP 연결을 HTTPS로 자동 리다이렉션" 활성화

2. **전용 사용자 계정 사용**
   - 관리자 계정을 API 접근에 사용하지 마세요
   - 최소 권한 원칙 적용 (GuestSnap 폴더만 접근 가능)

3. **관리자 계정 2FA 활성화**
   - 제어판 > 보안 > 계정 > 2단계 인증 강제
   - API 사용자에게는 2FA를 적용하지 않아야 API 호출이 가능합니다

4. **정기적인 비밀번호 변경**
   - 결혼식 전후로 비밀번호 변경 권장
   - 결혼식 이후 계정 비활성화 고려

5. **접근 로그 모니터링**
   - 로그 센터 > 로그 > 연결에서 접근 기록 확인
   - 비정상적인 접근 시도 모니터링

### 추가 보안 설정 (선택사항)

1. **IP 차단 정책**
   - 제어판 > 보안 > 보호 > 자동 차단 활성화
   - 5분 내 5회 로그인 실패 시 IP 차단 설정

2. **방화벽 규칙**
   - 제어판 > 보안 > 방화벽
   - 특정 국가/지역만 접근 허용 (한국만 허용 등)

3. **계정 보호**
   - 제어판 > 보안 > 계정
   - 비밀번호 정책 강화 설정

---

## 5. 폴더 구조

Guest Snap 기능은 다음과 같은 폴더 구조로 파일을 저장합니다:

```
/volume1/GuestSnap/
  └── {wedding-date}/              # 결혼식 날짜 (예: 2024-05-15)
      └── {timestamp}_{guest-name}/   # 업로드 시간_하객 이름
          └── {original-filename}     # 원본 파일명 또는 UUID
```

### 폴더 구조 예시

```
/volume1/GuestSnap/
  └── 2024-05-15/
      ├── 1715756400_김철수/
      │   ├── IMG_0001.jpg
      │   ├── IMG_0002.jpg
      │   └── IMG_0003.jpg
      ├── 1715756500_이영희/
      │   └── photo_2024.heic
      └── 1715756600_박지민/
          ├── wedding_01.png
          └── wedding_02.png
```

### 저장 용량 추정

| 사진 품질 | 평균 파일 크기 | 100명 x 5장 | 200명 x 5장 |
|-----------|----------------|-------------|-------------|
| 고화질 (HEIC/JPEG) | 3-5 MB | 1.5-2.5 GB | 3-5 GB |
| 원본 (RAW/고해상도) | 10-20 MB | 5-10 GB | 10-20 GB |

> **권장**: 최소 50GB 이상의 여유 공간 확보

---

## 6. 문제 해결

### 연결 거부 (Connection Refused)

**증상**: `curl: (7) Failed to connect to ... port 5001: Connection refused`

**해결 방법**:
1. NAS가 켜져 있고 네트워크에 연결되어 있는지 확인
2. DSM 설정에서 HTTPS가 활성화되어 있는지 확인
3. 공유기 포트 포워딩 설정 확인 (5001 포트)
4. NAS 방화벽에서 해당 포트가 차단되지 않았는지 확인
5. ISP에서 5001 포트를 차단하는지 확인 (다른 포트 사용 시도)

### 인증 실패 (Authentication Failed)

**증상**: `{"success":false,"error":{"code":400}}`

**해결 방법**:
1. 사용자명과 비밀번호가 정확한지 확인
2. 계정이 비활성화되지 않았는지 확인
3. 계정에 File Station 접근 권한이 있는지 확인
4. 2FA가 활성화되어 있다면 API 사용자에게는 비활성화
5. 특수문자가 포함된 비밀번호는 URL 인코딩 필요

**에러 코드 참조**:
| 코드 | 설명 |
|------|------|
| 400 | 잘못된 사용자명 또는 비밀번호 |
| 401 | 계정 비활성화됨 |
| 402 | 권한 거부됨 |
| 403 | 2단계 인증 필요 |
| 404 | 2단계 인증 실패 |

### 권한 거부 (Permission Denied)

**증상**: `{"success":false,"error":{"code":119}}`

**해결 방법**:
1. 공유 폴더에 대한 사용자 권한 확인 (읽기/쓰기)
2. 폴더 경로가 정확한지 확인 (`/GuestSnap` 또는 `/volume1/GuestSnap`)
3. 사용자에게 File Station 애플리케이션 권한이 있는지 확인
4. 공유 폴더의 하위 폴더 권한도 확인

### 저장 공간 부족 (Storage Full)

**증상**: 업로드 실패, 디스크 공간 오류

**해결 방법**:
1. 저장소 관리자에서 볼륨 사용량 확인
2. 불필요한 파일 정리 또는 휴지통 비우기
3. 볼륨 확장 또는 추가 디스크 설치 고려
4. 다른 볼륨으로 공유 폴더 이동

### SSL 인증서 오류

**증상**: `SSL certificate problem: unable to get local issuer certificate`

**해결 방법**:
1. Let's Encrypt 인증서 갱신 확인
2. 인증서가 서비스에 올바르게 할당되었는지 확인
3. 자체 서명 인증서 사용 시 클라이언트에서 허용 설정 필요
4. curl 테스트 시 `-k` 옵션으로 인증서 검증 건너뛰기 (테스트 용도만)

### QuickConnect 연결 느림

**증상**: QuickConnect를 통한 연결이 매우 느림

**해결 방법**:
1. DDNS + 직접 연결로 전환 (더 빠름)
2. QuickConnect 릴레이 서비스 대신 직접 연결 사용
3. 제어판 > QuickConnect > 고급 > "직접 연결 허용" 활성화

---

## 7. 환경 변수 파일 예시

### `.env.local.example`

프로젝트에 다음 내용으로 `.env.local.example` 파일을 생성하세요:

```bash
# ================================================
# Synology NAS Configuration for Guest Snap
# ================================================
# 이 파일을 복사하여 .env.local 파일을 생성하세요
# cp .env.local.example .env.local
# 그런 다음 실제 값으로 수정하세요
# ================================================

# NAS 호스트 주소
# QuickConnect: your-id.quickconnect.to
# DDNS: your-nas.synology.me
# 직접 IP: 123.456.789.0 (권장하지 않음)
SYNOLOGY_HOST=your-nas.synology.me

# NAS HTTPS 포트 (기본값: 5001)
SYNOLOGY_PORT=5001

# Guest Snap 전용 사용자 (관리자 계정 사용 금지!)
SYNOLOGY_USERNAME=guestsnap_user

# 사용자 비밀번호 (강력한 비밀번호 사용)
SYNOLOGY_PASSWORD=your_secure_password_here

# 공유 폴더 이름 (NAS에서 생성한 폴더명)
SYNOLOGY_SHARED_FOLDER=GuestSnap

# ================================================
# 선택적 설정
# ================================================

# 결혼식 날짜 (폴더 구조에 사용)
# WEDDING_DATE=2024-05-15

# 최대 업로드 파일 크기 (MB)
# MAX_UPLOAD_SIZE=50

# 허용된 파일 형식
# ALLOWED_FILE_TYPES=jpg,jpeg,png,heic,heif,gif,webp
```

### `.gitignore` 확인

`.gitignore` 파일에 다음 항목이 포함되어 있는지 확인하세요:

```
# 환경 변수 파일
.env
.env.local
.env.*.local
```

---

## 8. API 참조

### 주요 API 엔드포인트

| API | 용도 |
|-----|------|
| SYNO.API.Auth | 로그인/로그아웃 |
| SYNO.FileStation.List | 폴더/파일 목록 조회 |
| SYNO.FileStation.CreateFolder | 폴더 생성 |
| SYNO.FileStation.Upload | 파일 업로드 |

### API 문서

- [Synology File Station API 공식 문서](https://global.synology.com/support/developer#tool)
- DSM 내 도움말에서 API 가이드 확인 가능

---

## 9. 체크리스트

설정 완료 후 다음 항목을 확인하세요:

- [ ] DSM 7.x 이상 설치됨
- [ ] File Station 패키지 설치됨
- [ ] 전용 사용자 계정 (`guestsnap_user`) 생성됨
- [ ] 공유 폴더 (`GuestSnap`) 생성됨
- [ ] 사용자에게 폴더 읽기/쓰기 권한 부여됨
- [ ] 사용자에게 File Station 접근 권한 부여됨
- [ ] 외부 접근 설정됨 (QuickConnect 또는 DDNS)
- [ ] HTTPS 포트(5001) 포트 포워딩됨 (DDNS 사용 시)
- [ ] SSL 인증서 설정됨 (권장)
- [ ] API 연결 테스트 성공
- [ ] `.env.local` 파일 생성 및 설정됨
- [ ] `.gitignore`에 `.env.local` 포함됨
- [ ] 관리자 계정에 2FA 활성화됨
- [ ] 저장 공간 충분히 확보됨 (50GB+)

---

## 10. 지원 및 문의

문제가 지속되면 다음을 참고하세요:

- [Synology 공식 지원](https://www.synology.com/support)
- [Synology 커뮤니티 포럼](https://community.synology.com/)
- [DSM 도움말 센터](https://kb.synology.com/)

---

*최종 업데이트: 2025년 1월*
