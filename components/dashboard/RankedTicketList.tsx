import {
  IssueCard,
  IssueList,
  IssueListEmpty,
} from "@/components/dashboard/IssueCard";
import type { RankedTicketListItem } from "@/lib/tickets/queries";

type RankedTicketListProps = {
  tickets: RankedTicketListItem[];
  emptyMessage?: string;
};

/** Priority queue — numbered so the running order is unambiguous. */
export function RankedTicketList({
  tickets,
  emptyMessage = "No open issues to rank right now.",
}: RankedTicketListProps) {
  if (tickets.length === 0) {
    return <IssueListEmpty message={emptyMessage} />;
  }

  return (
    <IssueList>
      {tickets.map((ticket, index) => (
        <IssueCard
          key={ticket.id}
          item={ticket}
          href={`/supervisor/${ticket.id}`}
          rank={index + 1}
        />
      ))}
    </IssueList>
  );
}
