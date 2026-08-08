import React, { useState } from 'react';
import { Settings, Building2, Calculator, Database, Save, CheckCircle } from 'lucide-react';
import { FormInput } from '../../components/forms/FormInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { ToastMessage } from '../../components/common/ToastNotification';

interface SettingsPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ addToast }) => {
  const [saving, setSaving] = useState(false);

  // Form State
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Enterprise Technologies Pvt Ltd',
    companyAddress: '100 Cyber City, Phase 2, IT Park, Bangalore, KA 560100',
    companyPhone: '+91 80 4123 8800',
    companyEmail: 'payroll@enterprise.com',
    currency: 'INR (₹)',
  });

  const [statutoryInfo, setStatutoryInfo] = useState({
    pfRate: 12,
    esiRate: 0.75,
    ptStandard: 200,
    tdsRate: 10,
    pfCapLimit: 15000,
  });

  const [apiConfig, setApiConfig] = useState({
    apiEndpointUrl: 'https://api.payroll.enterprise.com/v1',
    apiKey: 'pk_live_99a88b77c66d55e44f332211',
    sqlServerHost: 'sql-prod-db.database.windows.net',
    databaseName: 'EnterprisePayrollDB',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({
        type: 'success',
        message: 'System settings, statutory rules, and .NET API configurations updated.',
      });
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">System Settings & Statutory Config</h1>
          <p className="text-xs text-slate-500">Corporate parameters, tax deduction formulas, and backend integration endpoints</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company Settings */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-900 text-sm">Company Profile & Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Company Legal Name"
              value={companyInfo.companyName}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
              required
            />
            <FormInput
              label="Corporate Email"
              type="email"
              value={companyInfo.companyEmail}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyEmail: e.target.value })}
              required
            />
            <FormInput
              label="Contact Phone Number"
              value={companyInfo.companyPhone}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyPhone: e.target.value })}
            />
            <FormInput
              label="Payroll Base Currency"
              value={companyInfo.currency}
              onChange={(e) => setCompanyInfo({ ...companyInfo, currency: e.target.value })}
            />
          </div>
          <FormInput
            label="Corporate Registered Address"
            value={companyInfo.companyAddress}
            onChange={(e) => setCompanyInfo({ ...companyInfo, companyAddress: e.target.value })}
          />
        </div>

        {/* Statutory Deduction Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Calculator className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-900 text-sm">Statutory Deduction Rules (PF, ESI, PT, TDS)</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Employee PF Contribution (%)"
              type="number"
              value={statutoryInfo.pfRate}
              onChange={(e) => setStatutoryInfo({ ...statutoryInfo, pfRate: Number(e.target.value) })}
            />
            <FormInput
              label="ESI Employee Contribution (%)"
              type="number"
              step="0.01"
              value={statutoryInfo.esiRate}
              onChange={(e) => setStatutoryInfo({ ...statutoryInfo, esiRate: Number(e.target.value) })}
            />
            <FormInput
              label="Standard Professional Tax (₹)"
              type="number"
              value={statutoryInfo.ptStandard}
              onChange={(e) => setStatutoryInfo({ ...statutoryInfo, ptStandard: Number(e.target.value) })}
            />
            <FormInput
              label="Default TDS Deduct Rate (%)"
              type="number"
              value={statutoryInfo.tdsRate}
              onChange={(e) => setStatutoryInfo({ ...statutoryInfo, tdsRate: Number(e.target.value) })}
            />
            <FormInput
              label="PF Wage Ceiling Limit (₹)"
              type="number"
              value={statutoryInfo.pfCapLimit}
              onChange={(e) => setStatutoryInfo({ ...statutoryInfo, pfCapLimit: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* .NET Web API & Database Config */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Database className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-900 text-sm">.NET Core Web API & SQL Server Integration</h3>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <CheckCircle size={14} /> Ready for Connection
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label=".NET Core Web API Base URL"
              value={apiConfig.apiEndpointUrl}
              onChange={(e) => setApiConfig({ ...apiConfig, apiEndpointUrl: e.target.value })}
            />
            <FormInput
              label="Bearer / API Key Secret"
              type="password"
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
            />
            <FormInput
              label="SQL Server Host"
              value={apiConfig.sqlServerHost}
              onChange={(e) => setApiConfig({ ...apiConfig, sqlServerHost: e.target.value })}
            />
            <FormInput
              label="Target Database Name"
              value={apiConfig.databaseName}
              onChange={(e) => setApiConfig({ ...apiConfig, databaseName: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SubmitButton loading={saving} icon={<Save size={16} />}>
            Save System Configurations
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};
