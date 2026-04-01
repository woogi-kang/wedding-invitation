'use client';

import type { AccountEntry } from '@/types/editor';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const BANKS = [
  '카카오뱅크', '토스뱅크', '국민은행', '신한은행', '우리은행', '하나은행',
  'NH농협', '기업은행', 'SC제일은행', '씨티은행', '케이뱅크', '새마을금고',
  '우체국', '신협', '수협', '대구은행', '부산은행', '경남은행', '광주은행',
  '전북은행', '제주은행',
];

function AccountGroup({ label, accounts, onUpdate }: {
  label: string;
  accounts: AccountEntry[];
  onUpdate: (accounts: AccountEntry[]) => void;
}) {
  const titles = ['본인', '아버지', '어머니'];

  const updateAccount = (index: number, field: keyof AccountEntry, value: string) => {
    const next = accounts.map((a, i) => (i === index ? { ...a, [field]: value } : a));
    onUpdate(next);
  };

  const addAccount = () => {
    if (accounts.length >= 3) return;
    onUpdate([...accounts, { bank: '', number: '', holder: '' }]);
  };

  const removeAccount = (index: number) => {
    onUpdate(accounts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b">{label}</h3>
      {accounts.map((account, i) => (
        <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{titles[i] || `계좌 ${i + 1}`}</span>
            {i > 0 && (
              <button onClick={() => removeAccount(i)} className="text-xs text-red-500 hover:underline">삭제</button>
            )}
          </div>
          <select
            value={account.bank}
            onChange={(e) => updateAccount(i, 'bank', e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none"
          >
            <option value="">은행 선택</option>
            {BANKS.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
          <input
            type="text"
            value={account.number}
            onChange={(e) => updateAccount(i, 'number', e.target.value)}
            placeholder="계좌번호"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none"
          />
          <input
            type="text"
            value={account.holder}
            onChange={(e) => updateAccount(i, 'holder', e.target.value)}
            placeholder="예금주"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none"
          />
        </div>
      ))}
      {accounts.length < 3 && (
        <button onClick={addAccount} className="text-sm text-rose-500 hover:underline">+ 계좌 추가</button>
      )}
    </div>
  );
}

export default function AccountForm({ data, onChange }: Props) {
  const groomAccounts = (data.groomAccounts as AccountEntry[]) || [{ bank: '', number: '', holder: '' }];
  const brideAccounts = (data.brideAccounts as AccountEntry[]) || [{ bank: '', number: '', holder: '' }];

  return (
    <div className="space-y-6">
      <AccountGroup
        label="신랑측"
        accounts={groomAccounts}
        onUpdate={(accounts) => onChange({ groomAccounts: accounts })}
      />
      <AccountGroup
        label="신부측"
        accounts={brideAccounts}
        onUpdate={(accounts) => onChange({ brideAccounts: accounts })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">카카오페이 송금 링크</label>
        <input
          type="url"
          value={(data.kakaoPayUrl as string) || ''}
          onChange={(e) => onChange({ kakaoPayUrl: e.target.value })}
          placeholder="https://qr.kakaopay.com/..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}
