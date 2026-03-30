import type { JSX } from 'react';
import type { PriorityItem } from '../pages/Dashboard';

interface IssueDetailModalProps {
  item: PriorityItem;
  assetStatus?: string;
  onClose: () => void;
  onMarkInProgress: () => void;
  onMarkAssetOutOfService: () => void;
}

export function IssueDetailModal({
  item,
  assetStatus,
  onClose,
  onMarkInProgress,
  onMarkAssetOutOfService,
}: IssueDetailModalProps): JSX.Element | null {
  if (!item) return null;

  const isInProgress = item.status === 'In Progress';
  const isOutOfService = assetStatus === 'out_of_service';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-slate-900">{item.assetId}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {item.category}
              </span>
              {isOutOfService && (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 ring-1 ring-red-300">
                  Out of Service
                </span>
              )}
            </div>
            <h3 className="text-lg font-medium text-slate-800">{item.title}</h3>
          </div>
          <button
            type="button"
            className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="text-xs text-slate-500 mb-1">Reported By</div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {(item.reportedBy || 'U')[0].toUpperCase()}
                </div>
                <div className="text-sm font-medium text-slate-900">{item.reportedBy || 'Unknown'}</div>
              </div>
            </div>
            
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="text-xs text-slate-500 mb-1">Assigned To</div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {(item.assignedTo || 'U')[0].toUpperCase()}
                </div>
                <div className="text-sm font-medium text-slate-900">{item.assignedTo || 'Unassigned'}</div>
              </div>
            </div>

            {item.category === 'Inspection' && (
              <div className="rounded-xl border border-slate-100 p-4">
                <div className="text-xs text-slate-500 mb-1">Inspection Due Date</div>
                <div className="text-sm font-medium text-slate-900">{item.dueDate || 'Not Set'}</div>
              </div>
            )}
            
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <div className="text-sm font-medium text-slate-900">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  item.status === 'Open' ? 'bg-blue-50 text-blue-800 ring-blue-700/20' :
                  item.status === 'In Progress' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                  item.status === 'Resolved' ? 'bg-green-50 text-green-800 ring-green-600/20' :
                  'bg-gray-50 text-gray-800 ring-gray-600/20'
                }`}>
                  {item.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 p-4">
            <div className="text-sm font-medium text-slate-900 mb-4">History Log</div>
            <ol className="relative border-l border-slate-200 ml-2">
                <li className="mb-4 ml-4">
                    <div className="absolute w-2 h-2 bg-slate-300 rounded-full mt-1.5 -left-1 border border-white"></div>
                    <time className="mb-1 text-xs font-normal leading-none text-slate-400">
                      {item.reportedAt ? new Date(item.reportedAt).toLocaleString() : 'Date unavailable'}
                    </time>
                    <p className="text-sm font-medium text-slate-900">
                      {item.category === 'Inspection' ? 'Inspection Scheduled' : 'Issue Reported'}
                    </p>
                    <p className="text-xs text-slate-500">By {item.reportedBy || 'System'}</p>
                </li>
                 <li className="mb-2 ml-4">
                    <div className="absolute w-2 h-2 bg-slate-300 rounded-full mt-1.5 -left-1 border border-white"></div>
                    <time className="mb-1 text-xs font-normal leading-none text-slate-400">
                      {item.reportedAt ? new Date(item.reportedAt).toLocaleString() : 'Date unavailable'}
                    </time>
                    <p className="text-sm font-medium text-slate-900">
                      Assigned Action Item
                    </p>
                    <p className="text-xs text-slate-500">To {item.assignedTo || 'Unassigned'}</p>
                </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-1 border-t border-slate-100">
            <button
              type="button"
              disabled={isInProgress}
              onClick={onMarkInProgress}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isInProgress
                  ? 'bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200 cursor-default'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
              }`}
            >
              {isInProgress ? '✓ In Progress' : 'Mark as In Progress'}
            </button>
            <button
              type="button"
              disabled={isOutOfService}
              onClick={onMarkAssetOutOfService}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isOutOfService
                  ? 'bg-slate-100 text-slate-400 ring-1 ring-slate-200 cursor-default'
                  : 'bg-slate-900 text-white hover:bg-slate-700 active:bg-slate-800'
              }`}
            >
              {isOutOfService ? '✓ Asset Out of Service' : 'Mark Asset Out of Service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
