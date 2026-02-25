import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggleCollapsed(): void;
  mobileOpen: boolean;
  openMobile(): void;
  closeMobile(): void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export default function SidebarProvider({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("sidebar-collapsed") === "1";
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        mobileOpen,
        openMobile: () => setMobileOpen(true),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
