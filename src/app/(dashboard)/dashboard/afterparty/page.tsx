'use client';

import { useState } from 'react';
import {
  Beer,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Camera,
  CircleDot,
  GripVertical,
  MapPin,
  Edit3,
  Trash2,
  Plus,
  X,
  Clock,
} from 'lucide-react';
import { MOCK_AFTERPARTY_PLACES } from '@/lib/dashboard/mock-data';
import type { AfterPartyPlace, PlaceCategory } from '@/types/dashboard';

const categoryConfig: Record<
  PlaceCategory,
  { icon: typeof Beer; label: string; color: string }
> = {
  afterparty: { icon: Beer, label: 'AfterParty', color: '#f59e0b' },
  restaurant: { icon: UtensilsCrossed, label: '맛집', color: '#ef4444' },
  cafe: { icon: Coffee, label: '카페', color: '#8b5cf6' },
  attraction: { icon: Sparkles, label: '명소', color: '#3b82f6' },
  photospot: { icon: Camera, label: '포토스팟', color: '#ec4899' },
  other: { icon: CircleDot, label: '기타', color: '#6b7280' },
};

interface PlaceForm {
  category: PlaceCategory;
  name: string;
  time: string;
  description: string;
  mapUrl: string;
}

const emptyForm: PlaceForm = {
  category: 'afterparty',
  name: '',
  time: '',
  description: '',
  mapUrl: '',
};

export default function AfterPartyPage() {
  const [places, setPlaces] = useState<AfterPartyPlace[]>(MOCK_AFTERPARTY_PLACES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlaceForm>(emptyForm);

  // 자동 공개 시간 (예식일 기준)
  const autoRevealTime = '2026-04-05 13:00';

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (place: AfterPartyPlace) => {
    setEditingId(place.id);
    setForm({
      category: place.category,
      name: place.name,
      time: place.time || '',
      description: place.description,
      mapUrl: place.mapUrl,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...form, time: form.time || undefined }
            : p
        )
      );
    } else {
      const newPlace: AfterPartyPlace = {
        id: `ap_${Date.now()}`,
        ...form,
        time: form.time || undefined,
        order: places.length + 1,
      };
      setPlaces((prev) => [...prev, newPlace]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          AfterParty 관리
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            자동 공개: {autoRevealTime}
          </p>
        </div>
      </div>

      {/* 장소 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            장소 목록
          </h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-4 h-4" />
            장소 추가
          </button>
        </div>

        <div className="space-y-3">
          {places.map((place) => {
            const config = categoryConfig[place.category];
            const Icon = config.icon;
            return (
              <div
                key={place.id}
                className="flex items-start gap-3 p-4 rounded-lg border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* 드래그 핸들 (시각적) */}
                <div className="pt-1 cursor-grab">
                  <GripVertical
                    className="w-4 h-4"
                    style={{ color: 'var(--color-text-light)' }}
                  />
                </div>

                {/* 카테고리 아이콘 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {place.name}
                    </h3>
                    {place.time && (
                      <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {place.time}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    {place.description}
                  </p>
                  <a
                    href={place.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-1.5 hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <MapPin className="w-3 h-3" />
                    지도 보기
                  </a>
                </div>

                {/* 액션 */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(place)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit3
                      className="w-4 h-4"
                      style={{ color: 'var(--color-text-light)' }}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}

          {places.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                아직 등록된 장소가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 인라인 폼 */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              {editingId ? '장소 수정' : '새 장소 추가'}
            </h2>
            <button onClick={handleCancel} className="p-1">
              <X className="w-5 h-5" style={{ color: 'var(--color-text-light)' }} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                카테고리
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as PlaceCategory })
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                이름
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="장소 이름"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                시간 (선택)
              </label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="예: 18시~"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                설명
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="간단한 설명"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                지도 URL
              </label>
              <input
                type="url"
                value={form.mapUrl}
                onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {editingId ? '수정 완료' : '추가하기'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
