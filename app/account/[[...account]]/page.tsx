import { UserProfile } from "@clerk/nextjs";
import { NavBar } from "@/components/nav-bar";

export default function AccountPage() {
  return (
    <div className="min-h-screen p-8">
      <NavBar />
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>
        <UserProfile />
      </div>
    </div>
  );
} 