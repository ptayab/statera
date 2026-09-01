import {
  IssueCard,
  IssueList,
  IssueListEmpty,
  type IssueCardItem,
} from "@/components/dashboard/IssueCard";
import { SimilarIssueGroup } from "@/components/dashboard/SimilarIssueGroup";
import { groupSimilarIssues } from "@/lib/tickets/similar";

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

  const groups = groupSimilarIssues(tickets);

  return (
    <IssueList>
      {groups.map((group, index) =>
        group.kind === "cluster" ? (
          <SimilarIssueGroup
            key={group.tickets.map((ticket) => ticket.id).join("-")}
            tickets={group.tickets}
            ranking={group.ranking}
            rank={ranked ? index + 1 : undefined}
            showAssignee={showAssignee}
            detailHref={detailHref}
          />
        ) : (
          <IssueCard
            key={group.ticket.id}
            item={group.ticket}
            href={detailHref(group.ticket.id)}
            rank={ranked ? index + 1 : undefined}
            showAssignee={showAssignee}
          />
        ),
      )}
    </IssueList>
  );
}
