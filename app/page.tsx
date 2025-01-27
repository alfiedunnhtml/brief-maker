import { BriefList } from "@/components/brief-list";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      <main className="mx-auto max-w-7xl">
        <BriefList />
      </main>
    </div>
  );
}
