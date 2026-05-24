export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          duration: string | null
          email: string
          event_date: string | null
          guest_count: number | null
          id: string
          message: string | null
          name: string
          phone: string | null
          start_time: string | null
          status: string
          venue_name: string | null
          venue_type: string | null
        }
        Insert: {
          created_at?: string
          duration?: string | null
          email: string
          event_date?: string | null
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          start_time?: string | null
          status?: string
          venue_name?: string | null
          venue_type?: string | null
        }
        Update: {
          created_at?: string
          duration?: string | null
          email?: string
          event_date?: string | null
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          start_time?: string | null
          status?: string
          venue_name?: string | null
          venue_type?: string | null
        }
        Relationships: []
      }
      gigs: {
        Row: {
          address: string | null
          city: string
          cover_note: string | null
          created_at: string
          crowd_estimate: number | null
          end_time: string | null
          expected_max: number | null
          expected_min: number | null
          gig_date: string
          id: string
          is_live: boolean
          neighborhood: string | null
          payout: string | null
          start_time: string | null
          status: string
          venue_name: string
        }
        Insert: {
          address?: string | null
          city?: string
          cover_note?: string | null
          created_at?: string
          crowd_estimate?: number | null
          end_time?: string | null
          expected_max?: number | null
          expected_min?: number | null
          gig_date: string
          id?: string
          is_live?: boolean
          neighborhood?: string | null
          payout?: string | null
          start_time?: string | null
          status?: string
          venue_name: string
        }
        Update: {
          address?: string | null
          city?: string
          cover_note?: string | null
          created_at?: string
          crowd_estimate?: number | null
          end_time?: string | null
          expected_max?: number | null
          expected_min?: number | null
          gig_date?: string
          id?: string
          is_live?: boolean
          neighborhood?: string | null
          payout?: string | null
          start_time?: string | null
          status?: string
          venue_name?: string
        }
        Relationships: []
      }
      song_requests: {
        Row: {
          created_at: string
          gig_id: string | null
          id: string
          requester_name: string | null
          song_title: string
          status: string
        }
        Insert: {
          created_at?: string
          gig_id?: string | null
          id?: string
          requester_name?: string | null
          song_title: string
          status?: string
        }
        Update: {
          created_at?: string
          gig_id?: string | null
          id?: string
          requester_name?: string | null
          song_title?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'song_requests_gig_id_fkey'
            columns: ['gig_id']
            isOneToOne: false
            referencedRelation: 'gigs'
            referencedColumns: ['id']
          },
        ]
      }
      songs: {
        Row: {
          artist: string | null
          bpm: number | null
          energy: string | null
          id: string
          song_key: string | null
          song_type: string
          title: string
        }
        Insert: {
          artist?: string | null
          bpm?: number | null
          energy?: string | null
          id?: string
          song_key?: string | null
          song_type?: string
          title: string
        }
        Update: {
          artist?: string | null
          bpm?: number | null
          energy?: string | null
          id?: string
          song_key?: string | null
          song_type?: string
          title?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount: number
          created_at: string
          gig_id: string | null
          id: string
          method: string | null
          tipper_name: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          gig_id?: string | null
          id?: string
          method?: string | null
          tipper_name?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          gig_id?: string | null
          id?: string
          method?: string | null
          tipper_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'tips_gig_id_fkey'
            columns: ['gig_id']
            isOneToOne: false
            referencedRelation: 'gigs'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']

export type Gig = Tables<'gigs'>
export type Song = Tables<'songs'>
export type SongRequest = Tables<'song_requests'>
export type Tip = Tables<'tips'>
export type Booking = Tables<'bookings'>
