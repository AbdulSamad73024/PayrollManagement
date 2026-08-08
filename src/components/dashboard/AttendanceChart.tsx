import React from 'react';

interface AttendanceChartProps {
  summary?: {
    present: number;
    leave: number;
    late: number;
    absent: number;
  };
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  summary = { present: 6, leave: 1, late: 1, absent: 0 },
}) => {
  const total = summary.present + summary.leave + summary.late + summary.absent || 1;
  const presentPct = Math.round((summary.present / total) * 100);
  const leavePct = Math.round((summary.leave / total) * 100);
  const latePct = Math.round((summary.late / total) * 100);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Today's Attendance Overview</h3>
        <p className="text-xs text-slate-500">Live workforce log status</p>
      </div>

      <div className="my-6">
        {/* Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${presentPct}%` }} className="bg-emerald-500 h-full" title={`Present: ${summary.present}`} />
          <div style={{ width: `${latePct}%` }} className="bg-amber-400 h-full" title={`Late: ${summary.late}`} />
          <div style={{ width: `${leavePct}%` }} className="bg-indigo-500 h-full" title={`On Leave: ${summary.leave}`} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <span className="text-xs text-emerald-800 font-medium">Present Today</span>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">{summary.present} Employees</div>
            <span className="text-[11px] text-emerald-700">{presentPct}% Turnout</span>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
            <span className="text-xs text-amber-800 font-medium">Late Arrival</span>
            <div className="text-lg font-bold text-amber-900 mt-0.5">{summary.late} Employees</div>
            <span className="text-[11px] text-amber-700">{latePct}% Workforce</span>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
            <span className="text-xs text-indigo-800 font-medium">Approved Leave</span>
            <div className="text-lg font-bold text-indigo-900 mt-0.5">{summary.leave} Employees</div>
            <span className="text-[11px] text-indigo-700">{leavePct}% Workforce</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Unexcused Absent</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{summary.absent} Employees</div>
            <span className="text-[11px] text-slate-500">0% Deficit</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center border-t border-slate-100 pt-3">
        Attendance rate: <span className="font-semibold text-emerald-600">92.5%</span> this month
      </div>
    </div>
  );
};
