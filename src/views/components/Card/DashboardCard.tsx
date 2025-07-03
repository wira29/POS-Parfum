import { ReactNode } from "react";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
}

export function DashboardCard({
  icon,
  title,
  value,
  footerLeft,
  footerRight,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 hover:scale-105 transition-all duration-300 ease-in-out border border-gray-300">
      <div className="flex flex-col items-start">
        {icon}
        <h2 className="text-sm font-normal mt-2 text-slate-400">{title}</h2>
        <h1 className="font-bold my-1.5 text-xl">{value}</h1>
        <div className="flex items-center gap-3">
          {footerLeft && (
            <div className="flex items-center gap-1">{footerLeft}</div>
          )}
          {footerRight && (
            <div className="text-sm text-slate-500">{footerRight}</div>
          )}
        </div>
      </div>
    </div>
  );
}
