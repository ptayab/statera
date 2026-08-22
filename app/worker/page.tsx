import { PageHeader } from "@/components/ui/Panel";
import { NavCard } from "@/components/ui/StatTile";
import { getUserProfile } from "@/lib/auth/session";

export default async function WorkerHomePage() {
  const profile = await getUserProfile();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="Worker"
        title={`Welcome${profile?.name ? `, ${profile.name}` : ""}`}
        description="Report safety concerns and track your submitted reports."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <NavCard
          href="/worker/submit"
          title="New report"
          description="Submit a new safety report for your site."
          accent="bg-statera-orange"
        />
        <NavCard
          href="/worker/tickets"
          title="My reports"
          description="Check status, chat with supervisors, and close resolved issues."
          accent="bg-sky-500"
        />
      </div>
    </main>
  );
}
