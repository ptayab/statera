/**
 * Hand-written types matching supabase/migrations/20250630000001_initial_schema.sql.
 * Regenerate from Supabase CLI later if the schema grows significantly.
 */
export type UserRole = "worker" | "supervisor";

export type TicketStatus =
  | "Submitted"
  | "In Review"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type TicketUrgency = "Low" | "Medium" | "High";

export type AiPromptType = "worker_coach" | "pattern_check";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: UserRole;
          site_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role: UserRole;
          site_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: UserRole;
          site_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          created_by: string;
          site_id: string;
          category: string;
          description: string;
          photo_url: string | null;
          status: TicketStatus;
          urgency: TicketUrgency;
          assigned_to: string | null;
          ai_suggested_category: string | null;
          ai_suggested_priority: string | null;
          ai_explanation: string | null;
          ai_analysis: Record<string, unknown> | null;
          ai_ranking_feedback: Record<string, unknown> | null;
          created_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          created_by: string;
          site_id: string;
          category: string;
          description: string;
          photo_url?: string | null;
          status?: TicketStatus;
          urgency?: TicketUrgency;
          assigned_to?: string | null;
          ai_suggested_category?: string | null;
          ai_suggested_priority?: string | null;
          ai_explanation?: string | null;
          ai_analysis?: Record<string, unknown> | null;
          ai_ranking_feedback?: Record<string, unknown> | null;
          created_at?: string;
          closed_at?: string | null;
        };
        Update: {
          id?: string;
          created_by?: string;
          site_id?: string;
          category?: string;
          description?: string;
          photo_url?: string | null;
          status?: TicketStatus;
          urgency?: TicketUrgency;
          assigned_to?: string | null;
          ai_suggested_category?: string | null;
          ai_suggested_priority?: string | null;
          ai_explanation?: string | null;
          ai_analysis?: Record<string, unknown> | null;
          ai_ranking_feedback?: Record<string, unknown> | null;
          created_at?: string;
          closed_at?: string | null;
        };
        Relationships: [];
      };
      ticket_events: {
        Row: {
          id: string;
          ticket_id: string;
          event_type: string;
          actor: string | null;
          payload: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          event_type: string;
          actor?: string | null;
          payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          event_type?: string;
          actor?: string | null;
          payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ticket_reads: {
        Row: {
          user_id: string;
          ticket_id: string;
          last_seen_at: string;
        };
        Insert: {
          user_id: string;
          ticket_id: string;
          last_seen_at?: string;
        };
        Update: {
          user_id?: string;
          ticket_id?: string;
          last_seen_at?: string;
        };
        Relationships: [];
      };
      ai_interactions: {
        Row: {
          id: string;
          ticket_id: string;
          prompt_type: AiPromptType;
          output: Record<string, unknown>;
          human_agreed: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          prompt_type: AiPromptType;
          output: Record<string, unknown>;
          human_agreed?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          prompt_type?: AiPromptType;
          output?: Record<string, unknown>;
          human_agreed?: boolean | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      supervisor_change_ticket_status: {
        Args: { p_ticket_id: string; p_new_status: TicketStatus };
        Returns: undefined;
      };
      supervisor_assign_ticket: {
        Args: { p_ticket_id: string };
        Returns: undefined;
      };
      supervisor_unassign_ticket: {
        Args: { p_ticket_id: string };
        Returns: undefined;
      };
      supervisor_add_ticket_note: {
        Args: { p_ticket_id: string; p_note: string };
        Returns: undefined;
      };
      worker_add_ticket_message: {
        Args: { p_ticket_id: string; p_message: string };
        Returns: undefined;
      };
      worker_close_ticket: {
        Args: { p_ticket_id: string };
        Returns: undefined;
      };
      list_open_reports_for_ai: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          category: string;
          description: string;
        }[];
      };
      list_ranking_feedback_for_ai: {
        Args: Record<string, never>;
        Returns: {
          category: string;
          description: string;
          ranking_label: string;
          ranking_score: number;
          agreed: boolean;
          reason: string;
        }[];
      };
    };
    Enums: {
      ticket_status: TicketStatus;
      user_role: UserRole;
      ai_prompt_type: AiPromptType;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type TicketEvent = Database["public"]["Tables"]["ticket_events"]["Row"];
