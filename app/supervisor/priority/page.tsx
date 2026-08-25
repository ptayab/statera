import { redirect } from "next/navigation";

export default function PriorityIssuesRedirect() {
  redirect("/supervisor/open?sort=priority");
}
