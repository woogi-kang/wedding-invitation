# SPEC-GUESTSNAP-001: Implementation Plan

## Metadata

| Field | Value |
|-------|-------|
| SPEC ID | SPEC-GUESTSNAP-001 |
| Title | Guest Snap - Implementation Plan |
| Created | 2026-01-27 |
| Status | Planned |
| Tags | `SPEC-GUESTSNAP-001`, `implementation`, `plan` |

---

## 1. Implementation Strategy

### 1.1 Development Approach

This implementation follows the **DDD (Domain-Driven Development)** methodology with the ANALYZE-PRESERVE-IMPROVE cycle:

1. **ANALYZE**: Understand existing codebase patterns (Gallery component, Section structure)
2. **PRESERVE**: Maintain existing design system, component patterns, and TypeScript conventions
3. **IMPROVE**: Add Guest Snap feature with consistent architecture

### 1.2 Technical Approach

- **Frontend-First**: Build UI components with mock data, then integrate backend
- **Mobile-First Design**: All components designed for mobile, enhanced for desktop
- **Progressive Enhancement**: Core upload works without JavaScript enhancements
- **Offline-First**: Upload queue persists locally before server sync

---

## 2. Milestones

### M1: Foundation (Priority: High)

**Goal**: Establish core infrastructure and types

#### M1.1: Type Definitions and Configuration
- Define TypeScript interfaces in `src/types/guestsnap.ts`
- Add configuration to `src/lib/constants.ts`
- Create environment variable schema

**Files to Create/Modify**:
- `src/types/guestsnap.ts` (new)
- `src/lib/constants.ts` (modify)
- `.env.local.example` (new)

#### M1.2: UI Components - Section Shell
- Create `GuestSnap.tsx` section component
- Follow existing Section pattern from Gallery.tsx
- Mobile-first responsive layout

**Files to Create**:
- `src/components/sections/GuestSnap.tsx`
- `src/components/sections/index.ts` (modify)

#### M1.3: UI Components - Name-First Upload Interface
- Create guest name modal (FIRST STEP - appears before file selection)
- Create upload modal with drag-and-drop (SECOND STEP)
- Create file preview component

**User Flow**:
1. User clicks "사진 올리기" button
2. **GuestNameModal** appears → User enters name (e.g., "홍길동")
3. Session created → NAS folder created: `/GuestSnap/2026-04-05/홍길동/`
4. **UploadModal** appears → User selects files (최대 50장)
5. Files uploaded to guest's dedicated folder (원본 화질 유지)
6. 완료 시 "예쁘게 찍어주셔서 감사합니다:)" 메시지 표시

**Files to Create**:
- `src/components/guestsnap/GuestNameModal.tsx` (Name input - FIRST)
- `src/components/guestsnap/UploadModal.tsx` (File selection - SECOND)
- `src/components/guestsnap/FilePreview.tsx`

**Deliverables**:
- [ ] Type definitions complete
- [ ] Configuration schema defined
- [ ] GuestSnap section visible on page
- [ ] Upload modal opens/closes
- [ ] File selection works (no upload yet)

---

### M2: Core Upload Functionality (Priority: High)

**Goal**: Implement end-to-end file upload to Synology NAS

#### M2.1: Synology API Client
- Create server-side Synology API client
- Implement authentication flow
- Implement folder creation by guest name
- Implement file upload function

**Folder Structure on NAS**:
```
/volume1/GuestSnap/
  └── 2026-04-05/           # Wedding date (auto-created)
      ├── 홍길동/            # Guest name folder (created on session)
      ├── 김철수/
      └── Jane_Smith/
```

**Key Functions**:
- `createGuestFolder(guestName)` → Creates `/GuestSnap/{date}/{name}/`
- `uploadFile(guestName, file)` → Uploads to guest's folder
- `checkDuplicateName(name)` → Returns `홍길동_2` if exists

**Files to Create**:
- `src/lib/guestsnap/synology-client.ts`

#### M2.2: API Routes
- Create upload endpoint with file validation
- Create session management endpoint
- Create status check endpoint
- Implement chunked upload for large files

**Files to Create**:
- `src/app/api/guestsnap/upload/route.ts`
- `src/app/api/guestsnap/session/route.ts`
- `src/app/api/guestsnap/status/route.ts`

#### M2.3: Security Layer
- Implement rate limiting
- Implement input sanitization
- Add file type validation
- Add file size validation

**Files to Create**:
- `src/lib/guestsnap/file-validator.ts`
- `src/lib/guestsnap/rate-limiter.ts`

#### M2.4: Upload Hook
- Create `useGuestSnapUpload` hook
- Handle upload progress tracking
- Handle error states

**Files to Create**:
- `src/hooks/useGuestSnapUpload.ts`

**Deliverables**:
- [ ] Single file upload works end-to-end
- [ ] Files appear in Synology NAS
- [ ] Progress indicator shows real progress
- [ ] Error handling displays user-friendly messages
- [ ] File validation rejects invalid files

---

### M3: Upload Queue and Offline Support (Priority: Medium)

**Goal**: Handle multiple files and network interruptions gracefully

#### M3.1: Queue Management
- Create upload queue data structure
- Implement IndexedDB persistence
- Create queue visualization component

**Files to Create**:
- `src/lib/guestsnap/queue-manager.ts`
- `src/components/guestsnap/UploadQueue.tsx`
- `src/hooks/useUploadQueue.ts`

#### M3.2: Progress Component
- Create detailed progress UI
- Show individual file progress
- Show overall queue progress

**Files to Create**:
- `src/components/guestsnap/UploadProgress.tsx`

#### M3.3: Offline Handling
- Detect network status changes
- Pause/resume queue on connectivity change
- Persist queue state across page refreshes

**Files to Create**:
- `src/hooks/useOfflineSync.ts`

#### M3.4: Retry Mechanism
- Implement exponential backoff
- Track retry attempts per file
- Handle permanent failures gracefully

**Deliverables**:
- [ ] Multiple file selection works
- [ ] Queue shows pending/uploading/completed files
- [ ] Offline detection pauses uploads
- [ ] Reconnection resumes uploads
- [ ] Failed uploads retry automatically
- [ ] Queue persists across page refresh

---

### M4: Polish and Optimization (Priority: Medium)

**Goal**: Enhance user experience and performance

#### M4.1: Image Compression (Optional)
- Implement client-side image resizing
- Offer compression toggle for slow connections

#### M4.2: Thumbnail Generation
- Generate thumbnails for preview
- Handle HEIC conversion for preview

#### M4.3: Animation and Feedback
- Add Framer Motion animations
- Add sonner toast notifications
- Add haptic feedback on mobile

#### M4.4: Accessibility
- Add ARIA labels
- Keyboard navigation support
- Screen reader announcements

**Deliverables**:
- [ ] Smooth animations on all interactions
- [ ] Toast notifications for success/failure
- [ ] Thumbnails display for selected files
- [ ] Full keyboard accessibility
- [ ] WCAG 2.1 AA compliance

---

### M5: Testing and Documentation (Priority: High)

**Goal**: Ensure reliability and maintainability

#### M5.1: Unit Tests
- Test file validator functions
- Test queue manager logic
- Test Synology client (mocked)

#### M5.2: Integration Tests
- Test upload flow end-to-end
- Test offline/online transitions
- Test rate limiting

#### M5.3: Documentation
- Update README with feature description
- Document environment variables
- Create Synology setup guide

**Deliverables**:
- [ ] 85%+ test coverage for new code
- [ ] All acceptance criteria verified
- [ ] Documentation complete

---

## 3. Technical Architecture

### 3.1 Data Flow

```
User Action                   Client                        Server                    NAS
    │                           │                             │                        │
    │ Select files              │                             │                        │
    ├──────────────────────────►│                             │                        │
    │                           │ Validate files              │                        │
    │                           │ Add to queue                │                        │
    │                           │ Store in IndexedDB          │                        │
    │                           │                             │                        │
    │                           │ POST /api/guestsnap/upload  │                        │
    │                           ├────────────────────────────►│                        │
    │                           │                             │ Validate               │
    │                           │                             │ Authenticate           │
    │                           │                             │ Create folder          │
    │                           │                             ├───────────────────────►│
    │                           │                             │                        │
    │                           │                             │ Upload file            │
    │                           │                             ├───────────────────────►│
    │                           │                             │                        │
    │                           │ Upload progress (chunks)    │◄───────────────────────│
    │◄──────────────────────────┼─────────────────────────────│                        │
    │                           │                             │                        │
    │                           │ Success response            │                        │
    │◄──────────────────────────┼─────────────────────────────│                        │
    │                           │                             │                        │
    │                           │ Update queue                │                        │
    │                           │ Remove from IndexedDB       │                        │
    │                           │                             │                        │
```

### 3.2 State Management

```typescript
// Upload Queue State Machine
type UploadState =
  | 'idle'           // No uploads in progress
  | 'selecting'      // User selecting files
  | 'validating'     // Validating selected files
  | 'uploading'      // Upload in progress
  | 'paused'         // Paused (offline or user action)
  | 'completed'      // All uploads completed
  | 'error';         // Fatal error state

// File State Machine
type FileState =
  | 'pending'        // In queue, waiting
  | 'uploading'      // Currently uploading
  | 'completed'      // Successfully uploaded
  | 'failed'         // Upload failed (after retries)
  | 'cancelled';     // Cancelled by user
```

### 3.3 Error Handling Strategy

| Error Type | Detection | User Message | Recovery |
|------------|-----------|--------------|----------|
| Invalid file type | Client validation | "지원하지 않는 파일 형식입니다" | Remove from selection |
| File too large | Client validation | "파일 크기가 너무 큽니다 (최대 30MB)" | Remove from selection |
| Network error | Fetch failure | "네트워크 연결을 확인해주세요" | Auto-retry with backoff |
| NAS unreachable | API 503 | "서버에 연결할 수 없습니다" | Retry later |
| Storage full | API 507 | "저장 공간이 부족합니다" | Notify couple |
| Rate limited | API 429 | "잠시 후 다시 시도해주세요" | Auto-retry after delay |
| Session expired | API 401 | "세션이 만료되었습니다" | Re-enter guest name |

### 3.4 Performance Considerations

| Concern | Strategy |
|---------|----------|
| Large file uploads | Chunked upload (5MB chunks) |
| Many concurrent uploads | Queue with max 3 concurrent |
| Mobile battery drain | Pause on low battery (optional) |
| Memory usage | Stream files, don't load entirely |
| UI responsiveness | Web Workers for validation |

---

## 4. File Structure

```
src/
├── app/
│   ├── api/
│   │   └── guestsnap/
│   │       ├── upload/
│   │       │   └── route.ts          # POST: Upload file
│   │       ├── session/
│   │       │   └── route.ts          # POST: Create session
│   │       └── status/
│   │           └── route.ts          # GET: Service status
│   └── page.tsx                      # Add GuestSnap section
│
├── components/
│   ├── sections/
│   │   ├── GuestSnap.tsx             # Main section component
│   │   └── index.ts                  # Export GuestSnap
│   └── guestsnap/
│       ├── GuestNameModal.tsx        # STEP 1: Name input modal
│       ├── UploadModal.tsx           # STEP 2: File selection modal
│       ├── UploadProgress.tsx        # Progress indicator
│       ├── UploadQueue.tsx           # Queue visualization
│       ├── FilePreview.tsx           # Thumbnail preview
│       └── index.ts                  # Barrel export
│
├── hooks/
│   ├── useGuestSnapUpload.ts         # Core upload logic
│   ├── useUploadQueue.ts             # Queue management
│   └── useOfflineSync.ts             # Offline handling
│
├── lib/
│   ├── constants.ts                  # Add GUEST_SNAP_CONFIG
│   └── guestsnap/
│       ├── synology-client.ts        # Synology API (server)
│       ├── file-validator.ts         # Validation utils
│       ├── queue-manager.ts          # IndexedDB queue
│       ├── rate-limiter.ts           # Rate limiting
│       └── index.ts                  # Barrel export
│
└── types/
    ├── index.ts                      # Existing types
    └── guestsnap.ts                  # GuestSnap types
```

---

## 5. Environment Variables

```env
# .env.local.example

# Synology NAS Configuration
SYNOLOGY_HOST=https://your-nas.quickconnect.to
SYNOLOGY_PORT=5001
SYNOLOGY_USERNAME=guestsnap_user
SYNOLOGY_PASSWORD=your_secure_password
SYNOLOGY_SHARED_FOLDER=GuestSnap

# Feature Configuration
GUESTSNAP_ENABLED=true
GUESTSNAP_SECRET_KEY=random_32_character_string_here

# Rate Limiting
GUESTSNAP_RATE_LIMIT_WINDOW_MS=60000
GUESTSNAP_RATE_LIMIT_MAX=30
```

---

## 6. Dependencies to Add

```json
{
  "dependencies": {
    "idb": "^8.0.0"
  },
  "devDependencies": {
    "@types/web": "^0.0.x"
  }
}
```

**Note**: Minimal new dependencies to maintain bundle size. Using native APIs where possible:
- `idb`: Thin wrapper for IndexedDB (better DX than raw API)
- Native `File API` for file handling
- Native `fetch` for uploads (no axios needed)

---

## 7. Risks and Mitigations

| Risk | Mitigation | Contingency |
|------|------------|-------------|
| Vercel 4.5MB body limit | Implement chunked upload | Use external upload service |
| Synology API changes | Pin to specific DSM version | Abstract API layer for swapping |
| Mobile Safari file input issues | Test on real devices | Fallback to basic file input |
| IndexedDB quota exceeded | Implement LRU cache eviction | Fallback to sessionStorage |
| CORS issues with NAS | Use API route as proxy | Never call NAS directly from client |

---

## 8. Definition of Done

### For Each Milestone:
- [ ] All listed files created/modified
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Manual testing on iOS Safari and Android Chrome
- [ ] Code reviewed and approved

### For Complete Feature:
- [ ] All milestones completed
- [ ] 85%+ test coverage
- [ ] Lighthouse performance score > 90
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] Synology setup guide created
- [ ] Acceptance criteria verified

---

## 9. Traceability Matrix

| Requirement | Milestone | Implementation File |
|-------------|-----------|---------------------|
| FR-001: Photo Upload | M2.2 | `api/guestsnap/upload/route.ts` |
| FR-002: Video Upload | M2.2 | `api/guestsnap/upload/route.ts` |
| FR-003: File Size Limits | M2.3 | `lib/guestsnap/file-validator.ts` |
| FR-004: Upload Count Limit | M2.2 | `api/guestsnap/session/route.ts` |
| FR-005: Guest Identification | M1.3 | `components/guestsnap/GuestNameModal.tsx` |
| FR-006: Upload Progress | M2.4 | `hooks/useGuestSnapUpload.ts` |
| FR-007: Upload Queue | M3.1 | `hooks/useUploadQueue.ts` |
| FR-008: Retry Mechanism | M3.4 | `hooks/useGuestSnapUpload.ts` |
| FR-009: Offline Handling | M3.3 | `hooks/useOfflineSync.ts` |
| FR-010: File Organization | M2.1 | `lib/guestsnap/synology-client.ts` |
| NFR-001: Performance | M4 | All components |
| NFR-002: Security | M2.3 | `lib/guestsnap/rate-limiter.ts` |
| NFR-003: Availability | M2.2 | `api/guestsnap/status/route.ts` |
| NFR-004: Usability | M1.2, M4 | UI components |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-27 | Alfred (manager-spec) | Initial plan creation |
