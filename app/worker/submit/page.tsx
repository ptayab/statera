import { submitTicket } from "@/app/worker/submit/actions";
import { SubmissionForm } from "@/components/tickets/SubmissionForm";
import { PageHeader } from "@/components/ui/Panel";

export default function SubmitPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        eyebrow="New report"
        title="Submit a report"
        description="Describe the safety concern and add a photo if you have one."
      />

      <SubmissionForm submitTicket={submitTicket} />
    </main>
  );
}
