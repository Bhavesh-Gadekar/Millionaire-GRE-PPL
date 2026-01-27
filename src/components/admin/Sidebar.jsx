"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  ClipboardList,
  CheckSquare,
  GraduationCap,
  FolderOpen,
  PieChart,
  ListChecks,
  Settings,
  ScrollText,
  Award,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      match: "/admin",
    },
    {
      name: "Questions",
      icon: HelpCircle,
      href: "/admin/questions",
      match: "/admin/questions",
    },
    {
      name: "Tests",
      icon: ClipboardList,
      href: "/admin/tests",
      match: "/admin/tests",
    },
    {
      name: "Results",
      icon: CheckSquare,
      href: "/admin/result",
      match: "/admin/result",
    },
    {
      name: "Students",
      icon: GraduationCap,
      href: "/admin/students",
      match: "/admin/students",
    },
    {
      name: "Categories",
      icon: FolderOpen,
      href: "/admin/categories",
      match: "/admin/categories",
    },
    {
      name: "Test Attempts",
      icon: ListChecks,
      href: "/admin/attempts",
      match: "/admin/attempts",
    },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              MIllionaire-GRE
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.match ||
              pathname.startsWith(item.match + "/");

            return (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      sidebarOpen ? "" : "mx-auto"
                    }`}
                  />
                  {sidebarOpen && (
                    <span className="font-medium">
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    
    </aside>
  );
}
