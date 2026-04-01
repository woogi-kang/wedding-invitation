'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function RsvpForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">RSVP 활성화</p>
          <p className="text-xs text-gray-400">하객이 참석 여부를 응답</p>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
        <input type="date" value={(data.deadline as string) || ''} onChange={(e) => onChange({ deadline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">추가 질문 (선택)</label>
        <input type="text" value={(data.customQuestion as string) || ''} onChange={(e) => onChange({ customQuestion: e.target.value })}
          placeholder="예: 알레르기가 있으신가요?" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>
    </div>
  );
}
