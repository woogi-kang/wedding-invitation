'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function GuestbookForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">방명록 활성화</p>
          <p className="text-xs text-gray-400">하객이 축하 메시지를 남길 수 있습니다</p>
        </div>
        <button
          onClick={() => onChange({ enabled: !data.enabled })}
          className={`relative w-9 h-5 rounded-full transition-colors ${data.enabled ? 'bg-rose-500' : 'bg-gray-300'}`}
          role="switch" aria-checked={!!data.enabled}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${data.enabled ? 'translate-x-4' : ''}`} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">안내 문구</label>
        <input type="text" value={(data.guidanceText as string) || ''} onChange={(e) => onChange({ guidanceText: e.target.value })}
          placeholder="축하의 메시지를 남겨주세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>
    </div>
  );
}
