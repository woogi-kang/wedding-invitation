# SPEC-GUESTSNAP-001: Guest Snap Feature

## Metadata

| Field | Value |
|-------|-------|
| SPEC ID | SPEC-GUESTSNAP-001 |
| Title | Guest Snap - Wedding Photo/Video Upload Feature |
| Created | 2026-01-27 |
| Status | Planned |
| Priority | High |
| Lifecycle | spec-anchored |
| Tags | `frontend`, `backend`, `api`, `file-upload`, `synology`, `mobile-first` |

---

## 1. Overview

### 1.1 Problem Statement

Wedding guests often capture precious moments during ceremonies on their personal devices. Currently, there is no centralized way for guests to share these photos and videos with the couple. Cloud storage services like Firebase or Supabase have storage size limitations and ongoing costs that are impractical for handling potentially hundreds of high-resolution photos and videos.

### 1.2 Proposed Solution

Implement a "Guest Snap" (게스트스냅) feature that allows wedding guests to upload photos and videos directly to the couple's personal Synology NAS. This provides:
- Unlimited storage capacity (dependent on NAS hardware)
- No recurring cloud storage costs
- Full ownership and control of media files
- Privacy-first approach with data stored on personal hardware

### 1.3 User Stories

**As a wedding guest**, I want to upload photos and videos I captured during the ceremony so that the couple can have a complete collection of their special day from multiple perspectives.

**As the wedding couple**, I want to receive all guest photos and videos in an organized manner on my personal NAS so that I can easily access and preserve these memories without ongoing cloud storage costs.

---

## 2. Environment

### 2.1 Technical Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | Next.js | 16.1.1 |
| Runtime | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| NAS Backend | Synology DSM | 7.x |
| API | Synology File Station API | - |

### 2.2 Infrastructure

- **Client**: Mobile browsers (iOS Safari, Android Chrome) - Primary
- **Client**: Desktop browsers - Secondary
- **Server**: Next.js API Routes (Edge/Serverless)
- **Storage**: Synology NAS with File Station API enabled
- **Network**: HTTPS required for all communications

### 2.3 Integration Points

- Synology DSM WebAPI (File Station)
- QuickConnect or DDNS for external NAS access
- Next.js API Routes as proxy layer

---

## 3. Assumptions

### 3.1 Technical Assumptions

| ID | Assumption | Confidence | Risk if Wrong |
|----|------------|------------|---------------|
| A1 | Synology NAS is accessible via HTTPS (QuickConnect or DDNS) | High | Feature cannot function without external access |
| A2 | File Station API is enabled on DSM 7.x | High | Alternative API approach needed |
| A3 | NAS has sufficient storage (minimum 100GB free) | Medium | Upload failures when storage full |
| A4 | Mobile browsers support File API and FormData | High | Fallback UI needed for older browsers |
| A5 | Network bandwidth supports file uploads (minimum 5Mbps) | Medium | Longer upload times, potential timeouts |

### 3.2 Business Assumptions

| ID | Assumption | Confidence | Risk if Wrong |
|----|------------|------------|---------------|
| B1 | Guests will primarily use mobile devices | High | Desktop-first design needed |
| B2 | Average 30-50 guests will upload media | Medium | Rate limiting strategy may need adjustment |
| B3 | Most uploads will occur during/after ceremony | High | Need to handle burst traffic |
| B4 | Simple authentication (code-based) is acceptable | Medium | May need stronger auth for privacy-conscious users |

### 3.3 Validation Methods

- A1: Test QuickConnect/DDNS connectivity before deployment
- A2: Verify File Station API responses in staging environment
- A3: Implement storage monitoring and user notification
- B1: Analytics to track device types (post-launch)

---

## 4. Requirements

### 4.1 Functional Requirements

#### FR-001: Photo Upload (Ubiquitous)
The system shall support uploading of image files in JPEG, PNG, HEIC, and WebP formats.

#### FR-002: Video Upload (Ubiquitous)
The system shall support uploading of video files in MP4, MOV, and HEVC formats.

#### FR-003: File Size Limits (State-Driven)
**IF** the file is an image **THEN** the maximum file size shall be 30MB.
**IF** the file is a video **THEN** the maximum file size shall be 500MB.

#### FR-004: Upload Count Limit (State-Driven)
**IF** a guest has uploaded fewer than 50 files in the current session **THEN** the system shall allow additional uploads.
**IF** a guest has reached the 50-file limit **THEN** the system shall display a friendly limit message and prevent further uploads.

#### FR-004-1: Feature Activation Date (State-Driven)
**IF** current date is BEFORE the wedding date **THEN** the system shall:
1. Display the GuestSnap section normally (visible)
2. When user clicks "사진 공유하기" button, show message: "결혼식 당일부터 사진을 공유하실 수 있어요! 조금만 기다려주세요 :)"
3. NOT open the upload modal

**IF** current date is ON or AFTER the wedding date **THEN** the system shall allow full upload functionality.

**Note**: Once opened, the feature remains available indefinitely (guests can upload days/weeks after the wedding).

#### FR-005: Guest Identification (Event-Driven)
**WHEN** a guest accesses the upload page for the first time **THEN** the system shall:
1. Display a simple name input modal FIRST (before any file selection)
2. Request only the guest's name (Korean or English, 2-20 characters)
3. Create a dedicated folder with the guest's name on the NAS
4. Store the name in session for subsequent uploads

**Note**: No complex authentication - just name input for folder organization.

#### FR-006: Upload Progress (Event-Driven)
**WHEN** a file upload begins **THEN** the system shall display a progress indicator showing percentage completion.

#### FR-007: Upload Queue (Event-Driven)
**WHEN** multiple files are selected **THEN** the system shall add them to an upload queue and process them sequentially.

#### FR-008: Retry Mechanism (Event-Driven)
**WHEN** an upload fails due to network error **THEN** the system shall:
1. Automatically retry up to 3 times with exponential backoff (1s → 2s → 4s)
2. Show retry progress to user ("다시 시도하고 있어요... 2/3")
3. If all retries fail: mark file as "failed" (red indicator), continue other uploads
4. Provide manual "다시 시도" button for failed files
5. Never lose the file from queue until user dismisses it

#### FR-008-1: Manual Retry Without Re-selection (Event-Driven)
**WHEN** user clicks "다시 시도" button on a failed file **THEN** the system shall:
1. Immediately re-upload the failed file WITHOUT requiring re-selection
2. File data is preserved in IndexedDB queue until successful or manually dismissed
3. User does NOT need to:
   - Re-select the file from gallery
   - Re-enter their name
   - Start the upload process from scratch
4. Only the failed file(s) are retried, successful files are not affected

**Technical Implementation**:
- Failed files remain in IndexedDB with `status: 'failed'` and original `File` blob
- "다시 시도" button changes status to `pending` and re-queues the file
- "모두 다시 시도" button retries all failed files at once
- "삭제" button removes file from queue permanently

#### FR-009: Offline Handling (State-Driven)
**IF** the device loses network connectivity during upload **THEN** the system shall pause the queue and resume when connectivity is restored.

#### FR-010: File Organization by Guest Name (Ubiquitous)
The system shall organize uploaded files in the following NAS directory structure:
```
/volume1/GuestSnap/
  └── 2026-04-05/                    # 결혼식 날짜
      ├── 홍길동/                     # 게스트 이름 폴더
      │   ├── IMG_001_1706345600.jpg
      │   ├── IMG_002_1706345610.jpg
      │   └── VID_001_1706345620.mp4
      ├── 김철수/
      │   └── IMG_001_1706345700.jpg
      └── Jane_Smith/                # 영문 이름도 지원
          └── IMG_001_1706345800.jpg
```

**Folder Naming Rules**:
- Guest name is sanitized (special characters removed)
- Duplicate names: append number (홍길동, 홍길동_2, 홍길동_3)
- Files: {TYPE}_{SEQ}_{TIMESTAMP}.{EXT} format for uniqueness

### 4.2 Non-Functional Requirements

#### NFR-001: Performance
- Image upload completion: < 10 seconds for 10MB file on 5Mbps connection
- Video upload completion: < 60 seconds for 100MB file on 10Mbps connection
- UI response time: < 100ms for user interactions

#### NFR-002: Security
- All communications must use HTTPS/TLS 1.2+
- NAS credentials must never be exposed to client
- Rate limiting: Maximum 5 requests per second per guest
- Input sanitization for guest names and file names

#### NFR-003: Availability
- Upload service shall be available during ceremony hours (4 hours before to 8 hours after)
- Graceful degradation when NAS is unreachable

#### NFR-004: Usability
- Mobile-first responsive design
- Single-hand operation support
- Clear visual feedback for all actions
- Korean language interface

### 4.3 Unwanted Behaviors

#### UB-001: File Type Restriction
The system shall NOT accept executable files (.exe, .bat, .sh, .js, .php).

#### UB-002: Credential Exposure
The system shall NOT expose Synology NAS credentials or API tokens to the client.

#### UB-003: Unlimited Uploads
The system shall NOT allow unlimited uploads to prevent storage abuse.

#### UB-004: Anonymous Uploads
The system shall NOT allow completely anonymous uploads without any guest identifier.

### 4.4 Optional Requirements

#### OPT-001: Thumbnail Preview
Where possible, display thumbnail previews of selected files before upload.

#### OPT-002: Photo Compression
Where possible, offer optional image compression to reduce upload time.

#### OPT-003: Batch Delete
Where possible, allow guests to delete their own recently uploaded files.

---

## 5. Specifications

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Mobile/Desktop)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ GuestSnap   │  │ Upload      │  │ Upload Queue            │ │
│  │ Section     │  │ Modal       │  │ Manager (IndexedDB)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ /api/upload │  │ /api/auth   │  │ /api/status             │ │
│  │ - validate  │  │ - session   │  │ - storage info          │ │
│  │ - proxy     │  │ - guest ID  │  │ - upload count          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (Server-side only)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Synology NAS (DSM 7.x)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    File Station API                      │   │
│  │  - SYNO.FileStation.Upload                               │   │
│  │  - SYNO.API.Auth                                         │   │
│  │  - SYNO.FileStation.CreateFolder                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Storage Volume                        │   │
│  │  /volume1/GuestSnap/                                     │   │
│  │    └── 2026-04-05/          ← Wedding date               │   │
│  │        ├── 홍길동/           ← Guest name folder          │   │
│  │        ├── 김철수/                                        │   │
│  │        └── ...                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 API Design

#### 5.2.1 Upload Endpoint

```typescript
// POST /api/guestsnap/upload
interface UploadRequest {
  file: File;
  guestName: string;
  sessionId: string;
}

interface UploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  uploadedAt?: string;
  error?: {
    code: string;
    message: string;
  };
}
```

#### 5.2.2 Session Endpoint (Name Registration)

```typescript
// POST /api/guestsnap/session
interface SessionRequest {
  guestName: string;  // 게스트 이름 (2-20자, 한글/영문)
}

interface SessionResponse {
  success: boolean;
  sessionId: string;
  guestName: string;           // 정제된 이름
  guestFolder: string;         // NAS 폴더 경로 (e.g., "/GuestSnap/2026-04-05/홍길동")
  uploadCount: number;
  uploadLimit: number;
  expiresAt: string;
}

// Server-side actions:
// 1. Sanitize guest name
// 2. Check for duplicate names → append number if exists
// 3. Create folder on NAS: /GuestSnap/{weddingDate}/{guestName}/
// 4. Return session with folder path
```

#### 5.2.3 Status Endpoint

```typescript
// GET /api/guestsnap/status
interface StatusResponse {
  serviceEnabled: boolean;
  storageAvailable: boolean;
  currentUploads: number;
  maxConcurrentUploads: number;
}
```

### 5.3 Data Models

#### 5.3.1 Upload Configuration

```typescript
// src/lib/constants.ts (addition)
export const GUEST_SNAP_CONFIG = {
  enabled: true,

  // Upload limits
  limits: {
    maxFilesPerSession: 50,      // 최대 50장
    maxImageSizeMB: 30,          // 원본 화질 유지 (압축 없음)
    maxVideoSizeMB: 500,         // 영상 최대 500MB
    maxConcurrentUploads: 3,
  },

  // UI Messages (Korean) - 감사를 표하는 따뜻한 톤
  messages: {
    // 섹션 타이틀 & 설명
    sectionTitle: '게스트스냅',
    sectionSubtitle: '저희의 순간을 함께 담아주세요',
    uploadButtonText: '사진 공유하기',

    // 이름 입력 모달
    nameModalTitle: '소중한 사진을 공유해주시는 분은 누구신가요?',
    nameModalPlaceholder: '존함을 입력해주세요',
    nameModalSubmit: '사진 공유하러 가기',

    // 파일 선택 모달
    uploadModalTitle: '저희를 예쁘게 찍어주셨나요?',
    uploadModalSubtitle: '소중한 순간을 공유해주시면 평생 간직하겠습니다',
    uploadModalSelectButton: '사진/영상 선택하기',
    uploadModalCameraButton: '지금 촬영하기',
    uploadModalDragText: '여기에 파일을 끌어다 놓으세요',

    // 업로드 진행 중
    uploadingTitle: '소중한 추억을 전달받고 있어요',
    uploadingProgress: '{{current}}/{{total}} 업로드 중...',
    uploadingPleaseWait: '잠시만 기다려주세요',

    // 재시도
    retryingText: '다시 시도하고 있어요... ({{attempt}}/3)',
    retryButton: '다시 시도',

    // 완료
    uploadComplete: '예쁘게 찍어주셔서 정말 감사합니다 :)',
    uploadCompleteSubtitle: '공유해주신 사진은 평생 소중히 간직할게요',
    uploadMoreButton: '더 공유하기',
    closeButton: '닫기',

    // 실패
    uploadFailed: '앗, 전송이 잘 안됐어요',
    uploadFailedSubtitle: '다시 시도해주시겠어요?',

    // 제한
    limitReached: '최대 50장까지 공유하실 수 있어요',
    limitReachedSubtitle: '이미 많은 추억을 공유해주셨네요, 감사합니다!',

    // 오프라인
    offlineTitle: '인터넷 연결이 끊어졌어요',
    offlineSubtitle: '연결되면 자동으로 업로드를 이어갈게요',

    // 파일 검증
    invalidFileType: '사진과 영상 파일만 공유하실 수 있어요',
    fileTooLarge: '파일이 너무 커요 (사진 30MB, 영상 500MB 이하)',

    // 오픈 전 (결혼식 당일 전)
    notYetOpen: '결혼식 당일부터 사진을 공유하실 수 있어요!',
    notYetOpenSubtitle: '조금만 기다려주세요 :)',

    // 미완료 업로드 복구
    pendingUploadsFound: '이전에 업로드하지 못한 사진이 있어요',
    pendingUploadsResume: '이어서 업로드하기',
    pendingUploadsDiscard: '새로 시작하기',

    // 창 닫기 경고
    confirmLeave: '업로드 중입니다. 정말 나가시겠어요?',
    confirmLeaveSubtitle: '나가시면 진행 중인 업로드가 중단될 수 있어요',
  },

  // Allowed file types
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
    videos: ['video/mp4', 'video/quicktime', 'video/hevc'],
  },

  // File extensions mapping
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.heic', '.webp', '.mp4', '.mov'],

  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
  },

  // Session configuration
  session: {
    durationHours: 24,
    cookieName: 'guestsnap_session',
  },

  // NAS configuration (server-side only, via env vars)
  // SYNOLOGY_HOST, SYNOLOGY_PORT, SYNOLOGY_USERNAME, SYNOLOGY_PASSWORD
  // are loaded from environment variables
  nas: {
    basePath: '/GuestSnap',
    createFolderIfNotExists: true,
  },
};
```

#### 5.3.2 TypeScript Types

```typescript
// src/types/guestsnap.ts
export interface GuestSnapFile {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  mimeType: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  retryCount: number;
  createdAt: Date;
  uploadedAt?: Date;
}

export interface GuestSnapSession {
  id: string;
  guestName: string;
  uploadCount: number;
  files: GuestSnapFile[];
  createdAt: Date;
  expiresAt: Date;
}

export interface UploadQueueState {
  isProcessing: boolean;
  currentFile: GuestSnapFile | null;
  queue: GuestSnapFile[];
  completed: GuestSnapFile[];
  failed: GuestSnapFile[];
}
```

### 5.4 Component Structure

```
src/
├── components/
│   └── sections/
│       └── GuestSnap.tsx           # Main section component
│   └── guestsnap/
│       ├── GuestNameModal.tsx      # FIRST STEP: Name input modal
│       ├── UploadModal.tsx         # SECOND STEP: File selection
│       ├── UploadProgress.tsx      # Progress indicator
│       ├── FilePreview.tsx         # Thumbnail preview
│       └── UploadQueue.tsx         # Queue visualization
├── hooks/
│   ├── useGuestSnapUpload.ts       # Upload logic hook
│   ├── useUploadQueue.ts           # Queue management hook
│   └── useOfflineSync.ts           # Offline handling hook
├── lib/
│   └── guestsnap/
│       ├── synology-client.ts      # Synology API client (server-side)
│       ├── file-validator.ts       # File validation utilities
│       └── queue-manager.ts        # IndexedDB queue persistence
├── app/
│   └── api/
│       └── guestsnap/
│           ├── upload/route.ts     # Upload endpoint
│           ├── session/route.ts    # Session management
│           └── status/route.ts     # Service status
└── types/
    └── guestsnap.ts                # Type definitions
```

### 5.5 User Flow (Name-First Approach)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 게스트스냅 섹션                                               │
│     ┌─────────────────────────────────────┐                     │
│     │  🎞️ 게스트스냅                       │                     │
│     │  저희의 순간을 함께 담아주세요         │                     │
│     │                                      │                     │
│     │       [ 사진 공유하기 ]               │                     │
│     └─────────────────────────────────────┘                     │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. 이름 입력 모달 (GuestNameModal)                               │
│     ┌─────────────────────────────────────┐                     │
│     │  소중한 사진을 공유해주시는 분은       │                     │
│     │  누구신가요?                          │                     │
│     │                                      │                     │
│     │  ┌─────────────────────────────┐    │                     │
│     │  │ 존함을 입력해주세요           │    │                     │
│     │  └─────────────────────────────┘    │                     │
│     │                                      │                     │
│     │     [ 사진 공유하러 가기 ]            │                     │
│     └─────────────────────────────────────┘                     │
│     - 세션에 이름 저장 (24시간 유지)                              │
│     - NAS에 게스트 폴더 생성                                      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. 파일 선택 모달 (UploadModal)                                  │
│     ┌─────────────────────────────────────┐                     │
│     │  저희를 예쁘게 찍어주셨나요?          │                     │
│     │  소중한 순간을 공유해주시면            │                     │
│     │  평생 간직하겠습니다                   │                     │
│     │                                      │                     │
│     │  [ 사진/영상 선택하기 ]               │                     │
│     │  [ 지금 촬영하기 📷 ]                 │                     │
│     │                                      │                     │
│     │  (썸네일 미리보기 영역)               │                     │
│     └─────────────────────────────────────┘                     │
│     - 최대 50개 파일 선택 가능                                    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. 업로드 진행 (UploadProgress)                                  │
│     ┌─────────────────────────────────────┐                     │
│     │  소중한 추억을 전달받고 있어요        │                     │
│     │                                      │                     │
│     │  ████████████░░░░░░░░  12/20        │                     │
│     │  잠시만 기다려주세요                   │                     │
│     └─────────────────────────────────────┘                     │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. 완료 화면                                                    │
│     ┌─────────────────────────────────────┐                     │
│     │  ✨                                  │                     │
│     │  예쁘게 찍어주셔서 정말 감사합니다 :) │                     │
│     │  공유해주신 사진은 평생 소중히         │                     │
│     │  간직할게요                           │                     │
│     │                                      │                     │
│     │  [ 더 공유하기 ]  [ 닫기 ]            │                     │
│     └─────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘

※ 재방문 시: 세션에 이름이 있으면 2단계 스킵 → 바로 파일 선택
```

### 5.6 Synology API Integration

#### 5.5.1 Authentication Flow

```typescript
// Server-side only
async function authenticateSynology(): Promise<string> {
  const response = await fetch(
    `${SYNOLOGY_HOST}/webapi/auth.cgi?` +
    `api=SYNO.API.Auth&version=3&method=login&` +
    `account=${SYNOLOGY_USERNAME}&passwd=${SYNOLOGY_PASSWORD}&` +
    `session=FileStation&format=sid`
  );

  const data = await response.json();
  if (data.success) {
    return data.data.sid; // Session ID for subsequent requests
  }
  throw new Error('Synology authentication failed');
}
```

#### 5.5.2 File Upload

```typescript
// Server-side only
async function uploadToSynology(
  sid: string,
  file: Buffer,
  fileName: string,
  destPath: string
): Promise<boolean> {
  const formData = new FormData();
  formData.append('api', 'SYNO.FileStation.Upload');
  formData.append('version', '2');
  formData.append('method', 'upload');
  formData.append('path', destPath);
  formData.append('create_parents', 'true');
  formData.append('overwrite', 'true');
  formData.append('_sid', sid);
  formData.append('file', new Blob([file]), fileName);

  const response = await fetch(
    `${SYNOLOGY_HOST}/webapi/entry.cgi`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  return data.success;
}
```

### 5.6 Security Implementation

#### 5.6.1 Environment Variables

```env
# .env.local (never commit)
SYNOLOGY_HOST=https://your-nas.quickconnect.to
SYNOLOGY_PORT=5001
SYNOLOGY_USERNAME=guestsnap_user
SYNOLOGY_PASSWORD=secure_password_here
SYNOLOGY_SHARED_FOLDER=GuestSnap
GUESTSNAP_SECRET_KEY=random_32_char_string
```

#### 5.6.2 Rate Limiting

```typescript
// Implement using Next.js middleware or API route
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
};
```

#### 5.6.3 Input Sanitization

```typescript
function sanitizeGuestName(name: string): string {
  return name
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Allow letters, numbers, spaces, hyphens
    .substring(0, 50); // Max 50 characters
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}._-]/gu, '_')
    .substring(0, 100);
}
```

---

## 6. Constraints

### 6.1 Technical Constraints

| ID | Constraint | Impact |
|----|------------|--------|
| TC-001 | Synology NAS must be accessible externally | Feature unavailable if NAS is local-only |
| TC-002 | Maximum request body size limited by Vercel (4.5MB for serverless) | Large files must use chunked upload |
| TC-003 | File Station API rate limits | May need request throttling |
| TC-004 | Mobile browser file input limitations | HEIC support varies by browser |

### 6.2 Business Constraints

| ID | Constraint | Impact |
|----|------------|--------|
| BC-001 | Feature active only around wedding date | Time-limited implementation |
| BC-002 | No additional recurring costs | Rules out cloud storage alternatives |
| BC-003 | Simple authentication only | No complex user registration |

---

## 7. Dependencies

### 7.1 Internal Dependencies

- `src/lib/constants.ts` - Configuration storage
- `src/components/common/Section.tsx` - Section wrapper
- `src/components/ui/Modal.tsx` - Modal component
- `src/components/ui/Button.tsx` - Button component

### 7.2 External Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| Synology DSM 7.x | Storage backend | Single point of failure |
| QuickConnect/DDNS | External access | Connectivity dependent |
| IndexedDB | Offline queue | Browser support (98%+) |

---

## 8. Edge Cases and Handling

### 8.1 시간/날짜 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| 해외 하객 (다른 타임존) | 서버 시간(KST) 기준으로 판단, 클라이언트에서 KST 변환 |
| 자정 직전에 업로드 시작 | 업로드 시작 시점 기준, 진행 중인 업로드는 완료까지 허용 |

### 8.2 파일/업로드 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| 매우 느린 네트워크 | 청크 업로드 + 타임아웃 연장 (5분), 진행률 표시 |
| 브라우저 닫음 (업로드 중) | IndexedDB에 상태 저장, 재방문 시 "미완료 업로드가 있어요" 알림 |
| WiFi → 셀룰러 전환 | 네트워크 변경 감지, 자동 재연결 후 이어서 업로드 |
| 배터리 방전 | IndexedDB에 큐 저장, 다음 접속 시 복구 |
| 여러 탭에서 동시 업로드 | 탭 간 통신으로 중복 방지 (BroadcastChannel API) |
| 여러 기기에서 같은 이름 | 서버에서 세션 ID로 구분, 같은 폴더에 저장 |

### 8.3 이름/세션 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| 빈 이름 또는 공백만 입력 | "존함을 입력해주세요" 유효성 검사 |
| 매우 긴 이름 (50자 초과) | 50자로 자르기, 폴더명은 30자로 제한 |
| 특수문자/이모지 입력 | 특수문자 제거, 한글/영문/숫자만 허용 |
| 부적절한 내용 입력 | 기본 필터링 (선택적), 대부분 신뢰 기반 |
| 세션 만료 (24시간 후) | "다시 존함을 입력해주세요" 안내 후 새 세션 |
| 업로드 중 세션 만료 | 진행 중인 업로드는 완료, 추가 업로드 시 재입력 요청 |

### 8.4 NAS/서버 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| NAS 저장 공간 부족 | "저장 공간이 부족해요" 메시지, 신랑신부에게 알림 |
| NAS 오프라인 | "서버 연결 중..." 재시도, 3회 실패 시 "나중에 다시 시도" 안내 |
| Synology API 속도 제한 | 요청 간격 조절, 큐잉으로 순차 처리 |
| QuickConnect 연결 실패 | 대체 DDNS 시도, 실패 시 오류 메시지 |

### 8.5 파일 검증 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| 손상된 파일 | 서버에서 파일 헤더 검증, 실패 시 "파일이 손상됐어요" |
| 확장자 위조 (jpg → exe) | MIME 타입 + 매직 바이트 검증 |
| Android에서 HEIC | WebP/JPEG로 자동 변환 또는 "지원하지 않는 형식" 안내 |
| 매우 긴 파일명 | 100자로 자르기, 타임스탬프로 고유성 보장 |
| 같은 사용자가 같은 파일명 | 타임스탬프 추가: `IMG_001_1706345600.jpg` |

### 8.6 UX 관련
| 엣지 케이스 | 처리 방법 |
|------------|----------|
| 실수로 창 닫기 | "업로드 중입니다. 정말 나가시겠어요?" 확인 |
| 뒤로가기 버튼 | 모달 닫기로 처리, 업로드 취소 확인 |
| 50장 제한 도달 후 추가 시도 | "이미 많은 추억을 공유해주셨네요" 친절한 안내 |
| 0바이트 파일 선택 | "파일이 비어있어요" 안내 |

---

## 9. Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| NAS unreachable during event | Low | High | Implement local queue with later sync |
| Storage full | Low | Medium | Pre-event storage check, notifications |
| Upload failures due to poor connectivity | Medium | Medium | Robust retry mechanism, progress save |
| Malicious file uploads | Low | High | Server-side validation, file scanning |
| DDoS/abuse | Low | Medium | Rate limiting, session management |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Upload success rate | > 95% | Successful uploads / Total attempts |
| Average upload time | < 30s for 10MB | Server-side logging |
| Guest participation | > 50% of attendees | Unique sessions / Estimated guests |
| Storage utilization | < 80% of allocated | NAS monitoring |

---

## 10. Traceability

| SPEC Section | Related Plan Section | Related Acceptance Criteria |
|--------------|---------------------|----------------------------|
| FR-001 to FR-010 | M1, M2 | AC-001 to AC-010 |
| NFR-001 to NFR-004 | M2, M3 | AC-011 to AC-014 |
| Security (5.6) | M2.3 | AC-015 to AC-018 |
| UX (Mobile-first) | M1.2 | AC-019 to AC-022 |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-27 | Alfred (manager-spec) | Initial SPEC creation |
