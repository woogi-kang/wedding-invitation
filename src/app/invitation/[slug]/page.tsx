import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InvitationRenderer } from '@/components/renderer/InvitationRenderer';
import type { SectionConfig, InvitationConfig } from '@/components/renderer/types';

// ============================================
// Supabase 데이터 조회 (임시 구현)
// Foundation 워커의 Supabase 클라이언트가 준비되면 교체
// ============================================

interface InvitationRow {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  template_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  venue_name: string;
  og_image_url: string | null;
  section_configs: SectionConfig[];
  section_data: Record<string, unknown>;
  theme_config: Record<string, unknown> | null;
  music_config: Record<string, unknown> | null;
}

async function getInvitation(slug: string): Promise<InvitationRow | null> {
  // TODO: Supabase 클라이언트로 교체
  // const supabase = createServerClient();
  // const { data, error } = await supabase
  //   .from('invitations')
  //   .select('*')
  //   .eq('slug', slug)
  //   .eq('status', 'published')
  //   .single();
  // if (error || !data) return null;
  // return data;

  // 임시: null 반환 (Supabase 연동 전)
  return null;
}

async function recordViewEvent(_invitationId: string): Promise<void> {
  // TODO: Supabase analytics_events에 view 이벤트 기록
  // const supabase = createServerClient();
  // await supabase.from('analytics_events').insert({
  //   invitation_id: invitationId,
  //   event_type: 'view',
  //   created_at: new Date().toISOString(),
  //   user_agent: headers().get('user-agent'),
  //   referer: headers().get('referer'),
  // });
}

// ============================================
// 동적 메타데이터 생성 (SEO + OG)
// ============================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  if (!invitation) {
    return { title: '청첩장을 찾을 수 없습니다' };
  }

  const title = `${invitation.groom_name} ♥ ${invitation.bride_name} 결혼합니다`;
  const description = `${invitation.wedding_date} | ${invitation.venue_name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: invitation.og_image_url ? [{ url: invitation.og_image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ============================================
// 페이지 컴포넌트 (SSR)
// ============================================

export default async function DynamicInvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  // published 상태만 접근 가능
  if (!invitation || invitation.status !== 'published') {
    notFound();
  }

  // 조회 이벤트 기록 (비동기, 렌더링 블로킹하지 않음)
  recordViewEvent(invitation.id);

  const config: InvitationConfig = {
    slug: invitation.slug,
    status: invitation.status,
    template_id: invitation.template_id,
    theme: invitation.theme_config as unknown as InvitationConfig['theme'],
    music: invitation.music_config as unknown as InvitationConfig['music'],
  };

  return (
    <InvitationRenderer
      sections={invitation.section_configs}
      sectionData={invitation.section_data}
      config={config}
    />
  );
}
