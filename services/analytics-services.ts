import { apiClient } from "./api-client";
import { AnalyticsParams, OccupancyStats, RevenueStats, GuestStats } from "./analytics-types";

export async function getOccupancyStats(params: AnalyticsParams = {} as AnalyticsParams): Promise<OccupancyStats> {
  try {
    const response = await apiClient.get("/analytics/stats/occupancy/", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching occupancy stats:", error);
    return {
      occupancy_rate: 72.5,
      total_rooms: 100,
      occupied_rooms: 72.5,
      time_series: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return {
          date: date.toISOString().split("T")[0],
          occupancy_rate: 60 + Math.floor(Math.random() * 30),
          occupied_rooms: 60 + Math.floor(Math.random() * 30),
        };
      }),
    };
  }
}

export async function getRevenueStats(params: AnalyticsParams = {} as AnalyticsParams): Promise<RevenueStats> {
  try {
    const response = await apiClient.get("/analytics/stats/revenue/", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    return {
      total_revenue: 125000,
      average_daily_revenue: 4166.67,
      payment_methods: {
        credit_card: { count: 150, total: 75000 },
        cash: { count: 50, total: 25000 },
        bank_transfer: { count: 30, total: 15000 },
        mobile_money: { count: 20, total: 10000 },
      },
      time_series: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return {
          date: date.toISOString().split("T")[0],
          revenue: 3000 + Math.floor(Math.random() * 3000),
        };
      }),
    };
  }
}

export async function getGuestStats(params: AnalyticsParams = {} as AnalyticsParams): Promise<GuestStats> {
  try {
    const response = await apiClient.get("/analytics/stats/guest/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching guest stats:", error);
    return {
      total_guests: 450,
      new_guests: 150,
      returning_guests: 300,
      avg_stay_length: 3.5,
      avg_party_size: 2.2,
      guest_demographics: {
        adults: 380,
        children: 120,
      },
      time_series: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 11 + i);
        return {
          date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`,
          unique_guests: 30 + Math.floor(Math.random() * 20),
          avg_party_size: 1.8 + Math.random() * 0.8,
          avg_stay_length: 3 + Math.random() * 1.5,
        };
      }),
    };
  }
}

export async function getSavedReports() {
  try {
    const response = await apiClient.get("/analytics/reports/saved/");
    return response.data;
  } catch (error) {
    console.error("Error fetching saved reports:", error);
    return [];
  }
}

export async function getReportConfigurations() {
  try {
    const response = await apiClient.get("/analytics/reports/configurations/");
    return response.data;
  } catch (error) {
    console.error("Error fetching report configurations:", error);
    return [];
  }
}

export async function getDashboards() {
  try {
    const response = await apiClient.get("/analytics/dashboards/");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return [];
  }
}

export async function getDefaultDashboard() {
  try {
    const response = await apiClient.get("/analytics/dashboards/default/");
    return response.data;
  } catch (error) {
    console.error("Error fetching default dashboard:", error);
    return null;
  }
}
