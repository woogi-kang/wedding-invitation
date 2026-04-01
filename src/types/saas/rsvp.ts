import type { Database } from './database'

export type RsvpResponse = Database['public']['Tables']['rsvp_responses']['Row']
export type RsvpResponseInsert = Database['public']['Tables']['rsvp_responses']['Insert']
export type RsvpResponseUpdate = Database['public']['Tables']['rsvp_responses']['Update']

export type RsvpAttending = Database['public']['Enums']['rsvp_attending']
