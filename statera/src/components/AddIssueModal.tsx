import { useMemo, useState, useRef } from 'react';
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
  "visible wear",
  "crack",
  "deformation",
  "corrosion",
  "damaged tag",
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstAssetId = useMemo(() => assets[0]?.id ?? '', [assets]);
  const [assetId, setAssetId] = useState(defaultAssetId ?? firstAssetId);
  const [issueType, setIssueType] = useState<IssueType>('visible wear');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [note, setNote] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [reportedBy, setReportedBy] = useState('Worker One');
  const [assignedTo, setAssignedTo] = useState('Unassigned');
  const [customAssignee, setCustomAssignee] = useState('');
  const [isCustomAssignment, setIsCustomAssignment] = useState(false);

  if (!open) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
    }
    // Reset value so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
      assignedTo: isCustomAssignment ? customAssignee : assignedTo,
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Photo / Evidence</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Capture or filename..."
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                  />
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-colors"
                >
                  Upload
                </button>
              </div>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Assign To</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={isCustomAssignment ? 'custom' : assignedTo}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomAssignment(true);
                  } else {
                    setIsCustomAssignment(false);
                    setAssignedTo(e.target.value);
                  }
                }}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Maintenance Team One">Maintenance Team One</option>
                <option value="Supervisor One">Supervisor One</option>
                <option value="Supervisor Two">Supervisor Two</option>
                <option value="Maintenance Team Two">Maintenance Team Two</option>
                <option value="custom">Custom...</option>
              </select>
            </div>

            {isCustomAssignment && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Custom Assignee</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Enter name"
                  value={customAssignee}
                  onChange={(e) => setCustomAssignee(e.target.value)}
                  required
                />
              </div>
            )}
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
