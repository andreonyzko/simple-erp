import { Toaster } from "sonner";
import SidebarProvider from "../context/SidebarContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

export default function AppShell() {
  return (
    <SidebarProvider>
      <div className=" relative min-h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-h-0">
          <Header />
          <main className="flex flex-col flex-1 px-6 py-3 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
