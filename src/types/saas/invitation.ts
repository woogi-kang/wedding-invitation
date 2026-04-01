import type { Database } from './database'

// DB Row 타입 추출
export type Invitation = Database['public']['Tables']['invitations']['Row']
export type InvitationInsert = Database['public']['Tables']['invitations']['Insert']
export type InvitationUpdate = Database['public']['Tables']['invitations']['Update']

export type InvitationStatus = Database['public']['Enums']['invitation_status']
export type InvitationTier = Database['public']['Enums']['invitation_tier']

// 섹션 설정 (sections_config JSONB 구조)
export interface SectionConfig {
  type: SectionType
  enabled: boolean
  sortOrder: number
}

// 섹션 타입 enum
export type SectionType =
  | 'hero'
  | 'greeting'
  | 'coupleIntro'
  | 'gallery'
  | 'weddingInfo'
  | 'location'
  | 'account'
  | 'share'
  | 'video'
  | 'footer'
  | 'interview'
  | 'timeline'
  | 'guestsnap'
  | 'musicPlayer'
  | 'mouseTrail'
  | 'rsvp'
  | 'guestbook'
  | 'terminalIntro'
  | 'arcadeMode'
  | 'afterparty'

// 섹션 데이터 (section_data 테이블)
export type SectionData = Database['public']['Tables']['section_data']['Row']
export type SectionDataInsert = Database['public']['Tables']['section_data']['Insert']
export type SectionDataUpdate = Database['public']['Tables']['section_data']['Update']

// 계좌 정보 (JSONB 내부 구조)
export interface AccountInfo {
  bank: string
  accountNumber: string
  holder: string
}

// 테마 설정 (theme_config JSONB 구조)
export interface ThemeConfig {
  primaryColor?: string
  fontFamily?: string
  backgroundImage?: string
  customCss?: string
}

// 청첩장 + 섹션 데이터 포함 (조회용)
export interface InvitationWithSections extends Invitation {
  section_data: SectionData[]
}
