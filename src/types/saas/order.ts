import type { Database } from './database'

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type PaymentStatus = Database['public']['Enums']['payment_status']
export type Tier = Database['public']['Enums']['invitation_tier']
