'use client';

import { useCallback, useState, useRef } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  hint,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        // TODO: Vercel Blob / Supabase Storage 업로드 연동
        // 현재는 로컬 프리뷰 URL 생성
        const url = URL.createObjectURL(file);

        // 업로드 시뮬레이션
        for (let i = 0; i <= 100; i += 20) {
          setProgress(i);
          await new Promise((r) => setTimeout(r, 100));
        }

        onChange(url);
      } catch {
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (value) {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt={label || '업로드 이미지'} className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-md text-xs font-medium"
            >
              변경
            </button>
            <button
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium"
            >
              삭제
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-rose-400 bg-rose-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
        `}
      >
        {uploading ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">업로드 중...</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-sm text-gray-500">클릭 또는 드래그 앤 드롭</p>
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />
    </div>
  );
}
