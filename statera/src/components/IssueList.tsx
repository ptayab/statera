import type { Asset, Issue } from '../types';

interface IssueListProps {
  issues: Issue[];
  assets: Asset[];
}

export function IssueList({ issues, assets }: IssueListProps) {
  const assetName = (assetId: string) =>
    assets.find((asset) => asset.id === assetId)?.name ?? assetId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Recent issues</h2>
        <p className="text-sm text-slate-500">New reports appear here as workers submit them.</p>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{assetName(issue.assetId)}</p>
              <p className="text-xs text-slate-500">{new Date(issue.createdAt).toLocaleString()}</p>
            </div>
            <p className="mt-1 text-sm text-slate-700">
              {issue.issueType} · {issue.severity}
            </p>
            <p className="mt-2 text-sm text-slate-600">{issue.note}</p>
            <p className="mt-2 text-xs text-slate-400">Reported by {issue.reportedBy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
