'use client';

import type { ShuttleInfo } from '@/types/editor';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function LocationForm({ data, onChange }: Props) {
  const shuttles = (data.shuttles as ShuttleInfo[]) || [];

  const addShuttle = () => {
    onChange({ shuttles: [...shuttles, { departure: '', timeStart: '', timeEnd: '', interval: '' }] });
  };

  const updateShuttle = (index: number, field: keyof ShuttleInfo, value: string) => {
    const next = shuttles.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onChange({ shuttles: next });
  };

  const removeShuttle = (index: number) => {
    onChange({ shuttles: shuttles.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          예식장명 <span className="text-rose-500">*</span>
        </label>
        <input type="text" value={(data.venueName as string) || ''} onChange={(e) => onChange({ venueName: e.target.value })}
          placeholder="예: 서울 라마다 호텔" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">홀/층</label>
        <input type="text" value={(data.hall as string) || ''} onChange={(e) => onChange({ hall: e.target.value })}
          placeholder="예: 14층 하늘정원" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소 <span className="text-rose-500">*</span>
        </label>
        <input type="text" value={(data.address as string) || ''} onChange={(e) => onChange({ address: e.target.value })}
          placeholder="도로명 주소를 입력해주세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
        <p className="text-xs text-gray-400 mt-1">TODO: 카카오 주소 검색 API 연동 예정</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
        <input type="tel" value={(data.tel as string) || ''} onChange={(e) => onChange({ tel: e.target.value })}
          placeholder="02-0000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">네이버 지도 URL</label>
          <input type="url" value={(data.naverMapUrl as string) || ''} onChange={(e) => onChange({ naverMapUrl: e.target.value })}
            placeholder="https://map.naver.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카카오맵 URL</label>
          <input type="url" value={(data.kakaoMapUrl as string) || ''} onChange={(e) => onChange({ kakaoMapUrl: e.target.value })}
            placeholder="https://map.kakao.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">주차 안내</label>
        <textarea value={(data.parking as string) || ''} onChange={(e) => onChange({ parking: e.target.value })}
          rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">지하철 안내</label>
        <textarea value={(data.subway as string) || ''} onChange={(e) => onChange({ subway: e.target.value })}
          rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">버스 안내</label>
        <textarea value={(data.bus as string) || ''} onChange={(e) => onChange({ bus: e.target.value })}
          rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none" />
      </div>

      {/* 셔틀버스 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">셔틀버스</label>
        {shuttles.map((shuttle, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 mb-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">셔틀 {i + 1}</span>
              <button onClick={() => removeShuttle(i)} className="text-xs text-red-500 hover:underline">삭제</button>
            </div>
            <input type="text" value={shuttle.departure} onChange={(e) => updateShuttle(i, 'departure', e.target.value)}
              placeholder="출발지 (예: 신도림역 1번 출구)" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
            <div className="grid grid-cols-3 gap-2">
              <input type="time" value={shuttle.timeStart} onChange={(e) => updateShuttle(i, 'timeStart', e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm outline-none" />
              <input type="time" value={shuttle.timeEnd} onChange={(e) => updateShuttle(i, 'timeEnd', e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm outline-none" />
              <input type="text" value={shuttle.interval} onChange={(e) => updateShuttle(i, 'interval', e.target.value)}
                placeholder="간격" className="px-2 py-1.5 border border-gray-300 rounded text-sm outline-none" />
            </div>
          </div>
        ))}
        <button onClick={addShuttle} className="text-sm text-rose-500 hover:underline">+ 셔틀 추가</button>
      </div>
    </div>
  );
}
