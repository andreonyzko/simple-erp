import { useMatches } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ChevronRight, House, Menu } from "lucide-react";
import type { RouteHandle } from "../routes/types";

export default function Header() {
  const { openMobile } = useSidebar();

  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];

  const titles = (lastMatch.handle as RouteHandle | undefined)?.title ?? [];

  return (
    <header className="bg-slate-900 border-b flex items-center justify-between gap-4 h-14 px-6 md:hidden">
      <button
        onClick={openMobile}
        className="md:hidden p-2 rounded text-white"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>
      <h1 className="flex items-center gap-2 text-sm text-white">
        {titles.map((title, index) => (
          <>
            {title}
            {index !== (titles.length -1) && <ChevronRight size={14}/>} 
          </>
        ))}
      </h1>
    </header>
  );
}
