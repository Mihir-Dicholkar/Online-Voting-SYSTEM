import { useState } from "react";
import { LayoutDashboard, CalendarPlus, Activity, Flag, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className={clsx("h-200vh bg-gray-900 text-gray-100 flex flex-col transition-all duration-300", expanded ? "w-64" : "w-20")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="font-bold text-lg">{expanded ? "Voting Admin" : "VA"}</span>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white">
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors",
                isActive ? "bg-gray-800" : ""
              )
            }
          >
            {item.icon}
            {expanded && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
