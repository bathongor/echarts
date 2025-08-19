"use client";

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  PieChart, 
  Users, 
  Settings, 
  HelpCircle, 
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    active: true
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    href: "/analytics",
    active: false
  },
  {
    title: "Charts",
    icon: BarChart3,
    href: "/charts",
    active: false
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
    active: false
  },
  {
    title: "Users",
    icon: Users,
    href: "/users",
    active: false
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    active: false
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
    active: false
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex flex-col bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <PieChart className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-10 px-3",
                collapsed && "px-2 justify-center",
                item.active && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Analytics Dashboard</p>
            <p>Version 1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
