import { Sidebar } from "./side-bar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-30 h-screen w-[320px] border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold">Brief Maker</h1>
          </div>
          <Sidebar />
        </div>
      </aside>
      <main className="flex-1 pl-[320px]">
        <div className="mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 