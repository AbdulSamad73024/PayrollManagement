import React from 'react';
import { Printer, Download, Mail, Building2, CheckCircle } from 'lucide-react';
import { PayslipData } from '../../types/payroll';
import { formatCurrency, formatDate, getMonthName } from '../../utils/formatters';
import { printElementById } from '../../utils/exportUtils';
import './PayslipView.css';

interface PayslipViewProps {
  payslipData: PayslipData;
  onSendEmail?: () => void;
}

export const PayslipView: React.FC<PayslipViewProps> = ({ payslipData, onSendEmail }) => {
  const { companyName, companyAddress, companyPhone, companyEmail, payroll } = payslipData;

  const handlePrint = () => {
    printElementById('payslip-printable-document');
  };

  return (
    <div className="payslip-wrapper">
      {/* Top Action Toolbar */}
      <div className="payslip-toolbar no-print">
        <div className="payslip-status-tag">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>Status: {payroll.status}</span>
        </div>
        <div className="payslip-action-buttons">
          {onSendEmail && (
            <button className="payslip-btn payslip-btn--email" onClick={onSendEmail}>
              <Mail size={16} /> Email Payslip
            </button>
          )}
          <button className="payslip-btn payslip-btn--print" onClick={handlePrint}>
            <Printer size={16} /> Print Payslip
          </button>
          <button className="payslip-btn payslip-btn--download" onClick={handlePrint}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div id="payslip-printable-document" className="payslip-document">
        {/* Company Header */}
        <div className="payslip-header">
          <div className="payslip-company-branding">
            <div className="payslip-company-icon">
              <Building2 size={28} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="payslip-company-name">{companyName}</h2>
              <p className="payslip-company-address">{companyAddress}</p>
              <p className="payslip-company-contact">Ph: {companyPhone} | Email: {companyEmail}</p>
            </div>
          </div>
          <div className="payslip-title-badge">
            <h3>PAYSLIP FOR {getMonthName(payroll.month).toUpperCase()} {payroll.year}</h3>
            <span className="payslip-code">{payroll.payrollCode}</span>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="payslip-employee-grid">
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Employee Code:</span>
            <span className="payslip-detail-val">{payroll.employeeCode}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Employee Name:</span>
            <span className="payslip-detail-val font-semibold">{payroll.employeeName}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Department:</span>
            <span className="payslip-detail-val">{payroll.departmentName}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Designation:</span>
            <span className="payslip-detail-val">{payroll.designationName}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Working Days:</span>
            <span className="payslip-detail-val">{payroll.workingDays} Days</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Payable Days:</span>
            <span className="payslip-detail-val">{payroll.payableDays} Days</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Bank Name:</span>
            <span className="payslip-detail-val">{payroll.bankName}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">Account Number:</span>
            <span className="payslip-detail-val">{payroll.accountNumber}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">IFSC Code:</span>
            <span className="payslip-detail-val">{payroll.ifsc}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">PAN Number:</span>
            <span className="payslip-detail-val">{payroll.pan}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">PF Number / UAN:</span>
            <span className="payslip-detail-val">{payroll.uan || payroll.pfNumber}</span>
          </div>
          <div className="payslip-detail-row">
            <span className="payslip-detail-label">ESI Number:</span>
            <span className="payslip-detail-val">{payroll.esiNumber || 'N/A'}</span>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <table className="payslip-table">
          <thead>
            <tr>
              <th className="payslip-th payslip-th--earnings">EARNINGS</th>
              <th className="payslip-th payslip-th--amount">AMOUNT (₹)</th>
              <th className="payslip-th payslip-th--deductions">DEDUCTIONS</th>
              <th className="payslip-th payslip-th--amount">AMOUNT (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="payslip-td">Basic Salary</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.basicSalary)}</td>
              <td className="payslip-td">Provident Fund (PF)</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.pf)}</td>
            </tr>
            <tr>
              <td className="payslip-td">House Rent Allowance (HRA)</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.hra)}</td>
              <td className="payslip-td">Employee State Insurance (ESI)</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.esi)}</td>
            </tr>
            <tr>
              <td className="payslip-td">Conveyance Allowance</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.conveyance)}</td>
              <td className="payslip-td">Professional Tax (PT)</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.professionalTax)}</td>
            </tr>
            <tr>
              <td className="payslip-td">Medical Allowance</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.medicalAllowance)}</td>
              <td className="payslip-td">TDS (Income Tax)</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.tds)}</td>
            </tr>
            <tr>
              <td className="payslip-td">Special Allowance</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.specialAllowance)}</td>
              <td className="payslip-td">Loan Deduction</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.loanDeduction)}</td>
            </tr>
            <tr>
              <td className="payslip-td">Other Allowance</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.earnings.otherAllowance)}</td>
              <td className="payslip-td">Other Deduction</td>
              <td className="payslip-td payslip-td--amount">{formatCurrency(payroll.deductions.otherDeduction)}</td>
            </tr>
            <tr className="payslip-total-row">
              <td className="payslip-td font-bold">TOTAL GROSS EARNINGS</td>
              <td className="payslip-td payslip-td--amount font-bold text-emerald-700">
                {formatCurrency(payroll.grossSalary)}
              </td>
              <td className="payslip-td font-bold">TOTAL DEDUCTIONS</td>
              <td className="payslip-td payslip-td--amount font-bold text-rose-700">
                {formatCurrency(payroll.totalDeductions)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Net Take Home Banner */}
        <div className="payslip-net-box">
          <div className="payslip-net-info">
            <span className="payslip-net-title">NET PAYABLE AMOUNT:</span>
            <span className="payslip-net-text">
              Amount Credited to Bank Account ({payroll.paymentMode})
            </span>
          </div>
          <div className="payslip-net-val">{formatCurrency(payroll.netSalary)}</div>
        </div>

        {/* Footer & Signatures */}
        <div className="payslip-footer-signatures">
          <div className="payslip-sig-box">
            <p className="payslip-sig-text">Computer generated document. No physical signature required.</p>
            <p className="payslip-sig-sub">Generated on {formatDate(new Date().toISOString())}</p>
          </div>
          <div className="payslip-sig-auth">
            <div className="payslip-sig-line" />
            <p className="payslip-sig-auth-title">Authorized Signatory</p>
            <p className="payslip-sig-auth-sub">{companyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
