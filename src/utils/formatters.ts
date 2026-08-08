/**
 * Currency formatter for Indian Rupees / USD
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'INR' ? 'INR' : 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ISO date string into readable standard date (e.g. 15 Aug 2026)
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Converts month number (1-12) to Month Name
 */
export const getMonthName = (monthNumber: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || `Month ${monthNumber}`;
};

/**
 * Calculates calendar days between two date strings (inclusive)
 */
export const calculateDaysBetween = (fromDateStr: string, toDateStr: string): number => {
  if (!fromDateStr || !toDateStr) return 1;
  const start = new Date(fromDateStr);
  const end = new Date(toDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};

/**
 * Returns Tailwind badge classes based on status
 */
export const getStatusBadgeClass = (status: string): string => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'active':
    case 'approved':
    case 'present':
    case 'processed':
    case 'locked':
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'processing':
    case 'half day':
    case 'on leave':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'inactive':
    case 'rejected':
    case 'absent':
    case 'cancelled':
    case 'terminated':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'holiday':
    case 'leave':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};
