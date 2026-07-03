import { LogoutButton } from "@/components/auth/LogoutButton";
import { SubmissionForm } from "@/components/tickets/SubmissionForm";
import { getUserProfile } from "@/lib/auth/session";

export default async function SubmitPage() {
  const profile = await getUserProfile();

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Submit a report</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as {profile?.name ?? profile?.email}
          </p>
        </div>
        <LogoutButton />
      </header>

      <SubmissionForm />
    </main>
  );
}
