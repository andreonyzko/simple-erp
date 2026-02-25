import SidebarProvider from "../context/SidebarContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

export default function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-slate-50 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-h-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
