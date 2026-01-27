# SPEC-GUESTSNAP-001: Acceptance Criteria

## Metadata

| Field | Value |
|-------|-------|
| SPEC ID | SPEC-GUESTSNAP-001 |
| Title | Guest Snap - Acceptance Criteria |
| Created | 2026-01-27 |
| Status | Planned |
| Tags | `SPEC-GUESTSNAP-001`, `acceptance`, `testing` |

---

## 1. File Upload Acceptance Criteria

### AC-001: Image Upload Success

**Scenario**: Guest uploads a valid image file

```gherkin
Given a guest has entered their name "김철수"
  And the guest has selected a JPEG image file of 5MB
  And the network connection is stable
When the guest taps the "업로드" button
Then the upload progress indicator should appear
  And the progress should update from 0% to 100%
  And a success message "업로드 완료" should be displayed
  And the file should appear in the Synology NAS at "/GuestSnap/{date}/김철수/"
  And the upload count should increase by 1
```

### AC-002: Video Upload Success

**Scenario**: Guest uploads a valid video file

```gherkin
Given a guest has entered their name "박영희"
  And the guest has selected an MP4 video file of 200MB
  And the network connection is stable
When the guest taps the "업로드" button
Then the upload should use chunked upload mode
  And the progress indicator should show real-time progress
  And the upload should complete within 3 minutes on 10Mbps connection
  And a success message should be displayed
  And the video should be playable from the NAS
```

### AC-003: Invalid File Type Rejection

**Scenario**: Guest attempts to upload an unsupported file type

```gherkin
Given a guest has selected a .exe file
When the file selection is processed
Then an error message "지원하지 않는 파일 형식입니다" should be displayed
  And the file should not be added to the upload queue
  And the guest should be able to select another file
```

### AC-004: File Size Limit - Image

**Scenario**: Guest attempts to upload an oversized image

```gherkin
Given a guest has selected a JPEG image of 35MB
When the file selection is processed
Then an error message "이미지 파일은 30MB 이하여야 합니다" should be displayed
  And the file should not be added to the upload queue
```

### AC-005: File Size Limit - Video

**Scenario**: Guest attempts to upload an oversized video

```gherkin
Given a guest has selected an MP4 video of 600MB
When the file selection is processed
Then an error message "동영상 파일은 500MB 이하여야 합니다" should be displayed
  And the file should not be added to the upload queue
```

---

## 2. Upload Limit Acceptance Criteria

### AC-006: Upload Count Within Limit

**Scenario**: Guest uploads files within the limit

```gherkin
Given a guest has uploaded 15 files in the current session
  And the upload limit is 20 files
When the guest selects 3 more files
Then all 3 files should be added to the queue
  And the remaining upload count should show "2개 더 업로드 가능"
```

### AC-007: Upload Count Limit Reached

**Scenario**: Guest reaches the upload limit

```gherkin
Given a guest has uploaded 20 files in the current session
When the guest attempts to select more files
Then a message "업로드 한도에 도달했습니다 (최대 20개)" should be displayed
  And the file picker should not open
  And the "파일 선택" button should be disabled
```

### AC-008: Upload Count Limit Partial

**Scenario**: Guest selects more files than remaining limit

```gherkin
Given a guest has uploaded 18 files in the current session
When the guest selects 5 more files
Then only the first 2 files should be added to the queue
  And a message "2개만 추가되었습니다 (한도 초과)" should be displayed
```

---

## 3. Guest Identification Acceptance Criteria

### AC-009: Guest Name Required

**Scenario**: Guest attempts to upload without entering name

```gherkin
Given the guest name input field is empty
When the guest taps the "파일 선택" button
Then a validation message "이름을 입력해주세요" should appear
  And the file picker should not open
  And the name input should be focused
```

### AC-010: Guest Name Saved

**Scenario**: Guest name is remembered during session

```gherkin
Given a guest has entered their name "이민수"
  And has completed an upload
When the guest refreshes the page
Then the name input should be pre-filled with "이민수"
  And the session should maintain the previous upload count
```

### AC-011: Guest Name Sanitization

**Scenario**: Guest enters name with special characters

```gherkin
Given a guest enters the name "김<script>철수"
When the name is processed
Then the sanitized name should be "김철수"
  And the folder on NAS should be created as "김철수"
  And no script execution should occur
```

---

## 4. Upload Queue Acceptance Criteria

### AC-012: Multiple File Selection

**Scenario**: Guest selects multiple files at once

```gherkin
Given a guest has not selected any files
When the guest selects 5 image files from the file picker
Then all 5 files should appear in the upload queue
  And each file should show a thumbnail preview
  And the total size should be displayed
  And an "모두 업로드" button should be visible
```

### AC-013: Queue Processing Order

**Scenario**: Upload queue processes files in order

```gherkin
Given a guest has 5 files in the upload queue
  And no uploads are in progress
When the guest taps "모두 업로드"
Then files should upload in the order they were added
  And a maximum of 3 files should upload concurrently
  And each file's status should update in real-time
```

### AC-014: Queue File Removal

**Scenario**: Guest removes a file from queue before upload

```gherkin
Given a guest has 3 files in the upload queue
  And none are currently uploading
When the guest taps the remove button on the second file
Then the second file should be removed from the queue
  And the queue should show 2 remaining files
  And the removed file's thumbnail should no longer be visible
```

### AC-015: Queue Persistence

**Scenario**: Upload queue survives page refresh

```gherkin
Given a guest has 3 files in the upload queue
  And 1 file is currently uploading at 50%
When the guest accidentally refreshes the page
Then the upload queue should be restored from IndexedDB
  And the completed files should show as completed
  And the in-progress file should restart from beginning
  And pending files should remain in queue
```

---

## 5. Offline Handling Acceptance Criteria

### AC-016: Offline Detection

**Scenario**: Device loses network connectivity during upload

```gherkin
Given a file is uploading at 60% progress
When the device loses network connectivity
Then the upload should pause
  And a message "오프라인 - 연결 대기 중" should appear
  And the progress should remain at 60%
  And the queue state should be preserved
```

### AC-017: Online Reconnection

**Scenario**: Network reconnects after offline period

```gherkin
Given the device was offline with a paused upload at 60%
When network connectivity is restored
Then the upload should automatically resume
  And a message "연결됨 - 업로드 재개" should appear
  And the progress should continue from where it paused
```

### AC-018: Prolonged Offline

**Scenario**: Device remains offline for extended period

```gherkin
Given the device has been offline for more than 5 minutes
  And there are pending uploads in the queue
When the guest views the upload screen
Then a message "오프라인 상태입니다" should be persistent
  And an option to "나중에 업로드" should be available
  And the queue should be saved for later
```

---

## 6. Retry Mechanism Acceptance Criteria

### AC-019: Automatic Retry on Network Error

**Scenario**: Upload fails due to temporary network issue

```gherkin
Given a file is uploading
When a network error occurs (not complete offline)
Then the upload should automatically retry
  And a message "재시도 중... (1/3)" should appear
  And the retry should use exponential backoff (1s, 2s, 4s)
  And if successful, the file should complete normally
```

### AC-020: Retry Exhaustion

**Scenario**: Upload fails after maximum retries

```gherkin
Given a file upload has failed
  And 3 retry attempts have been exhausted
When the final retry fails
Then the file status should change to "실패"
  And an error message should explain the failure
  And a "다시 시도" button should be available
  And the next file in queue should start uploading
```

### AC-021: Manual Retry

**Scenario**: Guest manually retries a failed upload

```gherkin
Given a file has failed to upload after all retries
When the guest taps "다시 시도" on the failed file
Then the retry counter should reset to 0
  And the upload should begin again
  And progress should start from 0%
```

---

## 7. Progress Indication Acceptance Criteria

### AC-022: Individual File Progress

**Scenario**: Progress shown for each uploading file

```gherkin
Given a file is uploading
When the upload is in progress
Then a progress bar should show the percentage (0-100%)
  And the percentage number should update every 500ms minimum
  And the uploaded/total size should be displayed (e.g., "5.2MB / 10MB")
  And an estimated time remaining should be shown
```

### AC-023: Overall Queue Progress

**Scenario**: Progress shown for entire queue

```gherkin
Given 5 files are in the upload queue
  And 2 files have completed
  And 1 file is at 50% progress
When viewing the queue
Then overall progress should show "2.5 / 5 파일"
  And a summary progress bar should reflect 50% (2.5/5)
```

### AC-024: Upload Speed Display

**Scenario**: Current upload speed is displayed

```gherkin
Given a file is uploading on a stable connection
When the upload has been running for at least 3 seconds
Then the current upload speed should be displayed (e.g., "2.5 MB/s")
  And the speed should update every 2 seconds
  And the estimated time should adjust based on speed
```

---

## 8. Security Acceptance Criteria

### AC-025: HTTPS Enforcement

**Scenario**: All communications use HTTPS

```gherkin
Given the Guest Snap feature is accessed
When any API request is made
Then all requests should use HTTPS protocol
  And no credentials should be transmitted in URL parameters
  And cookies should have Secure and HttpOnly flags
```

### AC-026: Rate Limiting

**Scenario**: Excessive requests are rate limited

```gherkin
Given a guest (or attacker) sends 50 requests in 10 seconds
When the rate limit threshold (30/minute) is exceeded
Then subsequent requests should receive HTTP 429
  And a message "요청이 너무 많습니다. 잠시 후 다시 시도해주세요" should appear
  And the rate limit should reset after 60 seconds
```

### AC-027: File Content Validation

**Scenario**: File content matches declared type

```gherkin
Given a file named "image.jpg" is selected
  And the file is actually an executable with renamed extension
When the file is processed on the server
Then the server should detect the content type mismatch
  And the upload should be rejected
  And an error "유효하지 않은 파일입니다" should be returned
```

### AC-028: NAS Credentials Protection

**Scenario**: NAS credentials are never exposed to client

```gherkin
Given the Guest Snap feature is being used
When inspecting network requests in browser DevTools
Then no Synology credentials should appear in any request
  And no API tokens should be visible in JavaScript
  And environment variables should only be accessed server-side
```

---

## 9. Mobile UX Acceptance Criteria

### AC-029: Touch-Friendly Interface

**Scenario**: All interactive elements are touch-accessible

```gherkin
Given the Guest Snap section is displayed on a mobile device
When the guest views the interface
Then all buttons should be at least 44x44 pixels
  And there should be at least 8px spacing between touch targets
  And no hover-only interactions should exist
```

### AC-030: Camera Access

**Scenario**: Guest can take photo directly

```gherkin
Given the guest is on a mobile device with camera
When the guest taps "사진 찍기"
Then the device camera should open
  And after taking a photo, it should be added to upload queue
  And the interface should return to the upload screen
```

### AC-031: Responsive Layout

**Scenario**: Interface adapts to screen size

```gherkin
Given the Guest Snap section is viewed
When the screen width is 320px (small phone)
Then all content should be visible without horizontal scroll
  And the upload button should span full width
  And thumbnails should be 3 per row
When the screen width is 768px (tablet)
Then thumbnails should be 4-6 per row
  And the layout should use available space efficiently
```

### AC-032: Single-Hand Operation

**Scenario**: Key actions are accessible with one hand

```gherkin
Given the guest is holding their phone with one hand
When they need to upload a photo
Then the primary action button should be in the lower half of screen
  And swipe gestures should work for navigation
  And no actions should require two-hand operation
```

---

## 10. Error Handling Acceptance Criteria

### AC-033: NAS Unreachable

**Scenario**: Synology NAS is not accessible

```gherkin
Given the upload feature is accessed
  And the Synology NAS is offline or unreachable
When the guest attempts to upload
Then an error message "서버에 연결할 수 없습니다" should appear
  And the upload should be queued for later
  And a "나중에 다시 시도" option should be available
```

### AC-034: Storage Full

**Scenario**: NAS storage is full

```gherkin
Given the upload feature is working
  And the NAS storage is full
When a guest attempts to upload
Then an error message "저장 공간이 부족합니다" should appear
  And the couple should receive a notification (if configured)
  And the upload should fail gracefully
```

### AC-035: Session Expiration

**Scenario**: Guest session expires

```gherkin
Given a guest has been inactive for 24 hours
  And their session has expired
When they attempt to upload
Then a message "세션이 만료되었습니다" should appear
  And they should be prompted to re-enter their name
  And their previous upload count should be preserved (by name lookup)
```

---

## 11. Performance Acceptance Criteria

### AC-036: Initial Load Time

**Scenario**: Guest Snap section loads quickly

```gherkin
Given the wedding invitation page is loaded
When the Guest Snap section comes into view
Then the section should be fully interactive within 1 second
  And no layout shift should occur after initial render
  And the Cumulative Layout Shift should be < 0.1
```

### AC-037: Upload Speed - Image

**Scenario**: Image upload completes in reasonable time

```gherkin
Given a 10MB image file is ready to upload
  And the network connection is 5Mbps
When the upload begins
Then the upload should complete within 20 seconds
  And progress should update smoothly (no jumps > 10%)
```

### AC-038: Upload Speed - Video

**Scenario**: Video upload completes in reasonable time

```gherkin
Given a 100MB video file is ready to upload
  And the network connection is 10Mbps
When the upload begins
Then the upload should complete within 90 seconds
  And chunked upload should be used (5MB chunks)
  And each chunk completion should update progress
```

### AC-039: Memory Usage

**Scenario**: Large files don't crash the browser

```gherkin
Given a guest selects a 500MB video file
When the file is prepared for upload
Then the browser memory usage should not spike above 100MB for the upload
  And the file should be streamed, not loaded entirely
  And the UI should remain responsive
```

---

## 12. Accessibility Acceptance Criteria

### AC-040: Screen Reader Support

**Scenario**: Feature is usable with screen reader

```gherkin
Given a guest is using VoiceOver (iOS) or TalkBack (Android)
When navigating the Guest Snap section
Then all buttons should have descriptive labels
  And upload progress should be announced
  And error messages should be announced as alerts
  And the focus order should be logical
```

### AC-041: Keyboard Navigation

**Scenario**: Feature is usable with keyboard

```gherkin
Given a guest is using keyboard navigation
When the Guest Snap section is focused
Then Tab should move through interactive elements in logical order
  And Enter/Space should activate buttons
  And Escape should close modals
  And focus should be visible with high contrast indicator
```

### AC-042: Color Contrast

**Scenario**: Text is readable in all conditions

```gherkin
Given the Guest Snap section is displayed
When checking color contrast ratios
Then all text should have at least 4.5:1 contrast ratio
  And large text should have at least 3:1 contrast ratio
  And error states should not rely on color alone
```

---

## 13. Quality Gate Checklist

### Definition of Done

- [ ] All acceptance criteria tests pass
- [ ] Unit test coverage >= 85%
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Lighthouse Performance score >= 90
- [ ] Lighthouse Accessibility score >= 95
- [ ] Manual test on iOS Safari 16+
- [ ] Manual test on Android Chrome 120+
- [ ] Manual test on Desktop Chrome 120+
- [ ] Code reviewed by at least one reviewer
- [ ] Security review completed
- [ ] Documentation updated

### Test Device Matrix

| Device | OS | Browser | Priority |
|--------|----|---------| ---------|
| iPhone 13+ | iOS 16+ | Safari | Critical |
| Galaxy S21+ | Android 12+ | Chrome | Critical |
| Pixel 6+ | Android 12+ | Chrome | High |
| iPad | iPadOS 16+ | Safari | Medium |
| Desktop | Windows/Mac | Chrome | Medium |
| Desktop | Windows/Mac | Firefox | Low |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-27 | Alfred (manager-spec) | Initial acceptance criteria |
