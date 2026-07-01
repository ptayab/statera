import { LogoutButton } from "@/components/auth/LogoutButton";
import { getUserProfile } from "@/lib/auth/session";

export default async function SubmitPage() {
  const profile = await getUserProfile();

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Submit a report</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as {profile?.name ?? profile?.email}
          </p>
        </div>
        <LogoutButton />
      </header>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The ticket submission form arrives in stage 05. For now, confirm you
        reached this page as a worker account.
      </p>
    </main>
  );
}
