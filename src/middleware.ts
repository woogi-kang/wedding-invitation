import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // 보호된 라우트만 매칭 (정적 파일, 기존 청첩장 라우트 제외)
    '/dashboard/:path*',
    '/api/invitations/:path*',
  ],
}
