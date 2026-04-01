'use client';

import type { TimelineItem } from '@/types/editor';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const ICONS = [
  { value: 'heart', label: 'Heart' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'party', label: 'Party' },
  { value: 'ring', label: 'Ring' },
  { value: 'star', label: 'Star' },
];

export default function TimelineForm({ data, onChange }: Props) {
  const items = (data.items as TimelineItem[]) || [];
  const maxItems = 8;

  const updateItem = (index: number, field: keyof TimelineItem, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ items: next });
  };

  const addItem = () => {
    if (items.length >= maxItems) return;
    onChange({ items: [...items, { date: '', title: '', description: '', icon: 'heart' }] });
  };

  const removeItem = (index: number) => {
    onChange({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">우리의 시간 ({items.length}/{maxItems})</p>

      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">이벤트 {i + 1}</span>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-xs text-red-500 hover:underline">삭제</button>
            )}
          </div>
          <input type="text" value={item.date} onChange={(e) => updateItem(i, 'date', e.target.value)}
            placeholder="예: 2022년 봄" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)}
            placeholder="제목" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)}
            placeholder="설명" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <select value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none">
            {ICONS.map((ic) => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
          </select>
        </div>
      ))}

      {items.length < maxItems && (
        <button onClick={addItem} className="w-full py-2 text-sm text-rose-500 border border-dashed border-rose-300 rounded-lg hover:bg-rose-50 transition-colors">
          + 이벤트 추가
        </button>
      )}
    </div>
  );
}
