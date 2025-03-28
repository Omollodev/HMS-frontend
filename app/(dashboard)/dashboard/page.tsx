"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/services/dashboard-service";
import { DashboardStats } from "@/services/dashboard-types";
import { BarChart, LineChart } from "@/components/charts";
import { BedDouble, CreditCard, TrendingUp, Users } from "lucide-react";
import RecentReservations from "@/components/dashboard/recent-reservations";
import UpcomingArrivals from "@/components/dashboard/upcoming-arrivals";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.first_name}! Here&apos;s an overview of your
          hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Occupancy Rate"
          value={isLoading || !stats ? null : `${stats.occupancy.rate}%`}
          description="Current occupancy"
          icon={<BedDouble className="h-5 w-5 text-muted-foreground" />}
          trend={isLoading || !stats ? null : stats.occupancy.trend}
        />
        <StatsCard
          title="Revenue"
          value={isLoading || !stats ? null : `$${stats.revenue.total.toLocaleString()}`}
          description="Last 30 days"
          icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
          trend={isLoading || !stats ? null : stats.revenue.trend}
        />
        <StatsCard
          title="Reservations"
          value={isLoading || !stats ? null : stats.reservations.total}
          description="Last 30 days"
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
          trend={isLoading || !stats ? null : stats.reservations.trend}
        />
        <StatsCard
          title="Guests"
          value={isLoading || !stats ? null : stats.guests.total}
          description="Active guests"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={isLoading || !stats ? null : stats.guests.trend}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>
                  Daily occupancy rate for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <LineChart
                    data={stats?.occupancy.history || []}
                    xAxisKey="date"
                    yAxisKey="rate"
                    categories={["rate"]}
                    colors={["#2563eb"]}
                    valueFormatter={(value: number) => `${value}%`}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <BarChart
                    data={stats?.revenue.history || []}
                    xAxisKey="month"
                    yAxisKey="amount"
                    categories={["amount"]}
                    colors={["#10b981"]}
                    valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <RecentReservations />
            <UpcomingArrivals />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Visit the Analytics page for detailed reports and insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated and scheduled reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Visit the Analytics page to generate and view reports
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number | null;
  description: string;
  icon: React.ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string | number;
  } | null;
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-7 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`flex items-center text-xs mt-1 ${
              trend.direction === "up"
                ? "text-green-500"
                : trend.direction === "down"
                ? "text-red-500"
                : "text-gray-500"
            }`}>
            {trend.direction === "up"
              ? "↑"
              : trend.direction === "down"
              ? "↓"
              : "→"}{" "}
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
