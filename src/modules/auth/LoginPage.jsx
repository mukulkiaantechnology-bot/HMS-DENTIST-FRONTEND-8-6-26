import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { useToast } from '../../shared/hooks/useToast';

export function LoginPage() {
  const navigate = useNavigate();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);
  const toast = useToast();

  const [email, setEmail] = useState('s.jenkins@hms-saas.com');
  const [password, setPassword] = useState('admin123');
  const [demoProfile, setDemoProfile] = useState('super_admin');

  const demoProfiles = [
    { key: 'super_admin', label: 'Super Admin', email: 's.jenkins@hms-saas.com', password: 'admin123', icon: 'Shield', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { key: 'clinic_owner_approved', label: 'Clinic Owner', email: 'owner@vancedental.com', password: 'password123', icon: 'Building2', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { key: 'dentist', label: 'Dentist', email: 'dr.chen@vancedental.com', password: 'password123', icon: 'UserCheck', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { key: 'hygienist', label: 'Hygienist', email: 'elena.r@vancedental.com', password: 'password123', icon: 'Sparkles', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { key: 'front_desk', label: 'Front Desk', email: 'amara.reception@vancedental.com', password: 'password123', icon: 'PhoneCall', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { key: 'billing_staff', label: 'Billing Staff', email: 'billing@vancedental.com', password: 'password123', icon: 'CreditCard', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { key: 'dental_assistant', label: 'Assistant', email: 'assistant@vancedental.com', password: 'password123', icon: 'HeartPulse', color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    { key: 'lab_coordinator', label: 'Lab Coord.', email: 'lab@vancedental.com', password: 'password123', icon: 'FlaskConical', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { key: 'patient', label: 'Patient', email: 'james@gmail.com', password: 'password123', icon: 'User', color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' }
  ];

  const handleProfileSelect = (prof) => {
    setDemoProfile(prof.key);
    setEmail(prof.email);
    setPassword(prof.password);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 transition-colors duration-300 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-25">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-xl z-10 animate-fade-in text-center">
        {/* Back Arrow */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
          Home
        </button>

        {/* Brand */}
        <div className="flex justify-center mb-6 mt-8 sm:mt-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-md">
            <Icons.Activity className="h-7 w-7" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">HMS CoreSaaS</h1>
        <p className="text-xs text-muted-foreground mt-2 font-semibold">
          Multi-Clinic Hospital Management Platform
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5 text-left">
          {/* Grid Selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase text-muted-foreground font-black tracking-wider block">
              Sandbox Quick-Select Profiles
            </label>
            <div className="grid grid-cols-3 gap-2">
              {demoProfiles.map((prof) => {
                const Icon = Icons[prof.icon] || Icons.Shield;
                const isSelected = demoProfile === prof.key;
                return (
                  <button
                    key={prof.key}
                    type="button"
                    onClick={() => handleProfileSelect(prof)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer text-center relative ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/25 bg-primary/5 scale-102 shadow-xs'
                        : 'border-border bg-card hover:bg-muted/50 hover:border-border/80'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mb-1.5 ${prof.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-black text-foreground uppercase tracking-wide truncate max-w-full">
                      {prof.label}
                    </span>
                    <span className="text-[7px] text-muted-foreground truncate max-w-full font-bold block mt-0.5">
                      {prof.email.split('@')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
            <Icons.Key className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Super Admin logs in with `admin123`. Registered clinic owner accounts require Super Admin approval prior to authentication.
            </div>
          </div>

          <Button type="submit" className="w-full h-11 gap-2 font-bold select-none cursor-pointer mt-4">
            Access System Sandbox
            <Icons.ArrowRight className="h-4 w-4" />
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
