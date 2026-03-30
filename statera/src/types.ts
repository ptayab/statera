export type InspectionStatus = "up_to_date" | "due" | "overdue";

export type IssueType =
    | "visible wear"
    | "crack"
    | "deformation"
    | "corrosion"
    | "damaged tag"
    | "other";

export type Severity = "low" | "medium" | "high";

export interface Asset {
    openIssues: number;
    id: string;
    name: string;
    location: string;
    inspectionStatus: InspectionStatus;
    lastInspectionDate: string;
    nextInspectionDue: string;
    openIssueCount: number;
}

export interface Issue {
    id: string;
    assetId: string;
    assetName: string;
    issueType: IssueType;
    severity: Severity;
    note: string;
    createdAt: string;
    photoName?: string;
    reportedBy: string;
    status: "open" | "closed";
    assignedTo?: string;
}