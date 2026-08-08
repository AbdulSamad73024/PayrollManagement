import React, { useState, useEffect } from 'react';
import { Calendar, Save, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types/attendance';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { ToastMessage } from '../../components/common/ToastNotification';

interface DailyAttendancePageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const DailyAttendancePage: React.FC<DailyAttendancePageProps> = ({ addToast }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const list = await attendanceService.getDailyAttendance(date);
      setRecords(list);
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to load attendance logs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const handleStatusChange = (id: number, status: AttendanceRecord['status']) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const workHours = status === 'Present' || status === 'Late' ? 8 : status === 'Half Day' ? 4 : 0;
          return { ...r, status, workHours };
        }
        return r;
      })
    );
  };

  const handleTimeChange = (id: number, field: 'checkIn' | 'checkOut', value: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleBulkMark = (status: AttendanceRecord['status']) => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status,
        workHours: status === 'Present' ? 8 : 0,
      }))
    );
    addToast({ type: 'info', message: `Marked all employees as ${status}.` });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await attendanceService.saveDailyAttendance(date, records);
      addToast({ type: 'success', message: 'Daily attendance logs saved successfully!' });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to save attendance records.' });
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeCode',
      header: 'Emp Code',
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.employeeCode}</span>,
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.employeeName}</div>
          <div className="text-[11px] text-slate-500">{row.departmentName}</div>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'In Time',
      render: (row) => (
        <input
          type="text"
          value={row.checkIn || '09:00 AM'}
          onChange={(e) => handleTimeChange(row.id, 'checkIn', e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-xs outline-none w-24"
        />
      ),
    },
    {
      key: 'checkOut',
      header: 'Out Time',
      render: (row) => (
        <input
          type="text"
          value={row.checkOut || '06:00 PM'}
          onChange={(e) => handleTimeChange(row.id, 'checkOut', e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-xs outline-none w-24"
        />
      ),
    },
    {
      key: 'workHours',
      header: 'Hours',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-800">{row.workHours || 8} hrs</span>,
    },
    {
      key: 'status',
      header: 'Attendance Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
          className={`border rounded px-2 py-1 text-xs font-bold outline-none ${
            row.status === 'Present'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : row.status === 'Late'
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : row.status === 'Leave'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
              : 'bg-rose-50 text-rose-700 border-rose-300'
          }`}
        >
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
          <option value="Leave">Leave</option>
          <option value="Absent">Absent</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Daily Attendance Tracker</h1>
          <p className="text-xs text-slate-500">Log punch times, working hours, and daily attendance status</p>
        </div>
        <SubmitButton loading={saving} icon={<Save size={16} />} onClick={handleSave}>
          Save Attendance Sheet
        </SubmitButton>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Select Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-900 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Quick Mark All:</span>
          <button
            onClick={() => handleBulkMark('Present')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleBulkMark('Leave')}
            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 text-xs font-bold hover:bg-indigo-100"
          >
            Mark All Leave
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable columns={columns} data={records} keyField="id" isLoading={loading} />
    </div>
  );
};
