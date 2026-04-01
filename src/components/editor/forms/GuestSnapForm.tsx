'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function GuestSnapForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">게스트스냅 활성화</p>
          <p className="text-xs text-gray-400">하객이 사진을 공유할 수 있습니다</p>
        </div>
        <button
          onClick={() => onChange({ enabled: !data.enabled })}
          className={`relative w-9 h-5 rounded-full transition-colors ${data.enabled !== false ? 'bg-rose-500' : 'bg-gray-300'}`}
          role="switch" aria-checked={data.enabled !== false}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${data.enabled !== false ? 'translate-x-4' : ''}`} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">섹션 제목</label>
        <input type="text" value={(data.title as string) || ''} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="게스트스냅" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">안내 문구</label>
        <input type="text" value={(data.description as string) || ''} onChange={(e) => onChange({ description: e.target.value })}
          placeholder="저희의 순간을 함께 담아주세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">업로드 버튼 텍스트</label>
        <input type="text" value={(data.buttonText as string) || ''} onChange={(e) => onChange({ buttonText: e.target.value })}
          placeholder="사진 공유하기" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
        <p className="text-xs text-gray-400 mt-1">Premium 이상에서 커스텀 가능</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">완료 메시지</label>
        <input type="text" value={(data.completeMessage as string) || ''} onChange={(e) => onChange({ completeMessage: e.target.value })}
          placeholder="감사합니다" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>
    </div>
  );
}
