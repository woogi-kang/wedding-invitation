// Supabase Database 타입 정의
// supabase gen types 명령으로 자동 생성할 수 있으나, 초기 구조 정의용으로 수동 작성

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          title: string;
          status: "draft" | "published" | "expired";
          tier: "basic" | "premium" | "arcade";
          sections_config: Json;
          theme_config: Json;
          wedding_date: string | null;
          venue_name: string | null;
          venue_address: string | null;
          venue_lat: number | null;
          venue_lng: number | null;
          groom_name: string | null;
          bride_name: string | null;
          groom_phone: string | null;
          bride_phone: string | null;
          groom_father: string | null;
          groom_mother: string | null;
          bride_father: string | null;
          bride_mother: string | null;
          groom_account: Json;
          bride_account: Json;
          published_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          title?: string;
          status?: "draft" | "published" | "expired";
          tier?: "basic" | "premium" | "arcade";
          sections_config?: Json;
          theme_config?: Json;
          wedding_date?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_lat?: number | null;
          venue_lng?: number | null;
          groom_name?: string | null;
          bride_name?: string | null;
          groom_phone?: string | null;
          bride_phone?: string | null;
          groom_father?: string | null;
          groom_mother?: string | null;
          bride_father?: string | null;
          bride_mother?: string | null;
          groom_account?: Json;
          bride_account?: Json;
          published_at?: string | null;
          expires_at?: string | null;
        };
        Update: {
          slug?: string;
          title?: string;
          status?: "draft" | "published" | "expired";
          tier?: "basic" | "premium" | "arcade";
          sections_config?: Json;
          theme_config?: Json;
          wedding_date?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_lat?: number | null;
          venue_lng?: number | null;
          groom_name?: string | null;
          bride_name?: string | null;
          groom_phone?: string | null;
          bride_phone?: string | null;
          groom_father?: string | null;
          groom_mother?: string | null;
          bride_father?: string | null;
          bride_mother?: string | null;
          groom_account?: Json;
          bride_account?: Json;
          published_at?: string | null;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      section_data: {
        Row: {
          id: string;
          invitation_id: string;
          section_type: string;
          enabled: boolean;
          sort_order: number;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          section_type: string;
          enabled?: boolean;
          sort_order?: number;
          data?: Json;
        };
        Update: {
          section_type?: string;
          enabled?: boolean;
          sort_order?: number;
          data?: Json;
        };
        Relationships: [];
      };
      guestsnap_sessions: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          folder_id: string | null;
          upload_count: number;
          total_size_bytes: number;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_name: string;
          folder_id?: string | null;
          upload_count?: number;
          total_size_bytes?: number;
          expires_at?: string | null;
        };
        Update: {
          guest_name?: string;
          folder_id?: string | null;
          upload_count?: number;
          total_size_bytes?: number;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      guestsnap_files: {
        Row: {
          id: string;
          session_id: string;
          invitation_id: string;
          file_name: string;
          file_type: "image" | "video";
          file_size_bytes: number;
          storage_path: string;
          status: "uploading" | "uploaded" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          invitation_id: string;
          file_name: string;
          file_type: "image" | "video";
          file_size_bytes?: number;
          storage_path: string;
          status?: "uploading" | "uploaded" | "failed";
        };
        Update: {
          file_name?: string;
          file_type?: "image" | "video";
          file_size_bytes?: number;
          storage_path?: string;
          status?: "uploading" | "uploaded" | "failed";
        };
        Relationships: [];
      };
      afterparty_places: {
        Row: {
          id: string;
          invitation_id: string;
          category:
            | "afterparty"
            | "restaurant"
            | "cafe"
            | "event"
            | "photospot";
          name: string;
          description: string | null;
          place_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          category?:
            | "afterparty"
            | "restaurant"
            | "cafe"
            | "event"
            | "photospot";
          name: string;
          description?: string | null;
          place_url?: string | null;
          sort_order?: number;
        };
        Update: {
          category?:
            | "afterparty"
            | "restaurant"
            | "cafe"
            | "event"
            | "photospot";
          name?: string;
          description?: string | null;
          place_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          invitation_id: string | null;
          tier: "basic" | "premium" | "arcade";
          amount: number;
          payment_key: string | null;
          payment_status: "pending" | "paid" | "refunded";
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invitation_id?: string | null;
          tier: "basic" | "premium" | "arcade";
          amount: number;
          payment_key?: string | null;
          payment_status?: "pending" | "paid" | "refunded";
          paid_at?: string | null;
        };
        Update: {
          invitation_id?: string | null;
          tier?: "basic" | "premium" | "arcade";
          amount?: number;
          payment_key?: string | null;
          payment_status?: "pending" | "paid" | "refunded";
          paid_at?: string | null;
        };
        Relationships: [];
      };
      rsvp_responses: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          guest_phone: string | null;
          attending: "yes" | "no" | "maybe";
          party_size: number;
          meal_type: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_name: string;
          guest_phone?: string | null;
          attending?: "yes" | "no" | "maybe";
          party_size?: number;
          meal_type?: string | null;
          message?: string | null;
        };
        Update: {
          guest_name?: string;
          guest_phone?: string | null;
          attending?: "yes" | "no" | "maybe";
          party_size?: number;
          meal_type?: string | null;
          message?: string | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          invitation_id: string;
          event_type: string;
          event_data: Json;
          ip_hash: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          event_type: string;
          event_data?: Json;
          ip_hash?: string | null;
          user_agent?: string | null;
        };
        Update: {
          event_type?: string;
          event_data?: Json;
          ip_hash?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      invitation_status: "draft" | "published" | "expired";
      invitation_tier: "basic" | "premium" | "arcade";
      guestsnap_file_type: "image" | "video";
      guestsnap_file_status: "uploading" | "uploaded" | "failed";
      afterparty_category:
        | "afterparty"
        | "restaurant"
        | "cafe"
        | "event"
        | "photospot";
      payment_status: "pending" | "paid" | "refunded";
      rsvp_attending: "yes" | "no" | "maybe";
    };
  };
}
