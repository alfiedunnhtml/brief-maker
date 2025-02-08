import { Navbar } from "./navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 