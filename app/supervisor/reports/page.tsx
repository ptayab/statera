import { GenerateReport } from "@/components/reports/GenerateReport";
import { TrendCharts } from "@/components/reports/TrendCharts";
import { TicketList } from "@/components/dashboard/TicketList";
import { PageHeader, Section, Eyebrow } from "@/components/ui/Panel";
import { getUserProfile } from "@/lib/auth/session";
import { getSiteTicketsWithRanking } from "@/lib/tickets/queries";
import {
  attentionTickets,
  buildSiteReportStats,
} from "@/lib/tickets/trends";

export default async function SupervisorReportsPage() {
  const profile = await getUserProfile();
  const tickets = profile
    ? await getSiteTicketsWithRanking(profile.site_id)
    : [];
  const stats = buildSiteReportStats(tickets);
  const attention = attentionTickets(tickets);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Site briefing"
          title="Reports"
          description="A live picture of open work. Counts include older reports that are still not resolved. The AI briefing leads with current filings and work that has sat open."
        />
      </div>

      <TrendCharts stats={stats} />

      <Section
        title="Needs attention"
        description="Current live reports first, then work that has been open longer. Resolved issues are omitted."
        className="mt-8 print:hidden"
      >
        <TicketList
          tickets={attention}
          ranked
          emptyMessage="Nothing looks stalled right now."
        />
      </Section>

      <div className="mt-8">
        <div className="mb-3 print:hidden">
          <Eyebrow>Exportable briefing</Eyebrow>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Written from live open work. Not saved — export before you leave.
          </p>
        </div>
        <GenerateReport stats={stats} />
      </div>
    </main>
  );
}
