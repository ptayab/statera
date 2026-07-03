import { SupervisorNav } from "@/components/nav/SupervisorNav";
import { getUserProfile } from "@/lib/auth/session";

export default async function SupervisorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getUserProfile();

  return (
    <>
      <SupervisorNav userLabel={profile?.name ?? profile?.email} />
      {children}
    </>
  );
}
