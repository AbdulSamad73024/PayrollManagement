import React from 'react';

interface SalaryExpenseChartProps {
  monthlyData?: { month: string; amount: number; count: number }[];
}

export const SalaryExpenseChart: React.FC<SalaryExpenseChartProps> = ({
  monthlyData = [
    { month: 'Mar 2026', amount: 980000, count: 7 },
    { month: 'Apr 2026', amount: 1020000, count: 8 },
    { month: 'May 2026', amount: 1020000, count: 8 },
    { month: 'Jun 2026', amount: 1050000, count: 8 },
    { month: 'Jul 2026', amount: 1118000, count: 8 },
    { month: 'Aug 2026', amount: 1118000, count: 8 },
  ],
}) => {
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount), 1200000);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Salary Expense Trend</h3>
          <p className="text-xs text-slate-500">Gross monthly salary expenditure (INR)</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-indigo-600">₹1,118,000</span>
          <p className="text-[11px] text-emerald-600 font-medium">↑ +6.4% from last qtr</p>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
        {monthlyData.map((item, idx) => {
          const heightPercent = Math.round((item.amount / maxAmount) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[11px] py-1 px-2 rounded shadow-lg z-10 whitespace-nowrap">
                <span>₹{(item.amount / 100000).toFixed(2)} Lakhs</span>
                <span className="text-slate-300">{item.count} Employees</span>
              </div>
              
              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[2.25rem] rounded-t-md transition-all duration-300 ${
                  idx === monthlyData.length - 1
                    ? 'bg-indigo-600 group-hover:bg-indigo-700'
                    : 'bg-indigo-200 group-hover:bg-indigo-300'
                }`}
              />
              <span className="text-[11px] text-slate-500 font-medium mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
          <span>Current Period</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-indigo-200 inline-block" />
          <span>Historical Months</span>
        </div>
      </div>
    </div>
  );
};
