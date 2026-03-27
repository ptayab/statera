import { useMemo, useState } from 'react';
import type { Asset, IssueType, Severity } from '../types';
import type { NewIssueInput } from '../hooks/useStateraStore';

interface AddIssueModalProps {
  open: boolean;
  assets: Asset[];
  defaultAssetId?: string;
  onClose: () => void;
  onSubmit: (issue: NewIssueInput) => void;
}

const issueTypes: IssueType[] = [
  "visible_wear",
  "crack",
  "deformation",
  "corrosion",
  "damaged_tag",
  "other",
];

const severityOptions: Severity[] = ['low', 'medium', 'high'];

export function AddIssueModal({
  open,
  assets,
  defaultAssetId,
  onClose,
  onSubmit,
}: AddIssueModalProps) {
  const firstAssetId = useMemo(() => assets[0]?.id ?? '', [assets]);
  const [assetId, setAssetId] = useState(defaultAssetId ?? firstAssetId);
  const [issueType, setIssueType] = useState<IssueType>('visible_wear');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [note, setNote] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [reportedBy, setReportedBy] = useState('A. Worker');

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      assetId: assetId || defaultAssetId || firstAssetId,
      assetName: assets.find((a) => a.id === assetId)?.name || '',
      issueType,
      severity,
      note,
      photoName: photoName || undefined,
      reportedBy,
    });

    setNote('');
    setPhotoName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Add issue</h2>
            <p className="text-sm text-slate-500">Log a lifting beam concern in under a minute.</p>
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Asset</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={assetId || defaultAssetId || firstAssetId}
              onChange={(e) => setAssetId(e.target.value)}
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Issue type</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
              >
                {issueTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Severity</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
              >
                {severityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Short note</label>
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Describe what the worker saw on the lifting beam."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Photo filename</label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="lb12-wear-2.jpg"
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Reported by</label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Save issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
