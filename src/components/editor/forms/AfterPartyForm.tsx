'use client';

import type { AfterPartyPlace } from '@/types/editor';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const CATEGORIES = ['뒤풀이', '맛집 추천', '카페', '숙소', '기타'];

export default function AfterPartyForm({ data, onChange }: Props) {
  const places = (data.places as AfterPartyPlace[]) || [];
  const maxPlaces = 10;

  const updatePlace = (index: number, field: keyof AfterPartyPlace, value: string) => {
    const next = places.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange({ places: next });
  };

  const addPlace = () => {
    if (places.length >= maxPlaces) return;
    onChange({ places: [...places, { category: '뒤풀이', name: '', time: '', comment: '', url: '' }] });
  };

  const removePlace = (index: number) => {
    onChange({ places: places.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">노출 시작 시간</label>
        <input type="datetime-local" value={(data.showAfter as string) || ''} onChange={(e) => onChange({ showAfter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
        <p className="text-xs text-gray-400 mt-1">이 시간 이후 자동으로 노출됩니다</p>
      </div>

      <p className="text-xs text-gray-500">장소 ({places.length}/{maxPlaces})</p>

      {places.map((place, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">장소 {i + 1}</span>
            <button onClick={() => removePlace(i)} className="text-xs text-red-500 hover:underline">삭제</button>
          </div>
          <select value={place.category} onChange={(e) => updatePlace(i, 'category', e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none">
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="text" value={place.name} onChange={(e) => updatePlace(i, 'name', e.target.value)}
            placeholder="장소명" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" value={place.time} onChange={(e) => updatePlace(i, 'time', e.target.value)}
            placeholder="시간 (예: 18시~)" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" value={place.comment} onChange={(e) => updatePlace(i, 'comment', e.target.value)}
            placeholder="한줄 코멘트" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="url" value={place.url} onChange={(e) => updatePlace(i, 'url', e.target.value)}
            placeholder="네이버/카카오 플레이스 URL" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
        </div>
      ))}

      {places.length < maxPlaces && (
        <button onClick={addPlace} className="w-full py-2 text-sm text-rose-500 border border-dashed border-rose-300 rounded-lg hover:bg-rose-50 transition-colors">
          + 장소 추가
        </button>
      )}
    </div>
  );
}
