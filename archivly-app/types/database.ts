export type Outcome = 'win' | 'loss' | 'neutral';

export type CategoryCountRow = {
  category: string;
  count: number;
};

export type HeatmapDayRow = {
  date: string;
  count: number;
};

export type PeriodStatsRow = {
  total: number;
  wins: number;
  losses: number;
  neutrals: number;
  categories: CategoryCountRow[];
  heatmap: HeatmapDayRow[];
};

export type StreaksRow = {
  longest: number;
  current: number;
};

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
    Functions: {
      get_period_stats: {
        Args: { p_start: string; p_end: string };
        Returns: PeriodStatsRow;
      };
      get_streaks: {
        Args: Record<string, never>;
        Returns: StreaksRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
