import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/forms/FormInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { ToastMessage } from '../../components/common/ToastNotification';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, addToast }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@enterprise.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({ email, password, rememberMe });
      addToast({ type: 'success', message: `Welcome back, ${res.user.name}!` });
      onLoginSuccess(res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please check your email and password.');
      addToast({ type: 'error', message: 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card-container">
        {/* Header */}
        <div className="login-brand">
          <div className="login-logo">
            <DollarSign size={26} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="login-title">Payroll System</h1>
            <p className="login-subtitle">Enterprise Human Resource & Compensation Portal</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Account Authentication</h2>
            <p>Enter your corporate credentials to access payroll console</p>
          </div>

          {error && <div className="login-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <FormInput
              label="Work Email Address"
              type="email"
              placeholder="name@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail size={16} />}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock size={16} />}
            />

            <div className="login-options-row">
              <label className="login-remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo Notice: Default credentials pre-filled.'); }} className="login-forgot-link">
                Forgot password?
              </a>
            </div>

            <SubmitButton
              loading={loading}
              loadingText="Authenticating..."
              icon={<ArrowRight size={16} />}
              className="w-full mt-2"
            >
              Sign In to Dashboard
            </SubmitButton>
          </form>

          <div className="login-demo-notice">
            <Shield size={16} className="text-indigo-600 shrink-0" />
            <p>
              Demo Credentials: <strong>admin@enterprise.com</strong> (Password: <strong>admin123</strong>)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
