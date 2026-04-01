'use client';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function MusicForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BGM 파일</label>
        <input
          type="file"
          accept="audio/mpeg,audio/mp3"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 10 * 1024 * 1024) {
                alert('파일 크기는 10MB 이하여야 합니다.');
                return;
              }
              // TODO: 실제 업로드 연동
              onChange({ file: URL.createObjectURL(file) });
            }
          }}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
        />
        <p className="text-xs text-gray-400 mt-1">MP3, 최대 10MB</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">곡명</label>
        <input type="text" value={(data.songName as string) || ''} onChange={(e) => onChange({ songName: e.target.value })}
          placeholder="곡 제목" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">아티스트</label>
        <input type="text" value={(data.artist as string) || ''} onChange={(e) => onChange({ artist: e.target.value })}
          placeholder="아티스트명" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">자동재생</p>
          <p className="text-xs text-gray-400">브라우저 정책에 따라 제한될 수 있습니다</p>
        </div>
        <button
          onClick={() => onChange({ autoPlay: !data.autoPlay })}
          className={`relative w-9 h-5 rounded-full transition-colors ${data.autoPlay !== false ? 'bg-rose-500' : 'bg-gray-300'}`}
          role="switch" aria-checked={data.autoPlay !== false}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${data.autoPlay !== false ? 'translate-x-4' : ''}`} />
        </button>
      </div>
    </div>
  );
}
