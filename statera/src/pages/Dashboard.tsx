import type { JSX } from 'react';
import { useEffect, useState } from 'react';

type MenuItem = {
  label: string;
  active?: boolean;
};

type User = {
  name: string;
  role: string;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', active: true },
  { label: 'Assets' },
  { label: 'Inspections' },
  { label: 'Issues' },
  { label: 'Corrective Actions' },
  { label: 'Health Warnings' },
  { label: 'Reports' },
  { label: 'Settings' },
];

export default function Dashboard(): JSX.Element {

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('statera-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
                    className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium ${
                    item.active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    {item.label}
                </button>
                ))}
            </nav>
            </aside>

            <main className="flex-1 p-6">
<<<<<<< HEAD
            {/* Top bar */}
=======
>>>>>>> a45e6c7 (completed basic home page)
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                        {user ? user.name : 'Guest'}
                    </div>
                    <div className="text-xs uppercase text-slate-500">
                        {user ? user.role : 'No Role'}
                    </div>
                </div>
<<<<<<< HEAD

                {/* Avatar circle */}
=======
>>>>>>> a45e6c7 (completed basic home page)
                <div className="w-10 h-10 rounded-full border border-slate-300 bg-white" />
                </div>
            </div>

<<<<<<< HEAD
            {/* Main content placeholder */}
=======
>>>>>>> a45e6c7 (completed basic home page)
            <div className="rounded-xl bg-white p-6 shadow-sm">
                Main content
            </div>
            </main>
        </div>
        </div>
    );
}