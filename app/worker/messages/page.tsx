export default function MessagesPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Updates from supervisors about your reports will appear here.
        </p>
      </header>

      <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No messages yet.
      </p>
    </main>
  );
}
