import { useMemo } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  UserCheck,
  BrainCircuit,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useClinicOwnerStore } from '../../../store/clinicOwnerStore';
import { Badge } from '../../../shared/ui/Badge';

export function ClinicOwnerDashboardPage() {
  const { patients, staff, appointments, invoices, clinicalNotes } = useClinicOwnerStore();

  // Scoped KPIs calculation
  const totalPatients = patients.length;
  const activeStaff = staff.filter((s) => s.status === 'Active').length;
  const pendingInvoices = invoices.filter((i) => i.status === 'Unpaid').length;
  const todayDate = '2026-06-08';
  const todayApts = appointments.filter((a) => a.date === todayDate);

  // Financial aggregates
  const totalRevenue = useMemo(() => {
    return invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [invoices]);

  // Chart data
  const revenueChartData = [
    { name: 'Jan', Revenue: 4200 },
    { name: 'Feb', Revenue: 5100 },
    { name: 'Mar', Revenue: 4800 },
    { name: 'Apr', Revenue: 6200 },
    { name: 'May', Revenue: 7500 },
    { name: 'Jun', Revenue: totalRevenue || 5800 }
  ];

  const flowChartData = [
    { name: 'Mon', Patients: 12 },
    { name: 'Tue', Patients: 19 },
    { name: 'Wed', Patients: 15 },
    { name: 'Thu', Patients: 22 },
    { name: 'Fri', Patients: totalPatients + 10 || 18 }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Clinic Administration Hub
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Real-time indicators, staff allocations, and treatment logs for this location.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Total Patients</span>
            <h4 className="text-2xl font-black text-foreground">{totalPatients}</h4>
          </div>
          <div className="bg-indigo-500/10 text-indigo-500 p-3 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Appointments Today</span>
            <h4 className="text-2xl font-black text-foreground">{todayApts.length}</h4>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Pending Invoices</span>
            <h4 className="text-2xl font-black text-destructive">{pendingInvoices}</h4>
          </div>
          <div className="bg-rose-500/10 text-rose-500 p-3 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Active Staff</span>
            <h4 className="text-2xl font-black text-emerald-500">{activeStaff}</h4>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recharts Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue flows */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            Monthly Collections ($)
          </h3>
          <div className="h-64 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient flows */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-indigo-400" />
            Daily Patient Flow (Weekly)
          </h3>
          <div className="h-64 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                <Tooltip />
                <Bar dataKey="Patients" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Timeline and AI Insights Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Timeline list */}
        <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Scheduler Timeline &bull; Today
          </h3>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {todayApts.length > 0 ? (
              todayApts.map((apt) => (
                <div key={apt.id} className="p-3 bg-muted/45 border border-border/60 rounded-xl flex items-center justify-between hover:bg-muted/70 transition-colors">
                  <div className="space-y-0.5 text-xs text-left">
                    <span className="font-bold text-foreground block">{apt.patientName}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold block">{apt.treatment} &bull; Dentist: {apt.dentistName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
                      {apt.time}
                    </span>
                    <Badge variant={apt.status === 'Confirmed' ? 'success' : 'info'}>
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground text-xs font-semibold italic block py-4 text-center">No appointments scheduled for today</span>
            )}
          </div>
        </div>

        {/* AI Scoped Panel */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
              Clinical AI Agent Insights
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-500 uppercase block tracking-wider">Radiograph Diagnostics</span>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  2 diagnostic radiograph files audited today. Detected 1 marginal bone loss discrepancy on tooth #19. Clinical chart updated.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-500 uppercase block tracking-wider">Recall Conversions</span>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  AI SMS agent scheduled 3 recall notifications for overdue hygiene checks. conversion score: +18% increase.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <FileCheck className="h-3.5 w-3.5 text-primary" />
              Active Charts Audited: {clinicalNotes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClinicOwnerDashboardPage;
