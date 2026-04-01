'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function ArcadeForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">RPG 게임 청첩장 설정 (MVP: 캐릭터 이름만 설정)</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          신랑 캐릭터 이름 <span className="text-rose-500">*</span>
        </label>
        <input type="text" value={(data.groomCharacterName as string) || ''} onChange={(e) => onChange({ groomCharacterName: e.target.value })}
          placeholder="게임 내 표시될 이름" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          신부 캐릭터 이름 <span className="text-rose-500">*</span>
        </label>
        <input type="text" value={(data.brideCharacterName as string) || ''} onChange={(e) => onChange({ brideCharacterName: e.target.value })}
          placeholder="게임 내 표시될 이름" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">향후 업데이트 예정:</p>
        <ul className="text-xs text-gray-400 mt-1 space-y-0.5 list-disc list-inside">
          <li>캐릭터 외형 선택</li>
          <li>보스 캐릭터 설정</li>
          <li>스테이지별 대사 커스텀</li>
        </ul>
      </div>
    </div>
  );
}
