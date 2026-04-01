'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function GreetingForm({ data, onChange }: Props) {
  const message = (data.message as string) || '';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          value={(data.title as string) || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="소중한 분들을 초대합니다"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">인사말 본문</label>
          <span className="text-xs text-gray-400">{message.length}/500</span>
        </div>
        <textarea
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= 500) onChange({ message: e.target.value });
          }}
          placeholder="따뜻한 인사말을 작성해주세요..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">줄바꿈은 그대로 반영됩니다</p>
      </div>
    </div>
  );
}
