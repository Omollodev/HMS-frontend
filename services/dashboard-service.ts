import { DashboardStats } from "./dashboard-types";

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    occupancy: {
      rate: 72,
      trend: {
        direction: "up",
        value: "5%",
      },
      history: [
        { date: "2023-01-01", rate: 65 },
        { date: "2023-01-02", rate: 68 },
        { date: "2023-01-03", rate: 70 },
        { date: "2023-01-04", rate: 72 },
        { date: "2023-01-05", rate: 75 },
        { date: "2023-01-06", rate: 78 },
        { date: "2023-01-07", rate: 80 },
        { date: "2023-01-08", rate: 82 },
        { date: "2023-01-09", rate: 80 },
        { date: "2023-01-10", rate: 78 },
        { date: "2023-01-11", rate: 75 },
        { date: "2023-01-12", rate: 72 },
        { date: "2023-01-13", rate: 70 },
        { date: "2023-01-14", rate: 68 },
        { date: "2023-01-15", rate: 65 },
        { date: "2023-01-16", rate: 63 },
        { date: "2023-01-17", rate: 60 },
        { date: "2023-01-18", rate: 58 },
        { date: "2023-01-19", rate: 60 },
        { date: "2023-01-20", rate: 63 },
        { date: "2023-01-21", rate: 65 },
        { date: "2023-01-22", rate: 68 },
        { date: "2023-01-23", rate: 70 },
        { date: "2023-01-24", rate: 72 },
        { date: "2023-01-25", rate: 75 },
        { date: "2023-01-26", rate: 78 },
        { date: "2023-01-27", rate: 80 },
        { date: "2023-01-28", rate: 82 },
        { date: "2023-01-29", rate: 80 },
        { date: "2023-01-30", rate: 78 },
      ],
    },
    revenue: {
      total: 125000,
      trend: {
        direction: "up",
        value: "12%",
      },
      history: [
        { month: "Jan", amount: 85000 },
        { month: "Feb", amount: 90000 },
        { month: "Mar", amount: 95000 },
        { month: "Apr", amount: 100000 },
        { month: "May", amount: 110000 },
        { month: "Jun", amount: 120000 },
        { month: "Jul", amount: 125000 },
        { month: "Aug", amount: 130000 },
        { month: "Sep", amount: 125000 },
        { month: "Oct", amount: 120000 },
        { month: "Nov", amount: 115000 },
        { month: "Dec", amount: 125000 },
      ],
    },
    reservations: {
      total: 450,
      trend: {
        direction: "up",
        value: "8%",
      },
    },
    guests: {
      total: 320,
      trend: {
        direction: "up",
        value: "5%",
      },
    },
  };
}
