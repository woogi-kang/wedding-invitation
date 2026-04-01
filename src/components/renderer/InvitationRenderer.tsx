'use client';

import { useMemo } from 'react';
import { SectionRenderer } from './SectionRenderer';
import { transformSectionData } from '@/lib/renderer/data-transformer';
import type { SectionConfig, SectionType, InvitationConfig, SectionData } from './types';

interface InvitationRendererProps {
  sections: SectionConfig[];
  sectionData: Record<string, unknown>;
  config: InvitationConfig;
}

/**
 * 전체 청첩장 렌더링 컴포넌트
 * 활성화된 섹션만 sort_order 순으로 렌더링
 *
 * @example
 * <InvitationRenderer
 *   sections={sections}
 *   sectionData={sectionData}
 *   config={config}
 * />
 */
export function InvitationRenderer({ sections, sectionData, config }: InvitationRendererProps) {
  // 활성화된 섹션만 sort_order 순으로 정렬
  const activeSections = useMemo(() => {
    return sections
      .filter((s) => s.enabled)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [sections]);

  // 각 섹션의 데이터를 SectionData 형식으로 변환
  const renderedSections = useMemo(() => {
    return activeSections
      .map((sectionConfig) => {
        const rawData = sectionData[sectionConfig.type];
        if (!rawData) return null;

        const transformed = transformSectionData(
          sectionConfig.type,
          rawData as Record<string, unknown>,
        );
        if (!transformed) return null;

        return {
          key: sectionConfig.type,
          section: { type: sectionConfig.type, data: transformed } as unknown as SectionData,
        };
      })
      .filter(Boolean) as { key: SectionType; section: SectionData }[];
  }, [activeSections, sectionData]);

  return (
    <main className="min-h-screen main-content" data-invitation={config.slug}>
      {renderedSections.map(({ key, section }) => (
        <SectionRenderer key={key} section={section} />
      ))}
    </main>
  );
}
