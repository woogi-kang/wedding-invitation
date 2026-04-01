import type { Database } from './database'

export type GuestSnapSession = Database['public']['Tables']['guestsnap_sessions']['Row']
export type GuestSnapSessionInsert = Database['public']['Tables']['guestsnap_sessions']['Insert']

export type GuestSnapFile = Database['public']['Tables']['guestsnap_files']['Row']
export type GuestSnapFileInsert = Database['public']['Tables']['guestsnap_files']['Insert']

export type GuestSnapFileType = Database['public']['Enums']['guestsnap_file_type']
export type GuestSnapFileStatus = Database['public']['Enums']['guestsnap_file_status']
