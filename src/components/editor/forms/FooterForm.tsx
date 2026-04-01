'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function FooterForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">저작권 문구</label>
        <input type="text" value="Made with WeddingCraft" disabled
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
        <p className="text-xs text-gray-400 mt-1">기본 문구는 변경할 수 없습니다</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">추가 문구</label>
        <input type="text" value={(data.customText as string) || ''} onChange={(e) => onChange({ customText: e.target.value })}
          placeholder="하단에 표시할 추가 문구 (선택)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>
    </div>
  );
}
