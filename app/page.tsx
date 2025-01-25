import Image from "next/image";
import { BriefList } from "@/components/brief-list";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="https://nextjs.org/icons/next.svg"
            alt="Brief Maker logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-2xl font-bold">Brief Maker</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <BriefList />
      </main>
    </div>
  );
}
