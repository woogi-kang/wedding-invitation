'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function TextInput({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

export default function CoupleIntroForm({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* 호칭 형식 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">호칭 형식</label>
        <select
          value={(data.titleFormat as string) || 'son-daughter'}
          onChange={(e) => onChange({ titleFormat: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
        >
          <option value="son-daughter">아들/딸</option>
          <option value="eldest">장남/장녀</option>
          <option value="custom">사용자 지정</option>
        </select>
      </div>

      {/* 신랑 정보 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">신랑측</h3>
        <div className="space-y-3">
          <TextInput label="신랑 이름" value={(data.groomName as string) || ''} onChange={(v) => onChange({ groomName: v })} required />
          <TextInput label="신랑 영문명" value={(data.groomEnglishName as string) || ''} onChange={(v) => onChange({ groomEnglishName: v })} placeholder="English Name" />
          <TextInput label="아버지 성함" value={(data.groomFather as string) || ''} onChange={(v) => onChange({ groomFather: v })} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="groomFatherDeceased" checked={!!data.groomFatherDeceased} onChange={(e) => onChange({ groomFatherDeceased: e.target.checked })} className="rounded" />
            <label htmlFor="groomFatherDeceased" className="text-xs text-gray-500">고인</label>
          </div>
          <TextInput label="어머니 성함" value={(data.groomMother as string) || ''} onChange={(v) => onChange({ groomMother: v })} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="groomMotherDeceased" checked={!!data.groomMotherDeceased} onChange={(e) => onChange({ groomMotherDeceased: e.target.checked })} className="rounded" />
            <label htmlFor="groomMotherDeceased" className="text-xs text-gray-500">고인</label>
          </div>
        </div>
      </div>

      {/* 신부 정보 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">신부측</h3>
        <div className="space-y-3">
          <TextInput label="신부 이름" value={(data.brideName as string) || ''} onChange={(v) => onChange({ brideName: v })} required />
          <TextInput label="신부 영문명" value={(data.brideEnglishName as string) || ''} onChange={(v) => onChange({ brideEnglishName: v })} placeholder="English Name" />
          <TextInput label="아버지 성함" value={(data.brideFather as string) || ''} onChange={(v) => onChange({ brideFather: v })} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="brideFatherDeceased" checked={!!data.brideFatherDeceased} onChange={(e) => onChange({ brideFatherDeceased: e.target.checked })} className="rounded" />
            <label htmlFor="brideFatherDeceased" className="text-xs text-gray-500">고인</label>
          </div>
          <TextInput label="어머니 성함" value={(data.brideMother as string) || ''} onChange={(v) => onChange({ brideMother: v })} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="brideMotherDeceased" checked={!!data.brideMotherDeceased} onChange={(e) => onChange({ brideMotherDeceased: e.target.checked })} className="rounded" />
            <label htmlFor="brideMotherDeceased" className="text-xs text-gray-500">고인</label>
          </div>
        </div>
      </div>
    </div>
  );
}
