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
  ScrollText,
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
      href: "/admin/dashboard",
      match: "/admin/dashboard",
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
      name: "Performance Analytics",
      icon: ListChecks,
      href: "/admin/testAttempts",
      match: "/admin/testAttempts",
    },
  ];

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-16"
        } bg-indigo-50/80 backdrop-blur-md border-r border-indigo-100/50 transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Millionaire-GRE
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-500" />
            ) : (
              <Menu className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // ✅ FIXED ACTIVE LOGIC
            const isActive =
              item.match === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.match);

            return (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium border hover:border-blue-200 cursor-pointer ${isActive
                    ? "bg-indigo-100 text-blue-700 border-indigo-200 shadow-sm"
                    : "text-gray-600 border-transparent hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"
                      } ${sidebarOpen ? "" : "mx-auto"}`}
                  />
                  {sidebarOpen && (
                    <span>
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
