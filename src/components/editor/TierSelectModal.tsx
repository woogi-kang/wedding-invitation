'use client';

import { useEditorStore } from '@/stores/editor-store';
import type { Tier } from '@/types/editor';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIERS: { tier: Tier; name: string; price: string; features: string[] }[] = [
  {
    tier: 'basic',
    name: 'Basic',
    price: '19,000',
    features: ['기본 섹션 15개', '갤러리 20장', 'URL 발급', '카카오톡 공유'],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: '39,000',
    features: ['Basic 전체 포함', '웨딩 인터뷰', '타임라인', 'RSVP/방명록', 'BGM', '갤러리 50장', '3D 효과'],
  },
  {
    tier: 'arcade',
    name: 'Arcade',
    price: '49,000',
    features: ['Premium 전체 포함', 'RPG 게임 청첩장', '터미널 인트로', '하객 참여형 게임'],
  },
];

export default function TierSelectModal({ open, onClose }: Props) {
  const { selectedTier, setSelectedTier } = useEditorStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">티어 선택</h2>
          <p className="text-sm text-gray-500 mt-1">필요한 기능에 맞는 플랜을 선택하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map(({ tier, name, price, features }) => (
            <div
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedTier === tier
                  ? 'border-rose-500 bg-rose-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {tier === 'premium' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-medium rounded-full">
                  인기
                </span>
              )}
              {tier === 'arcade' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full">
                  유일무이
                </span>
              )}

              <h3 className="text-sm font-bold text-gray-900">{name}</h3>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {price}<span className="text-xs font-normal text-gray-500">원</span>
              </p>

              <ul className="mt-3 space-y-1.5">
                {features.map((f) => (
                  <li key={f} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {selectedTier === tier && (
                <div className="mt-3 text-center">
                  <span className="text-xs font-medium text-rose-600">선택됨</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            닫기
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors">
            결제하기
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          결제는 URL 발급 시점에 진행됩니다. 에디터는 무료로 사용 가능합니다.
        </p>
      </div>
    </div>
  );
}
