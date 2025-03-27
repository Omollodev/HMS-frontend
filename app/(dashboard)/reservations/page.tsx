"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { getReservations } from "@/services/reservation-service"
import { formatDate } from "@/lib/utils"
import { CalendarPlus, Filter, Search } from "lucide-react"

export default function ReservationsPage() {
  const searchParams = useSearchParams()
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const initialTab = searchParams.get("filter") === "today_arrivals" ? "arrivals" : "all"

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true)
      try {
        const data = await getReservations({
          status: statusFilter !== "all" ? statusFilter : undefined,
          date_filter: dateFilter !== "all" ? dateFilter : undefined,
          search: searchTerm || undefined,
        })
        setReservations(data)
      } catch (error) {
        console.error("Failed to fetch reservations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [statusFilter, dateFilter, searchTerm])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      checked_in: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      checked_out: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      no_show: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    }

    return <Badge className={`capitalize ${variants[status] || ""}`}>{status.replace("_", " ")}</Badge>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground">Manage hotel reservations, check-ins, and check-outs</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reservations..."
              className="pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="next_week">Next Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button asChild>
          <Link href="/reservations/new">
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Reservation
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reservations</TabsTrigger>
          <TabsTrigger value="current">Current Stays</TabsTrigger>
          <TabsTrigger value="arrivals">Today&apos;s Arrivals</TabsTrigger>
          <TabsTrigger value="departures">Today&apos;s Departures</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ReservationsTable reservations={reservations} isLoading={isLoading} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="current">
          <ReservationsTable
            reservations={reservations.filter((r) => r.status === "checked_in")}
            isLoading={isLoading}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="arrivals">
          <ReservationsTable
            reservations={reservations.filter(
              (r) =>
                (r.status === "confirmed" || r.status === "pending") &&
                new Date(r.check_in_date).toDateString() === new Date().toDateString(),
            )}
            isLoading={isLoading}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="departures">
          <ReservationsTable
            reservations={reservations.filter(
              (r) =>
                r.status === "checked_in" && new Date(r.check_out_date).toDateString() === new Date().toDateString(),
            )}
            isLoading={isLoading}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReservationsTableProps {
  reservations: any[]
  isLoading: boolean
  getStatusBadge: (status: string) => React.ReactNode
}

function ReservationsTable({ reservations, isLoading, getStatusBadge }: ReservationsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="ml-auto h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">No reservations found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reservation #</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.reservation_number}</TableCell>
                <TableCell>{reservation.guest_name}</TableCell>
                <TableCell>
                  {reservation.room_number || <span className="text-muted-foreground">Not assigned</span>}
                </TableCell>
                <TableCell>{formatDate(reservation.check_in_date)}</TableCell>
                <TableCell>{formatDate(reservation.check_out_date)}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/reservations/${reservation.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

