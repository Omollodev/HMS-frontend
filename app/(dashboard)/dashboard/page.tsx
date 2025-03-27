"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart } from "@/components/charts";
import {
  getOccupancyStats,
  getRevenueStats,
  getGuestStats,
} from "@/services/analytics-service";
import { format, subDays } from "date-fns";
import { Download, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("occupancy");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [groupBy, setGroupBy] = useState("day");
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "occupancy" || activeTab === "all") {
          const occupancy = await getOccupancyStats({
            start_date: format(dateRange.from || new Date(), "yyyy-MM-dd"),
            end_date: format(dateRange.to || new Date(), "yyyy-MM-dd"),
            group_by: groupBy,
          });
          setOccupancyData(occupancy);
        }

        if (activeTab === "revenue" || activeTab === "all") {
          const revenue = await getRevenueStats({
            start_date: format(dateRange.from || new Date(), "yyyy-MM-dd"),
            end_date: format(dateRange.to || new Date(), "yyyy-MM-dd"),
            group_by: groupBy,
          });
          setRevenueData(revenue);
        }

        if (activeTab === "guests" || activeTab === "all") {
          const guests = await getGuestStats({
            start_date: format(dateRange.from || new Date(), "yyyy-MM-dd"),
            end_date: format(dateRange.to || new Date(), "yyyy-MM-dd"),
          });
          setGuestData(guests);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, dateRange, groupBy]);

  const handleRefresh = () => {
    if (activeTab === "occupancy") {
      setOccupancyData(null);
    } else if (activeTab === "revenue") {
      setRevenueData(null);
    } else if (activeTab === "guests") {
      setGuestData(null);
    } else {
      setOccupancyData(null);
      setRevenueData(null);
      setGuestData(null);
    }

    const currentTab = activeTab;
    setActiveTab("loading");
    setTimeout(() => {
      setActiveTab(currentTab);
    }, 100);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics and reports for your hotel
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="all">All Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="occupancy" className="space-y-4">
          <OccupancyReport data={occupancyData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueReport data={revenueData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          <GuestReport data={guestData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="all" className="space-y-8">
          <OccupancyReport data={occupancyData} isLoading={isLoading} />
          <RevenueReport data={revenueData} isLoading={isLoading} />
          <GuestReport data={guestData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="loading">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-8">
                <Skeleton className="h-[400px] w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OccupancyReport({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Report</CardTitle>
          <CardDescription>Hotel occupancy rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.time_series.map((item: any) => ({
    date: item.date,
    rate: item.occupancy_rate,
    rooms: item.occupied_rooms,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Report</CardTitle>
        <CardDescription>Hotel occupancy rate over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Average Occupancy
            </h3>
            <p className="text-3xl font-bold">
              {data.occupancy_rate.toFixed(1)}%
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Rooms
            </h3>
            <p className="text-3xl font-bold">{data.total_rooms}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avg. Occupied Rooms
            </h3>
            <p className="text-3xl font-bold">
              {Math.round(data.occupied_rooms)}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <LineChart
            data={chartData}
            xAxisKey="date"
            yAxisKey="rate"
            categories={["rate"]}
            colors={["#2563eb"]}
            valueFormatter={(value) => `${value}%`}
            height={400}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueReport({ data, isLoading }: { data: any; isLoading: boolean }) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Report</CardTitle>
          <CardDescription>Hotel revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Report</CardTitle>
        <CardDescription>Hotel revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold">
              ${data.total_revenue.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avg. Daily Revenue
            </h3>
            <p className="text-3xl font-bold">
              ${data.average_daily_revenue.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Payment Methods
            </h3>
            <p className="text-3xl font-bold">
              {Object.keys(data.payment_methods).length}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <BarChart
            data={data.time_series}
            xAxisKey="date"
            yAxisKey="revenue"
            categories={["revenue"]}
            colors={["#10b981"]}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            height={400}
          />
        </div>
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-medium">Payment Methods</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.payment_methods).map(
              ([method, info]: [string, any]) => (
                <div key={method} className="rounded-lg border p-4">
                  <h4 className="font-medium capitalize">
                    {method.replace("_", " ")}
                  </h4>
                  <p className="mt-1 text-2xl font-bold">
                    ${info.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.count} transactions
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GuestReport({ data, isLoading }: { data: any; isLoading: boolean }) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Guest Report</CardTitle>
          <CardDescription>Guest statistics and demographics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Report</CardTitle>
        <CardDescription>Guest statistics and demographics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Guests
            </h3>
            <p className="text-3xl font-bold">{data.total_guests}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              New Guests
            </h3>
            <p className="text-3xl font-bold">{data.new_guests}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Returning Guests
            </h3>
            <p className="text-3xl font-bold">{data.returning_guests}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avg. Stay Length
            </h3>
            <p className="text-3xl font-bold">
              {data.avg_stay_length.toFixed(1)} days
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-medium">Guest Demographics</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Adults vs. Children</h4>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span>Adults</span>
                  <span>{data.guest_demographics.adults}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (data.guest_demographics.adults /
                          (data.guest_demographics.adults +
                            data.guest_demographics.children)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span>Children</span>
                  <span>{data.guest_demographics.children}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (data.guest_demographics.children /
                          (data.guest_demographics.adults +
                            data.guest_demographics.children)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Average Party Size</h4>
              <p className="mt-4 text-4xl font-bold">
                {data.avg_party_size.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                people per reservation
              </p>
            </div>
          </div>
        </div>
        {data.time_series && data.time_series.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-medium">Guest Trends</h3>
            <LineChart
              data={data.time_series}
              xAxisKey="date"
              yAxisKey="unique_guests"
              categories={["unique_guests"]}
              colors={["#8b5cf6"]}
              valueFormatter={(value) => `${value}`}
              height={300}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
