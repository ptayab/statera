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
    <div className="flex min-h-screen">
      <aside className="hidden w-[45%] flex-col bg-statera-dark px-12 py-10 lg:flex">
        <div className="flex flex-1 flex-col justify-center space-y-5">
          <h1 className="font-display text-8xl leading-none tracking-wide text-white xl:text-9xl">
            STATERA
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-statera-orange" aria-hidden />
            <p className="text-xs font-light uppercase tracking-[0.35em] text-zinc-300">
              KEEPING MINES SAFE
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          &copy; 2026 Statera Mine Systems. All rights reserved.
        </p>
      </aside>

      <main className="flex flex-1 flex-col bg-stone-50">
        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-3 border-b border-zinc-200 pb-8">
              <h2 className="font-display text-5xl leading-none tracking-wide text-zinc-900">
                SIGN IN
              </h2>
              <p className="text-sm font-normal text-zinc-500">
                Enter your credentials to access the platform.
              </p>
            </div>

            <LoginForm initialError={initialError} />
          </div>
        </div>

        <p className="pb-8 text-center text-sm text-zinc-500">
          Having trouble?{" "}
          <span className="font-medium text-statera-orange">Contact site administrator</span>
        </p>
      </main>
    </div>
  );
}
