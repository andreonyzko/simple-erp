import { useMatches } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { Menu } from "lucide-react";
import type { RouteHandle } from "../routes/types";

export default function Header() {
  const { openMobile } = useSidebar();

  const matches = useMatches();
  const currentRoute = [...matches].reverse().find((m: any) => m.handle?.title);

  const title =
    (currentRoute?.handle as RouteHandle | undefined)?.title ?? "OnyzERP";

  return (
    <header className="h-14 bg-slate-900 border-b flex items-center justify-between px-4 gap-4 md:px-6 md:bg-white">
      <button onClick={openMobile} className="md:hidden p-2 rounded text-white"
      aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold text-white md:text-slate-800 ">
        {title}
      </h1>
    </header>
  );
}
