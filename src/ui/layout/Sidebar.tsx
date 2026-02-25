import clsx from "clsx";
import { useSidebar } from "../context/SidebarContext";
import {
  Barcode,
  Box,
  Calendar,
  ChartColumnIncreasing,
  ChevronLeft,
  FileDiff,
  HandHelping,
  ShoppingCart,
  User,
  Van,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarGroup from "./SidebarGroup";


export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      <div
        onClick={closeMobile}
        className={clsx(
          "fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          "bg-slate-900 text-slate-300 flex flex-col z-40 transition-all duration-200",
          "fixed inset-y-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64"
        )}
      >
        <div
          className={clsx(
            "h-14 flex items-center px-4 border-b border-slate-800",
            collapsed ? "md:justify-center" : "md:justify-between"
          )}
        >
          <img
            src="/logo_white.png"
            alt="Logo"
            className={clsx("h-6", collapsed && "md:hidden")}
          />

          <button
            onClick={toggleCollapsed}
            className="hidden md:block p-2 rounded hover:bg-slate-800"
          >
            <ChevronLeft
              size={18}
              className={clsx(collapsed && "rotate-180")}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            <SidebarItem
              path="/"
              label="Dashboard"
              Icon={ChartColumnIncreasing}
            />
            <SidebarItem path="/agenda" label="Agenda" Icon={Calendar} />

            <SidebarGroup label="Operações">
              <SidebarItem path="/vendas" label="Vendas" Icon={ShoppingCart} />
              <SidebarItem path="/compras" label="Compras" Icon={Box} />
            </SidebarGroup>

            <SidebarGroup label="Pessoas">
              <SidebarItem path="/clientes" label="Clientes" Icon={User} />
              <SidebarItem
                path="/fornecedores"
                label="Fornecedores"
                Icon={Van}
              />
            </SidebarGroup>

            <SidebarGroup label="Domínios">
              <SidebarItem path="/produtos" label="Produtos" Icon={Barcode} />
              <SidebarItem
                path="/servicos"
                label="Serviços"
                Icon={HandHelping}
              />
            </SidebarGroup>

            <SidebarGroup label="Financeiro">
              <SidebarItem
                path="/financeiro/extrato"
                label="Movimentações"
                Icon={FileDiff}
              />
            </SidebarGroup>
          </ul>
        </nav>
      </aside>
    </>
  );
}
