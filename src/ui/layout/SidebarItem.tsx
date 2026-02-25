import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";
import { useSidebar } from "../context/SidebarContext";

type SidebarItemProps = {
  path: string;
  label: string;
  Icon: LucideIcon;
};

export default function SidebarItem({ path, label, Icon }: SidebarItemProps) {
  const { collapsed, closeMobile } = useSidebar();

  return (
    <li>
      <NavLink
        to={path}
        onClick={closeMobile}
        className={({ isActive }) =>
          clsx(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            collapsed && "md:justify-center",
            isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/60"
          )
        }
      >
        <Icon size={18}/>
        <span className={clsx(collapsed && "md:hidden")}>
          {label}
          </span>
      </NavLink>
    </li>
  );
}
