export type Outcome = 'win' | 'loss' | 'neutral';

export type LogRow = {
  id: string;
  user_id: string;
  title: string;
  outcome: Outcome;
  date: string; // YYYY-MM-DD
  note: string | null;
  category: string | null;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      logs: {
        Row: LogRow;
        Insert: Omit<LogRow, 'id' | 'user_id' | 'created_at'> & {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<LogRow, 'id' | 'user_id'>>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'user_id' | 'created_at'> & {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<CategoryRow, 'id' | 'user_id'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
