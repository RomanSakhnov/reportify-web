// Core application types

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  quantity: number;
  active: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardData {
  summary: {
    total_users: number;
    active_users: number;
    total_items: number;
    active_items: number;
    total_value: number;
  };
  user_growth: Record<string, number>;
  item_distribution: Record<string, number>;
  recent_activity: {
    recent_users: Array<[string, string, string]>;
    recent_items: Array<{
      id: number;
      name: string;
      category: string;
      owner: string;
      created_at: string;
    }>;
  };
}

export interface ReportMetrics {
  daily_metrics?: Array<{
    date: string;
    data: {
      page_views: number;
      unique_visitors: number;
      avg_session_duration: number;
      bounce_rate: number;
      conversion_rate: number;
    };
  }>;
  user_activity?: Array<{
    date: string;
    data: {
      new_users: number;
      active_users: number;
      user_sessions: number;
      avg_actions_per_user: number;
    };
  }>;
  item_sales?: Array<{
    date: string;
    data: {
      total_sales: number;
      total_revenue: number;
      avg_order_value: number;
      by_category: Record<
        string,
        {
          units_sold: number;
          revenue: number;
        }
      >;
    };
  }>;
}

export interface Trend {
  current: number;
  previous: number;
  change_percentage: number;
}

export interface TrendsData {
  user_trend: Trend;
  item_trend: Trend;
  categories: Record<string, number>;
  top_users: Array<{
    id: number;
    name: string;
    email: string;
    items_count: number;
  }>;
}
