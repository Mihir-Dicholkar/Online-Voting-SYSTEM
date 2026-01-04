import { useState } from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  Activity,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "classnames";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Set Elections", path: "/set-elections", icon: <CalendarPlus size={20} /> },
    { name: "Live Elections", path: "/live-elections", icon: <Activity size={20} /> },
    { name: "Declare Results", path: "/declare-results", icon: <Flag size={20} /> },
  ];

  return (
    <aside
      className={clsx(
        "relative flex flex-col h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          "absolute -right-4 top-4 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md transition-all hover:bg-gray-100",
          "z-50"
        )}
      >
        {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        <span
          className={clsx(
            "font-bold text-lg text-gray-900 transition-all duration-300",
            !expanded && "opacity-0 w-0 overflow-hidden"
          )}
        >
          Voting Admin
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700",
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium shadow-inner"
                  : "text-gray-700"
              )
            }
          >
            <div className="flex-shrink-0 text-gray-500 group-hover:text-blue-600">
              {item.icon}
            </div>
            <span
              className={clsx(
                "transition-all duration-300 whitespace-nowrap",
                !expanded && "opacity-0 w-0 overflow-hidden"
              )}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; 2025 Voting System
        </div>
      )}
    </aside>
  );
}
