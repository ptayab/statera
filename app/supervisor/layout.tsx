import { SupervisorNav } from "@/components/nav/SupervisorNav";
import { getUserProfile } from "@/lib/auth/session";
import { getUnreadTicketNotifications } from "@/lib/tickets/notifications";

export default async function SupervisorLayout({
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
      <SupervisorNav
        userLabel={profile?.name ?? profile?.email}
        notifications={notifications}
      />
      {children}
    </>
  );
}
