'use client';

import type { InterviewItem } from '@/types/editor';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function InterviewForm({ data, onChange }: Props) {
  const items = (data.items as InterviewItem[]) || [];
  const maxItems = 6;

  const updateItem = (index: number, field: keyof InterviewItem, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ items: next });
  };

  const addItem = () => {
    if (items.length >= maxItems) return;
    onChange({ items: [...items, { question: '', groomAnswer: '', brideAnswer: '' }] });
  };

  const removeItem = (index: number) => {
    onChange({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">커플 인터뷰 Q&A ({items.length}/{maxItems})</p>

      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Q{i + 1}.</span>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-xs text-red-500 hover:underline">삭제</button>
            )}
          </div>

          <input
            type="text"
            value={item.question}
            onChange={(e) => updateItem(i, 'question', e.target.value)}
            placeholder="질문을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />

          <div>
            <label className="text-xs text-gray-500 mb-1 block">신랑 답변</label>
            <textarea
              value={item.groomAnswer}
              onChange={(e) => {
                if (e.target.value.length <= 300) updateItem(i, 'groomAnswer', e.target.value);
              }}
              rows={3}
              placeholder="신랑의 답변..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
            />
            <span className="text-[10px] text-gray-400">{item.groomAnswer.length}/300</span>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">신부 답변</label>
            <textarea
              value={item.brideAnswer}
              onChange={(e) => {
                if (e.target.value.length <= 300) updateItem(i, 'brideAnswer', e.target.value);
              }}
              rows={3}
              placeholder="신부의 답변..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
            />
            <span className="text-[10px] text-gray-400">{item.brideAnswer.length}/300</span>
          </div>
        </div>
      ))}

      {items.length < maxItems && (
        <button onClick={addItem} className="w-full py-2 text-sm text-rose-500 hover:text-rose-600 border border-dashed border-rose-300 rounded-lg hover:bg-rose-50 transition-colors">
          + 질문 추가
        </button>
      )}
    </div>
  );
}
