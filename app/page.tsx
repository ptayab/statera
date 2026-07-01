import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/session";
import { homePathForRole } from "@/lib/auth/routes";

export default async function Home() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  redirect(homePathForRole(profile.role));
}
