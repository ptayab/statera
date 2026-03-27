import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onAddIssue: (assetId: string) => void;
}

function badgeClasses(status: Asset['inspectionStatus']) {
  switch (status) {
    case 'overdue':
      return 'bg-red-100 text-red-700';
    case 'due':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-green-100 text-green-700';
  }
}

export function AssetCard({ asset, onAddIssue }: AssetCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{asset.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{asset.location}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(asset.inspectionStatus)}`}>
          {asset.inspectionStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <p className="text-slate-400">Open issues</p>
          <p className="font-medium text-slate-800">{asset.openIssues}</p>
        </div>
        <div>
          <p className="text-slate-400">Next inspection</p>
          <p className="font-medium text-slate-800">{asset.nextInspectionDue}</p>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        onClick={() => onAddIssue(asset.id)}
      >
        Add issue
      </button>
    </div>
  );
}
