import { SubmissionForm } from "@/components/tickets/SubmissionForm";

export default function SubmitPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Submit a report</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Describe the safety concern and add a photo if you have one.
        </p>
      </header>

      <SubmissionForm />
    </main>
  );
}
