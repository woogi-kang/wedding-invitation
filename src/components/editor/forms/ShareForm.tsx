'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function ShareForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">카카오톡 공유</p>
          <p className="text-xs text-gray-400">카카오톡으로 청첩장 공유</p>
        </div>
        <button
          onClick={() => onChange({ kakaoEnabled: !data.kakaoEnabled })}
          className={`relative w-9 h-5 rounded-full transition-colors ${data.kakaoEnabled !== false ? 'bg-rose-500' : 'bg-gray-300'}`}
          role="switch" aria-checked={data.kakaoEnabled !== false}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${data.kakaoEnabled !== false ? 'translate-x-4' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">URL 복사</p>
          <p className="text-xs text-gray-400">링크를 클립보드에 복사</p>
        </div>
        <button
          onClick={() => onChange({ urlCopyEnabled: !data.urlCopyEnabled })}
          className={`relative w-9 h-5 rounded-full transition-colors ${data.urlCopyEnabled !== false ? 'bg-rose-500' : 'bg-gray-300'}`}
          role="switch" aria-checked={data.urlCopyEnabled !== false}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${data.urlCopyEnabled !== false ? 'translate-x-4' : ''}`} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">신랑 연락처</label>
        <input type="tel" value={(data.groomPhone as string) || ''} onChange={(e) => onChange({ groomPhone: e.target.value })}
          placeholder="010-0000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">신부 연락처</label>
        <input type="tel" value={(data.bridePhone as string) || ''} onChange={(e) => onChange({ bridePhone: e.target.value })}
          placeholder="010-0000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>
    </div>
  );
}
