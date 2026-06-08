import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  Clock,
  CheckCircle,
  Brain,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useHygienistStore } from '../../../store/hygienistStore';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

export function HygienistDashboardPage() {
  const navigate = useNavigate();
  const { patients, recalls, riskProfiles, setActivePatientId } = useHygienistStore();

  // Local state for today's appointment statuses
  const [todaySchedule, setTodaySchedule] = useState([
    { id: 'ap-1', time: '09:00 AM', patientId: 'pat-1', name: 'James Carter', type: 'Adult Prophylaxis', status: 'Completed' },
    { id: 'ap-2', time: '10:30 AM', patientId: 'pat-2', name: 'Mary Watson', type: 'Perio Maintenance & SRP', status: 'Arrived' },
    { id: 'ap-3', time: '01:00 PM', patientId: 'pat-3', name: 'Alex Johnson', type: 'Prophy & Fluoride', status: 'Pending' },
    { id: 'ap-4', time: '02:30 PM', patientId: 'pat-4', name: 'David Miller', type: 'Scaling & Root Planing (SRP)', status: 'Pending' }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setTodaySchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleStartSession = (patientId, tab = 'perio') => {
    setActivePatientId(patientId);
    navigate(`/hygienist/patients/${patientId}?tab=${tab}`);
  };

  // Calculations for KPI Cards
  const seenToday = todaySchedule.filter((s) => s.status === 'Completed').length;
  const highRiskCount = Object.values(riskProfiles).filter((p) => p.classification === 'High').length;
  const recallPending = recalls.filter((r) => r.status === 'Due').length;
  const scheduledCount = recalls.filter((r) => r.status === 'Scheduled').length;

  // Chart Data: simulated clinical workload (patients seen for cleaning vs root planing)
  const monthlyWorkloadData = [
    { month: 'Jan', Prophy: 35, Perio: 12 },
    { month: 'Feb', Prophy: 42, Perio: 15 },
    { month: 'Mar', Prophy: 38, Perio: 18 },
    { month: 'Apr', Prophy: 45, Perio: 22 },
    { month: 'May', Prophy: 52, Perio: 25 },
    { month: 'Jun', Prophy: 48, Perio: 24 }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            Preventive Hygiene Hub
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Monitor perio status, clinical risks, auto-recalls, and clinical hygiene chart updates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/hygienist/patients')}
            className="font-bold text-xs gap-1.5 h-9"
          >
            Patients Registry
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patients Completed</span>
              <h3 className="text-2xl font-black text-foreground mt-1">{seenToday} / {todaySchedule.length}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>Today's active session throughput</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">High Perio Risk</span>
              <h3 className="text-2xl font-black text-foreground mt-1">{highRiskCount}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground font-semibold">
            Active monitoring required for bone health
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Recall Pending</span>
              <h3 className="text-2xl font-black text-foreground mt-1">{recallPending}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
            <span className="text-amber-500 font-bold">Action Needed:</span>
            <span>Send automated recall invitations</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Scheduled Cleanings</span>
              <h3 className="text-2xl font-black text-foreground mt-1">{scheduledCount}</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground font-semibold">
            Booked preventive visits next 30 days
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule (2 columns on lg) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
              Today's Hygiene Worklist
            </h3>
            <Badge variant="secondary" className="font-bold text-[10px] uppercase">
              Therapist: Elena Rostova, RDH
            </Badge>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="hidden md:table w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Patient</th>
                  <th className="py-2.5">Procedure Type</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {todaySchedule.map((appt) => (
                  <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-bold text-primary">{appt.time}</td>
                    <td className="py-3">
                      <div className="font-extrabold text-foreground">{appt.name}</div>
                      <div className="text-[10px] text-muted-foreground">ID: #{appt.patientId}</div>
                    </td>
                    <td className="py-3 text-muted-foreground">{appt.type}</td>
                    <td className="py-3 text-center">
                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full bg-muted border border-border outline-none cursor-pointer ${
                          appt.status === 'Completed'
                            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                            : appt.status === 'Arrived'
                            ? 'text-primary bg-primary/10 border-primary/20'
                            : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Arrived">Arrived</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => handleStartSession(appt.patientId)}
                        className="font-bold gap-1 text-[10px] h-7 cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Perio Chart
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card List View */}
            <div className="flex flex-col gap-3 md:hidden">
              {todaySchedule.map((appt) => (
                <div key={appt.id} className="p-4 border border-border/80 rounded-2xl bg-card text-left space-y-3 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-black text-primary block">{appt.time}</span>
                      <h4 className="font-extrabold text-sm text-foreground">{appt.name}</h4>
                      <span className="text-[10px] text-muted-foreground font-semibold">ID: #{appt.patientId}</span>
                    </div>
                    <div>
                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border outline-none cursor-pointer ${
                          appt.status === 'Completed'
                            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                            : appt.status === 'Arrived'
                            ? 'text-primary bg-primary/10 border-primary/20'
                            : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Arrived">Arrived</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground">
                    <span className="font-semibold text-muted-foreground/75">Procedure:</span> {appt.type}
                  </div>
                  <div className="pt-2 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStartSession(appt.patientId)}
                      className="w-full font-bold text-xs h-10 cursor-pointer flex justify-center items-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Open Perio Chart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Gum Health Insights Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Brain className="h-4.5 w-4.5 text-primary animate-bounce" />
            AI preventive Insights
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {/* Warning 1 */}
            <div className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-xl text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
                Severe Periodontitis Alert
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                <strong>Mary Watson</strong> has 5 active sites with pocket depth &gt; 5mm (max 7mm on #19) and severe bleeding. Recommended: urgent root plane SRP therapy.
              </p>
              <button
                onClick={() => handleStartSession('pat-2', 'perio')}
                className="text-[10px] text-rose-500 hover:underline font-bold"
              >
                Inspect Perio Chart &rarr;
              </button>
            </div>

            {/* Warning 2 */}
            <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 rounded-xl text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                <Clock className="h-3.5 w-3.5" />
                Overdue Recall Trigger
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                <strong>David Miller</strong> is overdue for a cleaning since May 2026. Patient has history of calculus build-up and is a former smoker.
              </p>
              <button
                onClick={() => handleStartSession('pat-4', 'recall')}
                className="text-[10px] text-amber-500 hover:underline font-bold"
              >
                Trigger Recall SMS &rarr;
              </button>
            </div>

            {/* Suggestion 3 */}
            <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Prophy Success
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                <strong>Alex Johnson</strong> has excellent compliance. All pockets &le; 3mm. Schedule standard 6-month prophy recall.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Workload Charts & High-Risk Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart View (2 columns on lg) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-foreground">Therapeutic Workload Trends</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Weekly distribution of routine prophylaxis vs deep periodontal cleanings.</p>
          </div>
          
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyWorkloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProphy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPerio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="Prophy" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorProphy)" name="Prophy Cleaning" />
                <Area type="monotone" dataKey="Perio" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPerio)" name="Perio Treatment" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Patient List */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-foreground">Gum Disease Monitoring</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Color-coded patient list sorted by risk rating.</p>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
            {patients.map((pat) => {
              const risk = riskProfiles[pat.id] || { classification: 'Low' };
              const riskVariant = risk.classification === 'High'
                ? 'destructive'
                : risk.classification === 'Medium'
                ? 'warning'
                : 'success';

              return (
                <div
                  key={pat.id}
                  onClick={() => handleStartSession(pat.id, 'risk')}
                  className="p-3 border border-border/80 rounded-xl flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer text-left"
                >
                  <div>
                    <h4 className="font-extrabold text-xs text-foreground">{pat.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                      {risk.riskFactors?.join(', ') || 'No active risk factors'}
                    </p>
                  </div>
                  <Badge variant={riskVariant} className="font-bold text-[9px] px-2 py-0.5 uppercase">
                    {risk.classification}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HygienistDashboardPage;
