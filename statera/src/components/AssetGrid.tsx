import type { Asset } from '../types';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onAddIssue: (assetId: string) => void;
}

export function AssetGrid({ assets, onAddIssue }: AssetGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Lifting beams</h2>
          <p className="text-sm text-slate-500">Track inspection status and log issues quickly.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onAddIssue={onAddIssue} />
        ))}
      </div>
    </section>
  );
}
