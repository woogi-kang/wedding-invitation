'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';

export default function OnboardingSteps() {
  const { completeOnboarding } = useEditorStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    venueName: '',
  });

  const handleNext = () => {
    if (step === 0) {
      if (!formData.groomName || !formData.brideName) {
        alert('신랑, 신부 이름을 입력해주세요.');
        return;
      }
      setStep(1);
    } else {
      if (!formData.weddingDate) {
        alert('결혼식 날짜를 입력해주세요.');
        return;
      }
      completeOnboarding(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* 진행 표시 */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full ${step >= 0 ? 'bg-rose-500' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-gray-200'}`} />
        </div>

        {/* 로고 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">WeddingCraft</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 0 ? '먼저 기본 정보를 알려주세요' : '결혼식 정보를 입력해주세요'}
          </p>
        </div>

        {step === 0 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                신랑 이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                placeholder="홍길동"
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                신부 이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                placeholder="김영희"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                결혼식 날짜 <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예식장</label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="예식장 이름 (나중에 입력 가능)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors"
          >
            {step === 1 ? '에디터 시작하기' : '다음'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          나머지 정보는 에디터에서 편집할 수 있어요
        </p>
      </div>
    </div>
  );
}
