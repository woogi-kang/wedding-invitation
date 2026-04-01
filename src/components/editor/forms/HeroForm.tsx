'use client';

import ImageUploader from '../ImageUploader';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function HeroForm({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <ImageUploader
        label="신랑 사진 (데스크탑 좌측)"
        value={(data.groomPhoto as string) || ''}
        onChange={(url) => onChange({ groomPhoto: url })}
        hint="권장: 가로 1200px 이상"
      />

      <ImageUploader
        label="신부 사진 (데스크탑 우측)"
        value={(data.bridePhoto as string) || ''}
        onChange={(url) => onChange({ bridePhoto: url })}
        hint="권장: 가로 1200px 이상"
      />

      <ImageUploader
        label="커플 사진 (모바일 전체 배경)"
        value={(data.couplePhoto as string) || ''}
        onChange={(url) => onChange({ couplePhoto: url })}
        hint="권장: 세로형 1080x1920"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">표시 문구</label>
        <input
          type="text"
          value={(data.displayText as string) || ''}
          onChange={(e) => onChange({ displayText: e.target.value })}
          placeholder="우리 결혼합니다"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">날짜 표시 형식</label>
        <select
          value={(data.dateFormat as string) || 'korean'}
          onChange={(e) => onChange({ dateFormat: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
        >
          <option value="korean">2026.04.05</option>
          <option value="english">April 5, 2026</option>
          <option value="custom">사용자 지정</option>
        </select>
      </div>
    </div>
  );
}
