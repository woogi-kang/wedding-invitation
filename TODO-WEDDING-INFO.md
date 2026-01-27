# 청첩장 정보 수정 체크리스트

> **수정 파일**: `src/lib/constants.ts`
> **지도 링크 수정**: `src/components/sections/Location.tsx` (13-14행)

---

## 1. 신랑 정보

- [ ] 이름: `강태욱` →
- [ ] 영문명: `Taewook` →
- [ ] 아버지: `김철수` →
- [ ] 어머니: `박영희` →
- [ ] 아버지 별세 여부: `false` → (true/false)
- [ ] 어머니 별세 여부: `false` → (true/false)
- [ ] 연락처: `010-1234-5678` →

### 신랑 계좌
- [ ] 은행: `신한은행` →
- [ ] 계좌번호: `110-123-456789` →
- [ ] 예금주: `강태욱` →

### 신랑 아버지 계좌
- [ ] 은행: `국민은행` →
- [ ] 계좌번호: `123-456-789012` →
- [ ] 예금주: `김철수` →

### 신랑 어머니 계좌
- [ ] 은행: `우리은행` →
- [ ] 계좌번호: `1002-123-456789` →
- [ ] 예금주: `박영희` →

---

## 2. 신부 정보

- [ ] 이름: `김선경` →
- [ ] 영문명: `Sunkyung` →
- [ ] 아버지: `이영수` →
- [ ] 어머니: `최미경` →
- [ ] 아버지 별세 여부: `false` → (true/false)
- [ ] 어머니 별세 여부: `false` → (true/false)
- [ ] 연락처: `010-9876-5432` →

### 신부 계좌
- [ ] 은행: `카카오뱅크` →
- [ ] 계좌번호: `3333-12-3456789` →
- [ ] 예금주: `김선경` →

### 신부 아버지 계좌
- [ ] 은행: `하나은행` →
- [ ] 계좌번호: `123-456789-12345` →
- [ ] 예금주: `이영수` →

### 신부 어머니 계좌
- [ ] 은행: `농협` →
- [ ] 계좌번호: `123-4567-8901-23` →
- [ ] 예금주: `최미경` →

---

## 3. 예식 일정

- [ ] 날짜: `2026-04-05` →
- [ ] 요일: `일요일` →
- [ ] 시간: `오후 2시 15분` →
- [ ] 시간 (24시): `14:15` →

---

## 4. 예식장 정보

- [ ] 예식장명: `라마다 서울 신도림 호텔` →
- [ ] 홀명: `웨딩홀` →
- [ ] 도로명 주소: `서울특별시 구로구 경인로 624` →
- [ ] 지번 주소: `서울특별시 구로구 경인로 624` →
- [ ] 전화번호: `02-2162-2100` →
- [ ] 좌표 (lat): `37.5064` →
- [ ] 좌표 (lng): `126.8853` →

---

## 5. 교통 정보

- [ ] 주차 안내: `건물 내 주차장 800대 이용 가능` →
- [ ] 지하철 안내: `지하철 1호선, 2호선 신도림역 1번 출구 도보 5분` →
- [ ] 버스 안내: `간선: 160, 503, 600, 662 / 지선: 6513, 6515, 6516` →

---

## 6. 셔틀버스 정보

- [ ] 운행 여부: `true` → (true/false)
- [ ] 노선명: `신도림역 출발` →
- [ ] 출발 위치: `신도림역 1번 출구 앞` →
- [ ] 운행 시간: `13:00, 13:30, 14:00` →
- [ ] 소요 시간: `약 5분 소요` →

---

## 7. 지도 링크 (Location.tsx 수정 필요)

> **파일**: `src/components/sections/Location.tsx` 13-14행

- [ ] 네이버지도: `https://naver.me/G9r5RXWh` →
- [ ] 카카오맵: `https://place.map.kakao.com/1212235250` →

---

## 8. 인사말

- [ ] 제목: `결혼합니다` →
- [ ] 내용:
```
서로 다른 두 사람이 만나
하나의 사랑을 이루게 되었습니다.

소중한 분들을 모시고
사랑의 약속을 하려 합니다.

부디 오셔서 축복해 주시면
더없는 기쁨으로 간직하겠습니다.
```
→ (새 인사말 입력)

---

## 9. 갤러리 이미지

> **경로**: `public/images/` 에 실제 사진 업로드 후 경로 수정

- [ ] 이미지 1: `https://picsum.photos/seed/wedding1/600/800` →
- [ ] 이미지 2: `https://picsum.photos/seed/wedding2/600/800` →
- [ ] 이미지 3: `https://picsum.photos/seed/wedding3/600/800` →
- [ ] 이미지 4: `https://picsum.photos/seed/wedding4/600/800` →
- [ ] 이미지 5: `https://picsum.photos/seed/wedding5/600/800` →
- [ ] 이미지 6: `https://picsum.photos/seed/wedding6/600/800` →

---

## 10. 영상

- [ ] 사용 여부: `true` → (true/false)
- [ ] YouTube ID: `dQw4w9WgXcQ` →
- [ ] 영상 제목: `우리의 이야기` →

---

## 11. 배경음악

> **경로**: `public/music/` 에 음악 파일 업로드 후 설정

- [ ] 사용 여부: `false` → (true/false)
- [ ] 파일 경로: `/music/bgm.mp3` →
- [ ] 곡명: `Beautiful in White` →
- [ ] 아티스트: `Shane Filan` →

---

## 12. RSVP (참석 여부 확인)

- [ ] 사용 여부: `true` → (true/false)
- [ ] Google Forms URL: `https://forms.gle/your-form-id` →

---

## 13. 방명록 (Giscus)

> **설정 방법**: https://giscus.app 에서 생성

- [ ] 사용 여부: `true` → (true/false)
- [ ] repo: `your-username/your-repo` →
- [ ] repoId: `your-repo-id` →
- [ ] category: `Announcements` →
- [ ] categoryId: `your-category-id` →

---

## 14. 기타 설정

### 환경 변수 (.env.local)
- [ ] NEXT_PUBLIC_SITE_URL: `https://your-wedding-invitation.vercel.app` →
- [ ] NEXT_PUBLIC_KAKAO_JS_KEY: →

### 이미지 파일
- [ ] OG 이미지: `public/images/og-image.jpg` (업로드 필요)
- [ ] 지도 이미지: `public/images/map.png` (업로드 필요)

---

## 수정 방법

### constants.ts 수정 예시

```typescript
// src/lib/constants.ts 에서 해당 값을 찾아 수정

export const WEDDING_INFO = {
  groom: {
    name: '실제이름',        // 여기 수정
    englishName: 'RealName', // 여기 수정
    // ... 나머지 항목들
  },
  // ...
};
```

### Location.tsx 지도 링크 수정

```typescript
// src/components/sections/Location.tsx 13-14행

const openNaverMap = () => {
  window.open('실제_네이버지도_URL', '_blank');  // 여기 수정
};

const openKakaoMap = () => {
  window.open('실제_카카오맵_URL', '_blank');    // 여기 수정
};
```

---

## 완료 체크

- [ ] 모든 개인정보 수정 완료
- [ ] 실제 사진 업로드 완료
- [ ] 지도 링크 확인 완료
- [ ] 배포 테스트 완료

---

**마지막 업데이트**: 2026-01-27
