import type { JSX } from "react";

type FieldProps = {
  label: string;
  type?: string;
  value: string;
};

export default function Field({ label, type = 'text', value }: FieldProps): JSX.Element {
  return (
    <div>
      <input
        type={type}
        value={value}
        readOnly
        placeholder={label}
        className="w-full rounded-xl border border-slate-200 bg-white px-5 py-5 text-[18px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}