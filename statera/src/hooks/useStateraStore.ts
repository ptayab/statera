import { useMemo, useState } from 'react';
import { initialAssets, initialIssues } from '../data/mockData';
import type { Asset, Issue } from '../types';

export interface NewIssueInput {
    assetId: string;
    assetName: string;
    issueType: Issue['issueType'];
    severity: Issue['severity'];
    note: string;
    photoName?: string;
    reportedBy: string;
    assignedTo?: string;
}

export function useStateraStore() {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [issues, setIssues] = useState<Issue[]>(initialIssues);

    const addIssue = (input: NewIssueInput) => {
        const newIssue: Issue = {
            id: `ISS-${Date.now()}`,
            assetId: input.assetId,
            assetName: input.assetName,
            issueType: input.issueType,
            severity: input.severity,
            note: input.note,
            photoName: input.photoName,
            reportedBy: input.reportedBy,
            createdAt: new Date().toISOString(),
            status: 'open',
            assignedTo: input.assignedTo,
        };

        setIssues((current) => [newIssue, ...current]);
        setAssets((current) =>
            current.map((asset) =>
                asset.id === input.assetId
                    ? { ...asset, openIssues: asset.openIssues + 1 }
                    : asset,
            ),
        );
    };

    const assetsByPriority = useMemo(() => {
        return [...assets].sort((a, b) => {
            const score = (asset: Asset) => {
                let total = asset.openIssueCount;
                if (asset.inspectionStatus === 'overdue') total += 3;
                if (asset.inspectionStatus === 'due') total += 1;
                return total;
            };
            return score(b) - score(a);
        });
    }, [assets]);

    return {
        assets,
        assetsByPriority,
        issues,
        addIssue,
    };
}
