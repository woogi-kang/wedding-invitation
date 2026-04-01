import type { Database } from './database'

export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert']

// 이벤트 타입 상수
export type AnalyticsEventType =
  | 'view'
  | 'share'
  | 'section_view'
  | 'rsvp_submit'
  | 'account_copy'
  | 'location_click'
  | 'guestsnap_upload'
