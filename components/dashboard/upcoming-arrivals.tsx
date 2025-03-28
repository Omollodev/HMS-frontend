"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodayArrivals } from "@/services/reservation-service";
import { formatDate } from "@/lib/utils";

export default function UpcomingArrivals() {
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const data = await getTodayArrivals();
        setArrivals(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch today arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArrivals();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Arrivals</CardTitle>
        <CardDescription>Guests checking in today</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : arrivals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No arrivals scheduled for today
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {arrivals.map((arrival) => (
              <div key={arrival.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-sm">
                      {arrival.guest_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{arrival.guest_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Room: {arrival.room_number || "Not assigned"} •{" "}
                    {arrival.nights} {arrival.nights === 1 ? "night" : "nights"}
                  </p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">
                    {formatDate(arrival.check_in_date)}
                  </p>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/reservations?filter=today_arrivals">
            View all arrivals
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
