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
};

export function TicketList({
  tickets,
  showAssignee = true,
  emptyMessage = "No issues match these filters yet.",
  detailHref = (ticketId) => `/supervisor/${ticketId}`,
}: TicketListProps) {
  if (tickets.length === 0) {
    return <IssueListEmpty message={emptyMessage} />;
  }

  return (
    <IssueList>
      {tickets.map((ticket) => (
        <IssueCard
          key={ticket.id}
          item={ticket}
          href={detailHref(ticket.id)}
          showAssignee={showAssignee}
        />
      ))}
    </IssueList>
  );
}
