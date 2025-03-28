export interface Trend {
  direction: 'up' | 'down' | 'neutral';
  value: string;
}

export interface OccupancyHistory {
  date: string;
  rate: number;
}

export interface RevenueHistory {
  month: string;
  amount: number;
}

export interface DashboardStats {
  occupancy: {
    rate: number;
    trend: Trend;
    history: OccupancyHistory[];
  };
  revenue: {
    total: number;
    trend: Trend;
    history: RevenueHistory[];
  };
  reservations: {
    total: number;
    trend: Trend;
  };
  guests: {
    total: number;
    trend: Trend;
  };
} 