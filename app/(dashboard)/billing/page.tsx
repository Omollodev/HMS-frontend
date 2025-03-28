"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getInvoices, getPayments } from "@/services/billing-service";
import { Invoice, Payment } from "@/services/billing-types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Download, Filter, Plus, Search } from "lucide-react";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "invoices") {
          const data = await getInvoices({
            status: statusFilter !== "all" ? statusFilter : undefined,
            date_filter: dateFilter !== "all" ? dateFilter : undefined,
            search: searchTerm || undefined,
          });
          setInvoices(data);
        } else {
          const data = await getPayments({
            status: statusFilter !== "all" ? statusFilter : undefined,
            date_filter: dateFilter !== "all" ? dateFilter : undefined,
            search: searchTerm || undefined,
          });
          setPayments(data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, statusFilter, dateFilter, searchTerm]);

  const getStatusBadge = (status: string, type: "invoice" | "payment") => {
    // Different style variants based on type
    let className = "";
    
    if (type === "invoice") {
      // Invoice status styles
      switch (status) {
        case "draft":
          className = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
          break;
        case "pending":
          className = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
          break;
        case "paid":
          className = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
          break;
        case "overdue":
          className = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
          break;
        case "cancelled":
          className = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
          break;
      }
    } else {
      // Payment status styles
      switch (status) {
        case "completed":
          className = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
          break;
        case "failed":
          className = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
          break;
        case "refunded":
          className = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
          break;
        case "processing":
          className = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
          break;
      }
    }

    return (
      <Badge className={`capitalize ${className}`}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Payments
        </h1>
        <p className="text-muted-foreground">
          Manage invoices, payments, and financial transactions
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${activeTab}...`}
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
                {activeTab === "invoices" ? (
                  <>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button asChild>
          <Link
            href={
              activeTab === "invoices"
                ? "/billing/invoices/new"
                : "/billing/payments/new"
            }>
            <Plus className="mr-2 h-4 w-4" />
            New {activeTab === "invoices" ? "Invoice" : "Payment"}
          </Link>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          {isLoading ? (
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
          ) : invoices.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell>{invoice.guest_name}</TableCell>
                        <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell>
                          {formatCurrency(invoice.total_amount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status, "invoice")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/billing/invoices/${invoice.id}`}>
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments">
          {isLoading ? (
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
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.transaction_id}
                        </TableCell>
                        <TableCell>{payment.guest_name}</TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_method.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(payment.payment_date)}
                        </TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status, "payment")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/billing/payments/${payment.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
