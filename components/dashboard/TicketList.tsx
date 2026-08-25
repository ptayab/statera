import {
  IssueCard,
  IssueList,
  IssueListEmpty,
  type IssueCardItem,
} from "@/components/dashboard/IssueCard";

type TicketListProps = {
  tickets: IssueCardItem[];
  showAssignee?: boolean;
  emptyMessage?: string;
  detailHref?: (ticketId: string) => string;
  /** Number the list when it is an explicit running order. */
  ranked?: boolean;
};

export function TicketList({
  tickets,
  showAssignee = true,
  emptyMessage = "No issues match these filters yet.",
  detailHref = (ticketId) => `/supervisor/${ticketId}`,
  ranked = false,
}: TicketListProps) {
  if (tickets.length === 0) {
    return <IssueListEmpty message={emptyMessage} />;
  }

  return (
    <IssueList>
      {tickets.map((ticket, index) => (
        <IssueCard
          key={ticket.id}
          item={ticket}
          href={detailHref(ticket.id)}
          rank={ranked ? index + 1 : undefined}
          showAssignee={showAssignee}
        />
      ))}
    </IssueList>
  );
}
