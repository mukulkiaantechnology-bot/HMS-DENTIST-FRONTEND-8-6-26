import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ArrowLeft, Key } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { useToast } from '../../shared/hooks/useToast';

export function LoginPage() {
  const navigate = useNavigate();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);
  const toast = useToast();

  const [email, setEmail] = useState('s.jenkins@hms-saas.com');
  const [password, setPassword] = useState('admin123');
  const [demoProfile, setDemoProfile] = useState('super_admin');

  const handleDemoSelect = (e) => {
    const val = e.target.value;
    setDemoProfile(val);
    if (val === 'super_admin') {
      setEmail('s.jenkins@hms-saas.com');
      setPassword('admin123');
    } else if (val === 'clinic_owner_approved') {
      setEmail('owner@vancedental.com');
      setPassword('password123');
    } else if (val === 'dentist') {
      setEmail('dr.chen@vancedental.com');
      setPassword('password123');
    } else if (val === 'hygienist') {
      setEmail('elena.r@vancedental.com');
      setPassword('password123');
    } else if (val === 'front_desk') {
      setEmail('amara.reception@vancedental.com');
      setPassword('password123');
    } else if (val === 'billing_staff') {
      setEmail('billing@vancedental.com');
      setPassword('password123');
    } else if (val === 'dental_assistant') {
      setEmail('assistant@vancedental.com');
      setPassword('password123');
    } else if (val === 'lab_coordinator') {
      setEmail('lab@vancedental.com');
      setPassword('password123');
    } else if (val === 'patient') {
      setEmail('james@gmail.com');
      setPassword('password123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    const result = loginWithCredentials(email, password);
    if (result.success) {
      if (result.role === 'super_admin') {
        toast.success('Successfully signed in as Global Super Admin', 'HQ Console Enabled');
        navigate('/super-admin/dashboard');
      } else if (result.role === 'clinic_owner') {
        toast.success('Successfully signed in as Clinic Owner', 'Clinic Workspace Enabled');
        navigate('/clinic/dashboard');
      } else if (result.role === 'dentist') {
        toast.success('Successfully signed in as Dentist', 'Clinical Workspace Enabled');
        navigate('/dentist/patients');
      } else if (result.role === 'hygienist') {
        toast.success('Successfully signed in as Hygienist', 'Preventive Workspace Enabled');
        navigate('/hygienist/dashboard');
      } else if (result.role === 'front_desk' || result.role === 'frontdesk') {
        toast.success('Successfully signed in as Front Desk Receptionist', 'Reception Workspace Enabled');
        navigate('/frontdesk/dashboard');
      } else if (result.role === 'billing_staff') {
        toast.success('Successfully signed in as Billing Staff Coordinator', 'Billing Workspace Enabled');
        navigate('/billing');
      } else if (result.role === 'dental_assistant' || result.role === 'assistant') {
        toast.success('Successfully signed in as Dental Assistant', 'Assistant Workspace Enabled');
        navigate('/assistant/patients');
      } else if (result.role === 'lab_coordinator') {
        toast.success('Successfully signed in as Lab Coordinator', 'Lab Workspace Enabled');
        navigate('/lab/cases');
      } else if (result.role === 'patient') {
        toast.success('Successfully signed in to Patient Portal', 'Patient Dashboard Enabled');
        navigate('/patient/dashboard');
      } else {
        toast.warning(`Role "${result.role}" is currently running in simulated environment.`);
      }
    } else {
      toast.error(result.error || 'Authentication Failed');
    }
  };

  const demoOptions = [
    { value: 'super_admin', label: 'Global Super Admin (s.jenkins@hms-saas.com)' },
    { value: 'clinic_owner_approved', label: 'Clinic Owner - Approved (owner@vancedental.com)' },

    { value: 'dentist', label: 'Dentist - Dr. Michael Chen (dr.chen@vancedental.com)' },
    { value: 'hygienist', label: 'Hygienist - Elena Rostova, RDH (elena.r@vancedental.com)' },
    { value: 'front_desk', label: 'Front Desk - Amara Lopez (amara.reception@vancedental.com)' },
    { value: 'billing_staff', label: 'Billing Staff - Samantha Billing (billing@vancedental.com)' },
    { value: 'dental_assistant', label: 'Dental Assistant - David Miller (assistant@vancedental.com)' },
    { value: 'lab_coordinator', label: 'Lab Coordinator - Marcus Vance (lab@vancedental.com)' },
    { value: 'patient', label: 'Patient - James Carter (james@gmail.com)' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-25">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl z-10 animate-fade-in text-center">
        {/* Back Arrow */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        {/* Brand */}
        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-md">
            <Activity className="h-7 w-7" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">HMS CoreSaaS</h1>
        <p className="text-sm text-muted-foreground mt-2 font-semibold">
          Multi-Clinic Hospital Management Platform
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5 text-left">
          {/* Quick Sandbox Profiles Selector */}
          <Select
            label="Sandbox Quick-Select Profiles"
            value={demoProfile}
            onChange={handleDemoSelect}
            options={demoOptions}
          />

          <div className="h-px bg-border my-2" />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="enter account email"
          />

          <Input
            label="Account Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="enter account password"
          />

          <div className="p-3 bg-muted border border-border rounded-lg text-left flex items-start gap-2.5">
            <Key className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Super Admin logs in with `admin123`. Registered clinic owner accounts require Super Admin approval prior to authentication.
            </div>
          </div>

          <Button type="submit" className="w-full h-11 gap-2 font-bold select-none cursor-pointer mt-4">
            Access System Sandbox
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-xs border-t border-border pt-4">
          <span className="text-muted-foreground font-semibold">Need to register a clinic location?</span>
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Register New Clinic or Patient &rarr;
          </button>
        </div>

        <div className="mt-6 text-[10px] text-muted-foreground font-semibold">
          Demo Sandboxed Session. Credentials pre-filled for easy testing.
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
