"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  BedDouble,
  Calendar,
  CreditCard,
  Home,
  Hotel,
  Menu,
  Settings,
  Users,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["admin", "manager", "receptionist"],
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: <BedDouble className="h-5 w-5" />,
    roles: ["admin", "manager", "receptionist", "housekeeping"],
  },
  {
    title: "Guests",
    href: "/guests",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin", "manager", "receptionist"],
  },
  {
    title: "Billing",
    href: "/billing",
    icon: <CreditCard className="h-5 w-5" />,
    roles: ["admin", "manager", "receptionist"],
  },
  {
    title: "Housekeeping",
    href: "/housekeeping",
    icon: <Hotel className="h-5 w-5" />,
    roles: ["admin", "manager", "housekeeping"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin", "manager"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin", "manager"],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || "")
  );

  const NavLinks = () => (
    <>
      <div className="flex h-14 items-center px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HMS</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-secondary"
                )}>
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed left-4 top-4 z-40">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col">
            <NavLinks />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:inset-y-0 border-r bg-card">
      <NavLinks />
    </div>
  );
}
