import React from 'react';
import { SalaryEarnings, SalaryDeductions } from '../../types/salary';
import { formatCurrency } from '../../utils/formatters';
import './SalaryBreakdown.css';

interface SalaryBreakdownProps {
  basicSalary: number;
  earnings: SalaryEarnings;
  deductions: SalaryDeductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({
  earnings,
  deductions,
  grossSalary,
  totalDeductions,
  netSalary,
}) => {
  return (
    <div className="salary-breakdown-card">
      <div className="salary-breakdown-grid">
        {/* Earnings Column */}
        <div className="salary-column salary-column--earnings">
          <div className="salary-column-header">
            <h4>Monthly Earnings</h4>
            <span className="salary-badge salary-badge--green">Credit</span>
          </div>
          <div className="salary-items-list">
            <div className="salary-item">
              <span className="salary-item-label">Basic Salary</span>
              <span className="salary-item-value">{formatCurrency(earnings.basicSalary)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">House Rent Allowance (HRA)</span>
              <span className="salary-item-value">{formatCurrency(earnings.hra)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Conveyance Allowance</span>
              <span className="salary-item-value">{formatCurrency(earnings.conveyance)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Medical Allowance</span>
              <span className="salary-item-value">{formatCurrency(earnings.medicalAllowance)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Special Allowance</span>
              <span className="salary-item-value">{formatCurrency(earnings.specialAllowance)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Other Allowance</span>
              <span className="salary-item-value">{formatCurrency(earnings.otherAllowance)}</span>
            </div>
          </div>
          <div className="salary-total-row salary-total-row--gross">
            <span>Gross Salary (Total Earnings)</span>
            <span>{formatCurrency(grossSalary)}</span>
          </div>
        </div>

        {/* Deductions Column */}
        <div className="salary-column salary-column--deductions">
          <div className="salary-column-header">
            <h4>Statutory Deductions</h4>
            <span className="salary-badge salary-badge--red">Debit</span>
          </div>
          <div className="salary-items-list">
            <div className="salary-item">
              <span className="salary-item-label">Provident Fund (PF)</span>
              <span className="salary-item-value">{formatCurrency(deductions.pf)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Employee State Insurance (ESI)</span>
              <span className="salary-item-value">{formatCurrency(deductions.esi)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Professional Tax (PT)</span>
              <span className="salary-item-value">{formatCurrency(deductions.professionalTax)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Tax Deducted at Source (TDS)</span>
              <span className="salary-item-value">{formatCurrency(deductions.tds)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Loan Recovery</span>
              <span className="salary-item-value">{formatCurrency(deductions.loanDeduction)}</span>
            </div>
            <div className="salary-item">
              <span className="salary-item-label">Other Deductions</span>
              <span className="salary-item-value">{formatCurrency(deductions.otherDeduction)}</span>
            </div>
          </div>
          <div className="salary-total-row salary-total-row--deductions">
            <span>Total Statutory Deductions</span>
            <span>{formatCurrency(totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Net Payable Highlight Banner */}
      <div className="salary-net-banner">
        <div className="salary-net-title">
          <span className="salary-net-label">NET TAKE-HOME PAY</span>
          <span className="salary-net-formula">( Gross Earnings - Total Deductions )</span>
        </div>
        <div className="salary-net-amount">{formatCurrency(netSalary)}</div>
      </div>
    </div>
  );
};
