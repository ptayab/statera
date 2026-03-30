import type { Asset, Issue } from '../types';

export const initialAssets: Asset[] = [
    // {
    //     id: 'LB-30',
    //     name: 'Lifting Beam LB-30',
    //     inspectionStatus: 'due',
    //     openIssueCount: 0,
    //     location: 'Ore Pass 4',
    //     lastInspectionDate: '2026-03-02',
    //     nextInspectionDue: '2026-03-29',
    //     openIssues: 0,
    // },
    {
        id: 'LB-12',
        name: 'Lifting Beam LB-12',
        inspectionStatus: 'overdue',
        openIssueCount: 1,
        location: 'North Drift',
        lastInspectionDate: '2026-02-29',
        nextInspectionDue: '2026-03-29',
        openIssues: 1,
    },
    {
        id: 'LB-18',
        name: 'Lifting Beam LB-18',
        inspectionStatus: 'up_to_date',
        openIssueCount: 0,
        location: 'Workshop Bay 2',
        lastInspectionDate: '2026-03-21',
        nextInspectionDue: '2026-04-21',
        openIssues: 0,
    },
    {
        id: 'LB-21',
        name: 'Lifting Beam LB-21',
        inspectionStatus: 'due',
        openIssueCount: 0,
        location: 'Ore Pass 4',
        lastInspectionDate: '2026-03-02',
        nextInspectionDue: '2026-03-29',
        openIssues: 0,
    },

];

export const initialIssues: Issue[] = [
    {
        id: 'ISS-1001',
        assetId: 'LB-12',
        assetName: 'Lifting Beam LB-12',
        issueType: 'visible wear',
        severity: 'medium',
        note: 'Wear visible near left lifting point.',
        createdAt: '2026-03-14T09:30:00Z',
        status: 'open',
        reportedBy: 'John Doe',
    },
];
