import { SideBar } from "./side-bar";
import { NavBar } from "./nav-bar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <SideBar />
      <div className="pl-[250px]">
        <NavBar />
        <main className="mx-auto max-w-7xl px-8">
          <div className="py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 