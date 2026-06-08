import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Cpu, MessageSquare, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { useSuperAdminStore } from '../../store/superAdminStore';
import { Button } from '../../shared/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();
  const plans = useSuperAdminStore((state) => state.plans);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2 select-none">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-md">
            <Activity className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            HMS CoreSaaS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing Config</a>
          <a href="#about" className="hover:text-foreground transition-colors">Platform</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')} className="font-bold text-xs">
            Sign In
          </Button>
          <Button onClick={() => navigate('/register')} className="font-bold text-xs gap-1">
            Register Clinic
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
          <ShieldCheck className="h-4 w-4" />
          Global Multi-Clinic Control Console
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
          Next-Generation SaaS for <br />
          <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Multi-Clinic Healthcare Networks
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Unify patient databases, streamline licensing plans, automate recall SMS, and run automated radiography diagnostics across all locations from a single dashboard.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Button onClick={() => navigate('/login')} size="lg" className="w-full sm:w-auto font-extrabold gap-2 text-sm px-6 h-12">
            Access System Sandbox
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/register')} size="lg" variant="outline" className="w-full sm:w-auto font-extrabold text-sm px-6 h-12">
            Register a Clinic Location
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Standard Enterprise Capabilities</h2>
          <p className="text-sm text-muted-foreground font-semibold">Our core application features configured dynamically for each subscriber office.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-200">
            <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Centralized Hub</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Filter revenues, schedule metrics, and clinician workflows across 100+ branches instantly.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-200">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base mb-2">AI Diagnostics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Automatic radiograph bone-loss checks and diagnostic reporting powered by deep learning DICOM scanning.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-200">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Recall Automation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Automated generative text templates to recall overdue patient lists, boosting checkup bookings.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-200">
            <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base mb-2">SaaS Billing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Automated recurring Stripe invoices and licensing controls tailored for global medical chains.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Dynamically Loaded from Store!) */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">SaaS Subscription Licensing</h2>
          <p className="text-sm text-muted-foreground font-semibold">Pricing plans configured live by the global network administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-card border p-8 rounded-3xl shadow-md relative flex flex-col justify-between ${
                plan.name === 'Premium' ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border'
              }`}
            >
              {plan.name === 'Premium' && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">{plan.name}</h3>
                  <span className={`text-[10px] inline-block px-2 py-0.5 rounded-full mt-1 font-bold ${
                    plan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {plan.status} Configuration
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">${plan.fee}</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ {plan.billingPeriod.toLowerCase()}</span>
                </div>

                <div className="h-px bg-border my-2" />

                <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
                  {plan.features.split(',').map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span>{feat.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => navigate('/register')}
                  variant={plan.name === 'Premium' ? 'default' : 'outline'}
                  className="w-full font-bold text-xs py-5"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center bg-card border border-border rounded-3xl shadow-sm mb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-6 max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Modernize Your Clinic Network?</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            Join hundreds of medical dental teams running on our sandboxed core SaaS platform. Register a demo clinic location in seconds.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/register')} size="lg" className="font-extrabold text-xs h-11 px-6">
              Create Clinic Profile
            </Button>
            <Button onClick={() => navigate('/login')} size="lg" variant="ghost" className="font-extrabold text-xs h-11 px-6">
              Launch Workspace
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-border/40 text-center text-[10px] text-muted-foreground font-semibold">
        &copy; {new Date().getFullYear()} HMS CoreSaaS Platform. All rights reserved. Sandboxed development build.
      </footer>
    </div>
  );
}
export default LandingPage;
