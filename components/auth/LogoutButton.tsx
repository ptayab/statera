"use client";

import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <form action="/auth/signout" method="post" onSubmit={() => setPending(true)}>
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-zinc-600 underline-offset-2 hover:underline disabled:opacity-60 dark:text-zinc-400"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}
