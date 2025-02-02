import { SideBar } from "./side-bar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      <SideBar />
      <div className="flex-1 lg:pl-[250px]">
        <main className="h-screen p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 