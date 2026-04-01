'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function WeddingInfoForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          결혼식 날짜 <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          value={(data.date as string) || ''}
          onChange={(e) => onChange({ date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          결혼식 시간 <span className="text-rose-500">*</span>
        </label>
        <input
          type="time"
          value={(data.time as string) || ''}
          onChange={(e) => onChange({ time: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">식사 안내</label>
        <textarea
          value={(data.mealInfo as string) || ''}
          onChange={(e) => onChange({ mealInfo: e.target.value })}
          placeholder="예: 뷔페로 준비되어 있습니다"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">추가 안내사항</label>
        <textarea
          value={(data.additionalInfo as string) || ''}
          onChange={(e) => onChange({ additionalInfo: e.target.value })}
          placeholder="추가로 안내할 사항을 작성해주세요"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
        />
      </div>
    </div>
  );
}
