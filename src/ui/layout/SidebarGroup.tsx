import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { useSidebar } from "../context/SidebarContext";

type SidebarGroupProps = {
  label: string;
};

export default function SidebarGroup({
  label,
  children,
}: PropsWithChildren<SidebarGroupProps>) {
  const { collapsed } = useSidebar();

  const [open, setOpen] = useState<boolean>(true);

  return (
    <li>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "w-full flex items-center justify-between px-3 py-2 text-xs uppercase text-slate-400",
          collapsed && "md:hidden"
        )}
      >
        {label}
        <ChevronDown size={14} className={clsx(!open && "rotate-180")}/>
      </button>

      <ul className={clsx(!open && !collapsed && "hidden", "space-y-1")}>
        {children}
      </ul>
    </li>
  );
}
