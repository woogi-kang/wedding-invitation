import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SectionDataInsert } from "@/types/saas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/invitations/[id]/sections — 섹션 데이터 조회
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("section_data")
    .select("*")
    .eq("invitation_id", id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT /api/invitations/[id]/sections — 섹션 데이터 일괄 저장 (upsert)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  // 청첩장 소유권 확인
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (invError || !invitation) {
    return NextResponse.json(
      { error: "청첩장을 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  const body = await request.json();
  const sections: SectionDataInsert[] = body.sections;

  if (!Array.isArray(sections)) {
    return NextResponse.json(
      { error: "sections 배열이 필요합니다" },
      { status: 400 },
    );
  }

  // invitation_id 강제 설정
  const sectionsWithId = sections.map((section) => ({
    ...section,
    invitation_id: id,
  }));

  // upsert: invitation_id + section_type 기준으로 충돌 시 업데이트
  const { data, error } = await supabase
    .from("section_data")
    // @ts-expect-error — @supabase/ssr@0.6.1 / supabase-js@2.101.1 version mismatch
    .upsert(sectionsWithId, {
      onConflict: "invitation_id,section_type",
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
