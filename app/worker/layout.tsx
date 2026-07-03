import { WorkerNav } from "@/components/nav/WorkerNav";
import { getUserProfile } from "@/lib/auth/session";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getUserProfile();

  return (
    <>
      <WorkerNav userLabel={profile?.name ?? profile?.email} />
      {children}
    </>
  );
}
