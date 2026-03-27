import { useEffect, useState } from "react";
import type { JSX } from "react";
import { AddIssueModal } from "../components/AddIssueModal";

type MenuItem = {
  label: string;
  active?: boolean;
};

type User = {
  name: string;
  role: string;
};

type PriorityItem = {
  id: string;
  assetId: string;
  category: "Inspection" | "Reported Issue" | "Corrective Action" | "Health Warning";
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
};

type Asset = {
  id: string;
  name: string;
};

type NewIssueInput = {
  assetId: string;
  issueType: string;
  severity: string;
  note: string;
  photoName?: string;
  reportedBy: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", active: true },
  { label: "Assets" },
  { label: "Inspections" },
  { label: "Issues" },
  { label: "Corrective Actions" },
  { label: "Health Warnings" },
  { label: "Reports" },
  { label: "Settings" },
];

const assets: Asset[] = [
  { id: "LB-12", name: "Lifting Beam LB-12" },
  { id: "LB-18", name: "Lifting Beam LB-18" },
  { id: "LB-21", name: "Lifting Beam LB-21" },
];

const priorityItems: PriorityItem[] = [
  {
    id: "1",
    assetId: "LB-12",
    category: "Reported Issue",
    title: "Visible wear near left lifting point",
    detail: "Reported twice in 21 days. Photo attached.",
    priority: "High",
  },
  {
    id: "2",
    assetId: "LB-12",
    category: "Inspection",
    title: "Inspection overdue",
    detail: "Inspection overdue by 12 days.",
    priority: "High",
  },
  {
    id: "3",
    assetId: "LB-21",
    category: "Reported Issue",
    title: "Corrosion near tag plate",
    detail: "Single low-severity report.",
    priority: "Medium",
  },
  {
    id: "4",
    assetId: "LB-18",
    category: "Inspection",
    title: "Inspection due tomorrow",
    detail: "Scheduled monthly lifting beam inspection.",
    priority: "Low",
  },
];

export default function Dashboard(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("LB-12");
  const [items, setItems] = useState<PriorityItem[]>(priorityItems);

  useEffect(() => {
    const stored = localStorage.getItem("statera-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleAddIssue = (issue: NewIssueInput) => {
    const newItem: PriorityItem = {
      id: String(Date.now()),
      assetId: issue.assetId,
      category: "Reported Issue",
      title: issue.issueType.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      detail: issue.note || "New reported issue.",
      priority: issue.severity === "high" ? "High" : issue.severity === "medium" ? "Medium" : "Low",
    };

    setItems((prev) => {
      const newList = [newItem, ...prev];
      const weight = { High: 3, Medium: 2, Low: 1 };
      return newList.sort((a, b) => weight[b.priority] - weight[a.priority]);
    });

    setIsAddIssueOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">STATERA</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium ${item.active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Priority Queue</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranked by urgency, repeat frequency, and unresolved risk
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  setSelectedAssetId("LB-12");
                  setIsAddIssueOpen(true);
                }}
              >
                Add Issue
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {user?.name ?? "User"}
                  </div>
                  <div className="text-xs uppercase text-slate-500">
                    {user?.role ?? "Role"}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-slate-300 bg-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl p-5 shadow-sm ring-1 ${item.priority === "High"
                  ? "bg-red-100 ring-red-500"
                  : item.priority === "Medium"
                    ? "bg-amber-100 ring-amber-400"
                    : "bg-white ring-slate-200"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.assetId}
                      </h3>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-2 text-base font-semibold text-slate-800">
                      {item.title}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {item.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isAddIssueOpen && (
        <AddIssueModal
          open={true}
          assets={assets}
          defaultAssetId={selectedAssetId}
          onClose={() => setIsAddIssueOpen(false)}
          onSubmit={handleAddIssue}
        />
      )}
    </div>
  );
}