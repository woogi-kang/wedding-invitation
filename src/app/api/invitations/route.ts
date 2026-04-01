import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDefaultSections } from "@/lib/saas/section-schema";
import type { InvitationInsert, InvitationTier } from "@/types/saas";

// GET /api/invitations — 내 청첩장 목록
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/invitations — 청첩장 생성
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const tier: InvitationTier = body.tier ?? "basic";

  // slug 생성: 타임스탬프 기반 고유 값
  const slug = body.slug ?? `wedding-${Date.now().toString(36)}`;

  const invitation: InvitationInsert = {
    user_id: user.id,
    slug,
    title: body.title ?? "",
    tier,
    wedding_date: body.wedding_date ?? null,
    venue_name: body.venue_name ?? null,
    venue_address: body.venue_address ?? null,
    venue_lat: body.venue_lat ?? null,
    venue_lng: body.venue_lng ?? null,
    groom_name: body.groom_name ?? null,
    bride_name: body.bride_name ?? null,
    groom_phone: body.groom_phone ?? null,
    bride_phone: body.bride_phone ?? null,
    groom_father: body.groom_father ?? null,
    groom_mother: body.groom_mother ?? null,
    bride_father: body.bride_father ?? null,
    bride_mother: body.bride_mother ?? null,
    groom_account: body.groom_account ?? [],
    bride_account: body.bride_account ?? [],
    sections_config: getDefaultSections(tier),
    theme_config: body.theme_config ?? {},
  };

  const { data, error } = await supabase
    .from("invitations")
    // @ts-expect-error — @supabase/ssr@0.6.1 / supabase-js@2.101.1 version mismatch
    .insert(invitation)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 사용 중인 slug입니다" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
