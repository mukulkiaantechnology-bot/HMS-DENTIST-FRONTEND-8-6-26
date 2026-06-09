import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  UserCheck,
  Brain,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert
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
import { useDentistStore } from '../../../store/dentistStore';
import { useClinicOwnerStore } from '../../../store/clinicOwnerStore';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { AIInsightsPanel } from '../../../shared/ui/AIInsightsPanel';

export function DentistDashboardPage() {
  const navigate = useNavigate();
  const { patients, activePatientId, setActivePatientId, xrays, notes } = useDentistStore();
  const { appointments } = useClinicOwnerStore();
  
  const activePatient = patients.find((p) => p.id === activePatientId);
  
  const handleStartTreatment = (patientName) => {
    const pat = patients.find((p) => p.name.toLowerCase() === patientName.toLowerCase());
    if (pat) {
      setActivePatientId(pat.id);
      navigate(`/dentist/patients/${pat.id}?tab=chart`);
    } else {
      navigate('/dentist/patients');
    }
  };
  
  // Scoped Dentist KPIs (Tailored specifically for Dr. Michael Chen)
  const dentistNameFilter = 'Dr. Michael Chen';
  
  // 1. Doctor's appointments
  const doctorApts = useMemo(() => {
    return appointments.filter((a) => a.dentistName.includes(dentistNameFilter));
  }, [appointments]);
  
  const todayDate = '2026-06-08';
  const todayApts = useMemo(() => {
    return doctorApts.filter((a) => a.date === todayDate);
  }, [doctorApts]);
  
  // 2. Patient totals under care
  const patientsCount = patients.length;
  
  // 3. Completed clinical chart notes
  const notesCount = Object.keys(notes).length;
  
  // 4. Scanned radiographs total count
  const xraysCount = useMemo(() => {
    return Object.values(xrays).reduce((sum, list) => sum + list.length, 0);
  }, [xrays]);
  
  // Mock Workload trends
  const workloadData = [
    { name: 'Mon', Patients: 5 },
    { name: 'Tue', Patients: 8 },
    { name: 'Wed', Patients: 6 },
    { name: 'Thu', Patients: 9 },
    { name: 'Fri', Patients: todayApts.length + 4 || 6 }
  ];
  
  // Procedure categories split
  const proceduresData = [
    { name: 'Cleanings', Count: 14 },
    { name: 'Fillings', Count: 22 },
    { name: 'Root Canals', Count: 8 },
    { name: 'Crowns', Count: 11 }
  ];
  
  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Clinical Practitioner Hub
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Review daily schedules, clinical workloads, and active EHR patient charts.
        </p>
      </div>
  
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Patients Scoped</span>
            <h4 className="text-2xl font-black text-foreground">{patientsCount}</h4>
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
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Clinical EHR Notes</span>
            <h4 className="text-2xl font-black text-emerald-500">{notesCount}</h4>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>
  
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Radiographs Scanned</span>
            <h4 className="text-2xl font-black text-indigo-400">{xraysCount}</h4>
          </div>
          <div className="bg-violet-500/10 text-violet-400 p-3 rounded-xl">
            <Brain className="h-6 w-6" />
          </div>
        </div>
      </div>
  
      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Workload and Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recharts Workload Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Weekly Consult Workload
              </h3>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Patients" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
  
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-indigo-400" />
                Treatments Categories Share
              </h3>
              <div className="h-64 lg:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={proceduresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 500 }} />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                    <Tooltip />
                    <Bar dataKey="Count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
  
          {/* Today's schedule filtered list */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              Doctor Schedule &bull; Today ({todayDate})
            </h3>
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {todayApts.length > 0 ? (
                todayApts.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => handleStartTreatment(apt.patientName)}
                    className="p-3.5 bg-muted/45 border border-border/60 rounded-xl flex items-center justify-between hover:bg-muted/70 hover:border-primary/40 cursor-pointer transition-all duration-200 group"
                    title="Click to Start Clinical Treatment"
                  >
                    <div className="space-y-0.5 text-xs text-left">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors block">{apt.patientName}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        Procedure: {apt.treatment} &bull; Clinician: {apt.dentistName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
                        {apt.time}
                      </span>
                      <Badge variant={
                        apt.status.toLowerCase() === 'confirmed' || apt.status.toLowerCase() === 'arrived'
                          ? 'success'
                          : apt.status.toLowerCase() === 'done'
                          ? 'secondary'
                          : 'info'
                      }>
                        {apt.status.toLowerCase() === 'confirmed' ? 'Arrived' : apt.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-xs font-semibold italic block py-4 text-center">
                  No appointments scheduled for today
                </span>
              )}
            </div>
          </div>
        </div>
  
        {/* Right Scoped Context Sidebar */}
        <div className="space-y-6">
          <AIInsightsPanel />
          {/* Active Patient Detail overview context switcher card */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between h-full space-y-4">
            <div className="space-y-4 flex-1">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase text-primary tracking-wider">
                  Active Clinical Chart Session
                </h3>
                <Badge variant="secondary">Active</Badge>
              </div>

              {activePatient ? (
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {activePatient.name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground">{activePatient.name}</h4>
                      <span className="text-[10px] text-muted-foreground">ID: #{activePatient.id} &bull; Age: {activePatient.age}</span>
                    </div>
                  </div>

                  {activePatient.allergies !== 'None' && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div className="text-[10px] font-semibold leading-relaxed">
                        Warning: Penicillin/Latex allergies flagged. Cross-reference pharmacy writeups.
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 p-3 bg-muted/60 border border-border rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vitals:</span>
                      <span className="text-foreground font-bold">{activePatient.vitals.split(',')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pulse:</span>
                      <span className="text-foreground font-bold">{activePatient.vitals.split(',')[2] || '72 bpm'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground italic font-semibold">
                  No patient currently selected. Pick one from the Patients Registry to view active charting details.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              {activePatient ? (
                <Button
                  onClick={() => navigate(`/dentist/patients/${activePatient.id}?tab=chart`)}
                  className="w-full font-bold text-xs h-10 gap-1.5 cursor-pointer"
                >
                  Resume Active Charting
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dentist/patients')}
                  className="w-full font-bold text-xs h-10 gap-1.5 cursor-pointer"
                >
                  Open Patients Registry
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DentistDashboardPage;
