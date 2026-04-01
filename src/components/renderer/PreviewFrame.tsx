'use client';

import { useRef, useState } from 'react';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';
import { InvitationRenderer } from './InvitationRenderer';
import type { SectionConfig, InvitationConfig } from './types';

interface PreviewFrameProps {
  sections: SectionConfig[];
  sectionData: Record<string, unknown>;
  config: InvitationConfig;
}

type DeviceMode = 'mobile' | 'desktop';

const DEVICE_SIZES = {
  mobile: { width: 375, height: 812, label: 'iPhone' },
  desktop: { width: 1280, height: 800, label: 'Desktop' },
} as const;

/**
 * iPhone 프레임 UI로 InvitationRenderer를 감싸는 미리보기 컴포넌트
 * 에디터에서 실시간 미리보기에 사용
 */
export function PreviewFrame({ sections, sectionData, config }: PreviewFrameProps) {
  const [device, setDevice] = useState<DeviceMode>('mobile');
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDevice = DEVICE_SIZES[device];

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 디바이스 선택 툴바 */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => setDevice('mobile')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
            device === 'mobile'
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          Mobile
        </button>
        <button
          onClick={() => setDevice('desktop')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
            device === 'desktop'
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          Desktop
        </button>
        <div className="mx-1 h-4 w-px bg-gray-200" />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          title="미리보기 새로고침"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] text-gray-400 px-1">
          {currentDevice.width} x {currentDevice.height}
        </span>
      </div>

      {/* 프레임 컨테이너 */}
      <div
        ref={containerRef}
        className="relative transition-all duration-300 ease-in-out"
        style={{
          width: device === 'mobile' ? currentDevice.width : '100%',
          maxWidth: currentDevice.width,
        }}
      >
        {/* 디바이스 프레임 */}
        {device === 'mobile' ? (
          // iPhone 스타일 프레임
          <div
            className="relative rounded-[3rem] border-[8px] border-gray-800 bg-gray-800 shadow-2xl"
            style={{ aspectRatio: `${currentDevice.width}/${currentDevice.height}` }}
          >
            {/* 노치 */}
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
              <div className="h-6 w-32 rounded-b-2xl bg-gray-800" />
            </div>

            {/* 하단 홈 인디케이터 */}
            <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
              <div className="h-1 w-28 rounded-full bg-gray-600" />
            </div>

            {/* 스크롤 컨텐츠 영역 */}
            <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-[2.4rem] bg-white">
              <div key={key}>
                <InvitationRenderer
                  sections={sections}
                  sectionData={sectionData}
                  config={config}
                />
              </div>
            </div>
          </div>
        ) : (
          // 데스크탑 브라우저 프레임
          <div className="rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden">
            {/* 브라우저 탑바 */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-500">
                  weddingcraft.app/invitation/{config.slug}
                </div>
              </div>
            </div>

            {/* 컨텐츠 */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: currentDevice.height }}
            >
              <div key={key}>
                <InvitationRenderer
                  sections={sections}
                  sectionData={sectionData}
                  config={config}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
