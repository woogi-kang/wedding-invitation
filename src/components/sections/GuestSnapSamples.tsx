'use client';

import { Camera, Heart, Sparkles, Star, Image, Gift, Share2, Users, Smile, Film } from 'lucide-react';

/**
 * GuestSnap Layout Samples
 *
 * 각 샘플은 동일한 멘트를 유지하면서 다른 레이아웃을 제공합니다.
 * 실제 적용 시 GuestSnap.tsx의 Content Card 부분을 교체하면 됩니다.
 */

// ============================================================
// Sample 1: 리스트 카드 분리형
// 특징: 각 리스트 아이템을 개별 미니 카드로 분리하여 시각적 구분 강화
// ============================================================
export function GuestSnapSample1() {
  const photoTips = [
    { icon: Heart, text: '웃고 있는 저희 둘' },
    { icon: Film, text: '걸어가는 모습 (몰카 환영)' },
    { icon: Users, text: '소중한 분들과 함께한 컷' },
    { icon: Smile, text: '여러분의 예쁜 얼굴도요!' },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border-light)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <Camera className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              Guest Snap
            </span>
          </div>

          <p
            className="text-lg mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            저희의 스냅 작가님이 되어주세요!
          </p>

          <p
            className="text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
          >
            여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
          <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Tips Title */}
        <p
          className="text-center text-sm mb-4"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
        >
          이런 사진이면 완벽해요
        </p>

        {/* Photo Tips - Individual Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {photoTips.map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: 'var(--color-secondary)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <tip.icon
                className="w-6 h-6 mx-auto mb-2"
                style={{ color: 'var(--color-primary)' }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
              >
                {tip.text}
              </p>
            </div>
          ))}
        </div>

        {/* Reward Section */}
        <div
          className="p-4 rounded-xl mb-6 text-center"
          style={{
            backgroundColor: 'var(--color-botanical-light)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <Gift className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
          >
            찐 베스트컷 보내주시면 밥 쏩니다!
          </p>
        </div>

        {/* CTA */}
        <p
          className="text-center text-sm mb-4"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          아래 버튼 누르면 바로 공유 가능!
        </p>

        {/* Button Placeholder */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Share2 className="w-4 h-4" />
            사진 공유하기
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 2: 전체 중앙 정렬 + 세로 흐름형
// 특징: 모든 요소를 중앙 정렬하고 세로로 자연스럽게 흐르게 배치
// ============================================================
export function GuestSnapSample2() {
  return (
    <div className="text-center">
      {/* Icon */}
      <div
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-botanical-light), var(--color-secondary))',
          border: '2px solid var(--color-primary)',
        }}
      >
        <Camera className="w-9 h-9" style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Main Message */}
      <div className="mb-8">
        <p
          className="text-xl mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          저희의 스냅 작가님이 되어주세요!
        </p>
        <p
          className="text-[15px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
        >
          여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
        </p>
      </div>

      {/* Tips Section */}
      <div
        className="py-6 px-8 rounded-2xl mb-8"
        style={{ backgroundColor: 'var(--color-secondary)' }}
      >
        <p
          className="text-sm mb-4 flex items-center justify-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          이런 사진이면 완벽해요
        </p>

        <div className="space-y-2">
          {['웃고 있는 저희 둘', '걸어가는 모습 (몰카 환영)', '소중한 분들과 함께한 컷', '여러분의 예쁜 얼굴도요!'].map((tip, i) => (
            <p
              key={i}
              className="text-sm"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            >
              {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Reward */}
      <p
        className="text-sm mb-2 font-medium"
        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
      >
        찐 베스트컷 보내주시면 밥 쏩니다!
      </p>

      <p
        className="text-sm mb-6"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
      >
        아래 버튼 누르면 바로 공유 가능!
      </p>

      {/* Button */}
      <div
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          fontFamily: 'var(--font-body)',
        }}
      >
        <Share2 className="w-4 h-4" />
        사진 공유하기
      </div>
    </div>
  );
}


// ============================================================
// Sample 3: 구분선 섹션형
// 특징: 수평 구분선으로 각 섹션을 명확히 구분
// ============================================================
export function GuestSnapSample3() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      {/* Section 1: Header */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span style={{ color: 'var(--color-accent)' }}>-</span>
          <Camera className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          <span style={{ color: 'var(--color-accent)' }}>-</span>
        </div>
        <p
          className="text-lg"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          저희의 스냅 작가님이 되어주세요!
        </p>
      </div>

      {/* Divider */}
      <div className="h-px mx-6" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Section 2: Description */}
      <div className="p-6 text-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
        <p
          className="text-[15px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
        >
          여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
        </p>
      </div>

      {/* Divider */}
      <div className="h-px mx-6" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Section 3: Tips */}
      <div className="p-6">
        <p
          className="text-center text-sm mb-4 flex items-center justify-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
        >
          <Star className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          이런 사진이면 완벽해요
        </p>

        <div className="space-y-3 max-w-xs mx-auto">
          {['웃고 있는 저희 둘', '걸어가는 모습 (몰카 환영)', '소중한 분들과 함께한 컷', '여러분의 예쁜 얼굴도요!'].map((tip, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-6" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Section 4: Reward & CTA */}
      <div className="p-6 text-center" style={{ backgroundColor: 'var(--color-botanical-light)' }}>
        <p
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
        >
          찐 베스트컷 보내주시면 밥 쏩니다!
        </p>
        <p
          className="text-xs mb-4"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          아래 버튼 누르면 바로 공유 가능!
        </p>
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          <Share2 className="w-4 h-4" />
          사진 공유하기
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 4: 아이콘 리스트 강조형
// 특징: 각 리스트 아이템 앞에 개별 아이콘 배치로 시각적 흥미 추가
// ============================================================
export function GuestSnapSample4() {
  const photoTips = [
    { icon: Heart, text: '웃고 있는 저희 둘', color: 'var(--color-rose)' },
    { icon: Film, text: '걸어가는 모습 (몰카 환영)', color: 'var(--color-primary)' },
    { icon: Users, text: '소중한 분들과 함께한 컷', color: 'var(--color-groom)' },
    { icon: Smile, text: '여러분의 예쁜 얼굴도요!', color: 'var(--color-accent)' },
  ];

  return (
    <div
      className="rounded-2xl p-8"
      style={{
        backgroundColor: 'var(--color-secondary)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Camera className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
        <h3
          className="text-xl mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          저희의 스냅 작가님이 되어주세요!
        </h3>
        <p
          className="text-[15px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
        >
          여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
        </p>
      </div>

      {/* Tips with Icons */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <p
          className="text-center text-sm mb-5"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
        >
          이런 사진이면 완벽해요 ✨
        </p>

        <div className="space-y-4">
          {photoTips.map((tip, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${tip.color}15` }}
              >
                <tip.icon className="w-5 h-5" style={{ color: tip.color }} />
              </div>
              <p
                className="text-sm"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Banner */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-6"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
        }}
      >
        <Gift className="w-6 h-6 flex-shrink-0" />
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          찐 베스트컷 보내주시면 밥 쏩니다!
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          아래 버튼 누르면 바로 공유 가능!
        </p>
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
          style={{
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-primary)',
            border: '2px solid var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <Share2 className="w-4 h-4" />
          사진 공유하기
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 5: 말풍선 대화형
// 특징: 대화하는 느낌의 말풍선 디자인으로 친근한 느낌 연출
// ============================================================
export function GuestSnapSample5() {
  return (
    <div className="space-y-4">
      {/* Bubble 1 - Main Request */}
      <div className="flex justify-start">
        <div
          className="relative max-w-[85%] p-5 rounded-2xl rounded-bl-sm"
          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">신랑 & 신부</span>
          </div>
          <p className="text-[15px]" style={{ fontFamily: 'var(--font-body)' }}>
            저희의 스냅 작가님이 되어주세요!
          </p>
        </div>
      </div>

      {/* Bubble 2 - Description */}
      <div className="flex justify-end">
        <div
          className="relative max-w-[85%] p-5 rounded-2xl rounded-br-sm"
          style={{
            backgroundColor: 'var(--color-secondary)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <p
            className="text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
          </p>
        </div>
      </div>

      {/* Bubble 3 - Tips */}
      <div className="flex justify-start">
        <div
          className="relative max-w-[85%] p-5 rounded-2xl rounded-bl-sm"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            이런 사진이면 완벽해요 ✨
          </p>
          <div className="space-y-1.5">
            {['웃고 있는 저희 둘', '걸어가는 모습 (몰카 환영)', '소중한 분들과 함께한 컷', '여러분의 예쁜 얼굴도요!'].map((tip, i) => (
              <p
                key={i}
                className="text-sm flex items-center gap-2"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>•</span>
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bubble 4 - Reward */}
      <div className="flex justify-end">
        <div
          className="relative max-w-[85%] p-4 rounded-2xl rounded-br-sm"
          style={{ backgroundColor: 'var(--color-botanical-light)' }}
        >
          <p
            className="text-sm flex items-center gap-2"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
          >
            <Gift className="w-4 h-4" />
            찐 베스트컷 보내주시면 밥 쏩니다!
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="pt-4 text-center">
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          아래 버튼 누르면 바로 공유 가능!
        </p>
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          <Share2 className="w-4 h-4" />
          사진 공유하기
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 6: 스텝 진행형
// 특징: 번호가 붙은 스텝처럼 순서를 강조한 레이아웃
// ============================================================
export function GuestSnapSample6() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border-light)' }}
    >
      {/* Header */}
      <div
        className="p-6 text-center"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
      >
        <Camera className="w-8 h-8 mx-auto mb-3" />
        <h3 className="text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
          저희의 스냅 작가님이 되어주세요!
        </h3>
      </div>

      <div className="p-6">
        {/* Step 1 */}
        <div className="flex gap-4 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
            style={{ backgroundColor: 'var(--color-botanical-light)', color: 'var(--color-primary)' }}
          >
            1
          </div>
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            >
              앨범의 주인공이 되어주세요
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}
            >
              여러분이 찍어주신 사진으로 평생 간직할 앨범 만들 거예요!
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
            style={{ backgroundColor: 'var(--color-botanical-light)', color: 'var(--color-primary)' }}
          >
            2
          </div>
          <div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            >
              이런 사진이면 완벽해요 ✨
            </p>
            <div className="space-y-1">
              {['웃고 있는 저희 둘', '걸어가는 모습 (몰카 환영)', '소중한 분들과 함께한 컷', '여러분의 예쁜 얼굴도요!'].map((tip, i) => (
                <p
                  key={i}
                  className="text-sm flex items-center gap-2"
                  style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>-</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
            style={{ backgroundColor: 'var(--color-botanical-light)', color: 'var(--color-primary)' }}
          >
            3
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
            >
              찐 베스트컷 보내주시면 밥 쏩니다!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            아래 버튼 누르면 바로 공유 가능!
          </p>
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Share2 className="w-4 h-4" />
            사진 공유하기
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 7: 폴라로이드 스타일
// 특징: 폴라로이드 사진처럼 생긴 카드 디자인
// ============================================================
export function GuestSnapSample7() {
  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-sm p-4 pb-8"
        style={{
          backgroundColor: 'var(--color-white)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 8px 48px rgba(0,0,0,0.04)',
          transform: 'rotate(-1deg)',
        }}
      >
        {/* Photo Area */}
        <div
          className="aspect-square mb-4 rounded flex flex-col items-center justify-center p-6"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <Camera
            className="w-16 h-16 mb-4"
            style={{ color: 'var(--color-primary)', opacity: 0.6 }}
          />
          <p
            className="text-lg text-center mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            저희의 스냅 작가님이<br />되어주세요!
          </p>
          <p
            className="text-sm text-center"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
          >
            여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
          </p>
        </div>

        {/* Caption Area - Handwritten Style */}
        <div className="text-center">
          <p
            className="text-sm mb-3"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
          >
            이런 사진이면 완벽해요 ✨
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['웃는 모습', '몰카', '함께 찍은 컷', '셀카'].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--color-botanical-light)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <p
            className="text-xs mb-4"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
          >
            찐 베스트컷 보내주시면 밥 쏩니다!
          </p>

          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Share2 className="w-4 h-4" />
            공유하기
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 8: 미니멀 라인 스타일
// 특징: 얇은 라인과 여백을 활용한 미니멀한 디자인
// ============================================================
export function GuestSnapSample8() {
  return (
    <div className="py-4">
      {/* Top Line Decoration */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        <Camera className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      {/* Main Content */}
      <div className="text-center px-4">
        <p
          className="text-xl mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          저희의 스냅 작가님이 되어주세요
        </p>

        <p
          className="text-[15px] leading-loose mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
        >
          여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요
        </p>

        {/* Tips - Minimal List */}
        <div
          className="inline-block text-left mb-8 p-6"
          style={{ borderLeft: '2px solid var(--color-primary)' }}
        >
          <p
            className="text-xs uppercase tracking-wider mb-4"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-accent)' }}
          >
            Photo Guide
          </p>
          <div className="space-y-2">
            {['웃고 있는 저희 둘', '걸어가는 모습', '소중한 분들과 함께', '여러분의 예쁜 얼굴'].map((tip, i) => (
              <p
                key={i}
                className="text-sm"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
              >
                {tip}
              </p>
            ))}
          </div>
        </div>

        {/* Reward */}
        <p
          className="text-sm mb-2"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
        >
          베스트컷에는 특별한 선물이 있어요
        </p>
        <p
          className="text-xs mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
        >
          아래 버튼으로 바로 공유 가능
        </p>

        {/* Button */}
        <div
          className="inline-flex items-center gap-3 px-8 py-4 text-sm"
          style={{
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <Share2 className="w-4 h-4" />
          SHARE PHOTOS
        </div>
      </div>

      {/* Bottom Line Decoration */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
    </div>
  );
}


// ============================================================
// Sample 9: 그라데이션 배경형
// 특징: 부드러운 그라데이션 배경으로 시각적 깊이감 추가
// ============================================================
export function GuestSnapSample9() {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-botanical-light) 0%, var(--color-white) 50%, var(--color-secondary) 100%)',
      }}
    >
      <div className="p-8">
        {/* Icon with Glow */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-xl"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-white)' }}
          >
            <Camera className="w-9 h-9" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        {/* Main Text */}
        <div className="text-center mb-8">
          <h3
            className="text-xl mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            저희의 스냅 작가님이 되어주세요!
          </h3>
          <p
            className="text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
          >
            여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
          </p>
        </div>

        {/* Tips Card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <p
            className="text-center text-sm mb-4"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
          >
            이런 사진이면 완벽해요 ✨
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Heart, text: '웃고 있는 저희 둘' },
              { icon: Film, text: '몰카 환영' },
              { icon: Users, text: '함께한 컷' },
              { icon: Smile, text: '예쁜 얼굴' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span className="truncate">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reward */}
        <div className="text-center">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
          >
            찐 베스트컷 보내주시면 밥 쏩니다!
          </p>
          <p
            className="text-xs mb-5"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            아래 버튼 누르면 바로 공유 가능!
          </p>

          <div
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Share2 className="w-4 h-4" />
            사진 공유하기
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Sample 10: 필름 스트립 스타일
// 특징: 영화 필름 스트립 느낌의 레트로한 디자인
// ============================================================
export function GuestSnapSample10() {
  return (
    <div>
      {/* Film Strip Top */}
      <div className="flex justify-between px-2 mb-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-4 rounded-sm"
            style={{ backgroundColor: 'var(--color-text-muted)', opacity: 0.3 }}
          />
        ))}
      </div>

      {/* Main Frame */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--color-text)',
          padding: '12px',
        }}
      >
        {/* Inner Content */}
        <div
          className="rounded p-6"
          style={{ backgroundColor: 'var(--color-white)' }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
              <Camera className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
            </div>
            <h3
              className="text-lg mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              저희의 스냅 작가님이 되어주세요!
            </h3>
            <p
              className="text-sm"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}
            >
              여러분이 찍어주신 사진으로<br />평생 간직할 앨범 만들 거예요!
            </p>
          </div>

          {/* Film Frames for Tips */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { emoji: '😊', text: '웃는 모습' },
              { emoji: '🚶', text: '몰카' },
              { emoji: '👥', text: '함께 찍은 컷' },
              { emoji: '🤳', text: '예쁜 얼굴' },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded flex flex-col items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Reward & CTA */}
          <div
            className="text-center p-4 rounded"
            style={{ backgroundColor: 'var(--color-botanical-light)' }}
          >
            <p
              className="text-sm font-medium mb-1"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
            >
              찐 베스트컷 보내주시면 밥 쏩니다!
            </p>
            <p
              className="text-xs mb-3"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
            >
              아래 버튼 누르면 바로 공유 가능!
            </p>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </div>
          </div>
        </div>
      </div>

      {/* Film Strip Bottom */}
      <div className="flex justify-between px-2 mt-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-4 rounded-sm"
            style={{ backgroundColor: 'var(--color-text-muted)', opacity: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}


// ============================================================
// Preview Component - 모든 샘플을 한 번에 볼 수 있는 프리뷰
// ============================================================
export function GuestSnapSamplesPreview() {
  const samples = [
    { Component: GuestSnapSample1, name: '리스트 카드 분리형', description: '각 리스트 아이템을 개별 미니 카드로 분리' },
    { Component: GuestSnapSample2, name: '전체 중앙 정렬형', description: '모든 요소를 중앙 정렬하고 세로로 자연스럽게 흐름' },
    { Component: GuestSnapSample3, name: '구분선 섹션형', description: '수평 구분선으로 각 섹션을 명확히 구분' },
    { Component: GuestSnapSample4, name: '아이콘 리스트 강조형', description: '각 리스트 아이템 앞에 개별 아이콘 배치' },
    { Component: GuestSnapSample5, name: '말풍선 대화형', description: '대화하는 느낌의 말풍선 디자인으로 친근함 연출' },
    { Component: GuestSnapSample6, name: '스텝 진행형', description: '번호가 붙은 스텝처럼 순서를 강조' },
    { Component: GuestSnapSample7, name: '폴라로이드 스타일', description: '폴라로이드 사진처럼 생긴 카드 디자인' },
    { Component: GuestSnapSample8, name: '미니멀 라인 스타일', description: '얇은 라인과 여백을 활용한 미니멀 디자인' },
    { Component: GuestSnapSample9, name: '그라데이션 배경형', description: '부드러운 그라데이션 배경으로 깊이감 추가' },
    { Component: GuestSnapSample10, name: '필름 스트립 스타일', description: '영화 필름 스트립 느낌의 레트로한 디자인' },
  ];

  return (
    <div className="space-y-16 py-8">
      {samples.map(({ Component, name, description }, index) => (
        <div key={index} className="max-w-md mx-auto px-4">
          <div className="mb-4 text-center">
            <h3
              className="text-lg font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Sample {index + 1}: {name}
            </h3>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {description}
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <Component />
          </div>
        </div>
      ))}
    </div>
  );
}
