import type { Database } from './database'

export type AfterPartyPlace = Database['public']['Tables']['afterparty_places']['Row']
export type AfterPartyPlaceInsert = Database['public']['Tables']['afterparty_places']['Insert']
export type AfterPartyPlaceUpdate = Database['public']['Tables']['afterparty_places']['Update']

export type AfterPartyCategory = Database['public']['Enums']['afterparty_category']
