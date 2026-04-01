'use client';

import { useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function GalleryForm({ data, onChange }: Props) {
  const { selectedTier } = useEditorStore();
  const photos = (data.photos as string[]) || [];
  const maxPhotos = selectedTier === 'basic' ? 20 : 50;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = useCallback(
    (files: FileList) => {
      const remaining = maxPhotos - photos.length;
      const newFiles = Array.from(files).slice(0, remaining);
      // TODO: 실제 업로드 연동
      const newUrls = newFiles.map((f) => URL.createObjectURL(f));
      onChange({ photos: [...photos, ...newUrls] });
    },
    [photos, maxPhotos, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const next = photos.filter((_, i) => i !== index);
      onChange({ photos: next });
    },
    [photos, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          갤러리 ({photos.length}/{maxPhotos}장)
        </label>
        {selectedTier === 'basic' && (
          <span className="text-[10px] text-gray-400">Premium 이상: 50장</span>
        )}
      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
            <img src={url} alt={`갤러리 사진 ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              x
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-rose-400 flex flex-col items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] mt-1">추가</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => e.target.files && handleAddPhotos(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-gray-400">드래그로 순서 변경 (추후 지원)</p>
    </div>
  );
}
