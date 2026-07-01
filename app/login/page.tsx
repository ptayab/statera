import { LoginForm } from "@/components/auth/LoginForm";

const ERROR_MESSAGES: Record<string, string> = {
  no_profile:
    "Your login worked, but there is no profile row in the users table. Ask a teammate to set up your account.",
  auth_callback: "Sign-in could not be completed. Try again.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialError = params.error
    ? (ERROR_MESSAGES[params.error] ?? "Something went wrong. Try again.")
    : null;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Statera</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with the account your site administrator created for you.
          </p>
        </div>
        <LoginForm initialError={initialError} />
      </div>
    </main>
  );
}
