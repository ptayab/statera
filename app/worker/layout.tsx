import { WorkerNav } from "@/components/nav/WorkerNav";
import { getUserProfile } from "@/lib/auth/session";
import { getUnreadTicketNotifications } from "@/lib/tickets/notifications";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getUserProfile();
  const notifications = profile
    ? await getUnreadTicketNotifications(profile)
    : [];

  return (
    <>
      <WorkerNav
        userLabel={profile?.name ?? profile?.email}
        notifications={notifications}
      />
      {children}
    </>
  );
}
