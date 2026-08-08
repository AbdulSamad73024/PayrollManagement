export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  departmentId?: number | 'ALL';
  employeeId?: number | 'ALL';
  status?: string | 'ALL';
}

export interface SummaryMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}
