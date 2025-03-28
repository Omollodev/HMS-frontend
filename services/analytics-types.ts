export interface AnalyticsParams {
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'week' | 'month';
}

export interface OccupancyTimeSeriesItem {
  date: string;
  occupancy_rate: number;
  occupied_rooms: number;
}

export interface OccupancyStats {
  occupancy_rate: number;
  total_rooms: number;
  occupied_rooms: number;
  time_series: OccupancyTimeSeriesItem[];
}

export interface RevenueTimeSeriesItem {
  date: string;
  revenue: number;
}

export interface PaymentMethodStats {
  count: number;
  total: number;
}

export interface RevenueStats {
  total_revenue: number;
  average_daily_revenue: number;
  payment_methods: {
    credit_card: PaymentMethodStats;
    cash: PaymentMethodStats;
    bank_transfer: PaymentMethodStats;
    mobile_money: PaymentMethodStats;
    [key: string]: PaymentMethodStats;
  };
  time_series: RevenueTimeSeriesItem[];
}

export interface GuestTimeSeriesItem {
  date: string;
  unique_guests: number;
  avg_party_size: number;
  avg_stay_length: number;
}

export interface GuestStats {
  total_guests: number;
  new_guests: number;
  returning_guests: number;
  avg_stay_length: number;
  avg_party_size: number;
  guest_demographics: {
    adults: number;
    children: number;
  };
  time_series: GuestTimeSeriesItem[];
} 