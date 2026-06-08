import { useMemo } from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useClinicStore } from '../../../store/clinicStore';
import { usePatientStore } from '../../../store/patientStore';
import { useAppointmentStore } from '../../../store/appointmentStore';
import { useBillingStore } from '../../../store/billingStore';
import { Badge } from '../../../shared/ui/Badge';

// Mock trends for charts
const REVENUE_DATA = [
  { month: 'Jan', Metropolitan: 24000, Apex: 18000, Northside: 15000 },
  { month: 'Feb', Metropolitan: 28000, Apex: 21000, Northside: 17000 },
  { month: 'Mar', Metropolitan: 32000, Apex: 22000, Northside: 19000 },
  { month: 'Apr', Metropolitan: 30000, Apex: 25000, Northside: 22000 },
  { month: 'May', Metropolitan: 35000, Apex: 29000, Northside: 24000 },
  { month: 'Jun', Metropolitan: 42000, Apex: 34000, Northside: 28000 }
];

const INTAKE_DATA = [
  { month: 'Jan', Count: 45 },
  { month: 'Feb', Count: 52 },
  { month: 'Mar', Count: 68 },
  { month: 'Apr', Count: 59 },
  { month: 'May', Count: 82 },
  { month: 'Jun', Count: 95 }
];

export function DashboardPage() {
  const selectedClinicId = useClinicStore((state) => state.selectedClinicId);
  const clinics = useClinicStore((state) => state.clinics);
  const patients = usePatientStore((state) => state.patients);
  const appointments = useAppointmentStore((state) => state.appointments);
  const invoices = useBillingStore((state) => state.invoices);

  // Filter and compute statistics
  const stats = useMemo(() => {
    const isGlobal = selectedClinicId === 'all';
    
    // Filter patients
    const filteredPatients = isGlobal
      ? patients
      : patients.filter((p) => p.clinicId === selectedClinicId);
    
    // Filter appointments
    const filteredAppts = isGlobal
      ? appointments
      : appointments.filter((a) => a.clinicId === selectedClinicId);
    
    // Filter invoices
    const filteredInvoices = isGlobal
      ? invoices
      : invoices.filter((i) => i.clinicId === selectedClinicId);

    // Calculations
    const totalPatients = filteredPatients.length;
    const appointmentsToday = filteredAppts.filter(
      (a) => a.date === new Date().toISOString().split('T')[0]
    ).length;
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingCases = filteredAppts.filter((a) => a.status === 'Checked-In').length;

    return {
      totalPatients,
      appointmentsToday,
      totalRevenue,
      pendingCases,
      rawInvoices: filteredInvoices,
      rawAppointments: filteredAppts
    };
  }, [selectedClinicId, patients, appointments, invoices]);

  // Map clinic ID to name
  const clinicMap = useMemo(() => {
    return clinics.reduce((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {});
  }, [clinics]);

  // Aggregate Chart Data based on current selection
  const chartData = useMemo(() => {
    return REVENUE_DATA.map((row) => {
      if (selectedClinicId === 'all') {
        return {
          month: row.month,
          Revenue: row.Metropolitan + row.Apex + row.Northside
        };
      } else if (selectedClinicId === 'clinic-1') {
        return { month: row.month, Revenue: row.Metropolitan };
      } else if (selectedClinicId === 'clinic-2') {
        return { month: row.month, Revenue: row.Apex };
      } else {
        return { month: row.month, Revenue: row.Northside };
      }
    });
  }, [selectedClinicId]);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground font-semibold mt-1">
          {selectedClinicId === 'all'
            ? 'Viewing consolidated data from all clinic networks.'
            : `Operating context: ${clinicMap[selectedClinicId] || 'Selected Clinic'}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Patients</span>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalPatients}</h3>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-lg dark:bg-primary/20">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Appointments Today */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scheduled Today</span>
            <h3 className="text-2xl font-bold text-foreground">{stats.appointmentsToday}</h3>
          </div>
          <div className="bg-success/10 text-success p-3 rounded-lg dark:bg-success/20">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Net Billings</span>
            <h3 className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-info/10 text-info p-3 rounded-lg dark:bg-info/20">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        {/* Active Treatments */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Patient Inflow</span>
            <h3 className="text-2xl font-bold text-foreground">{stats.pendingCases}</h3>
          </div>
          <div className="bg-warning/10 text-warning p-3 rounded-lg dark:bg-warning/20">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">Revenue Stream Analysis</h4>
            </div>
            <Badge variant="success" className="gap-1 font-semibold">
              +12.4% MoM <ArrowUpRight className="h-3 w-3" />
            </Badge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Registrations Chart */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="border-b border-border pb-3">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Patient Registration Flow</h4>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INTAKE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="Count" fill="var(--color-info)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clinic Activity Logs & Clinic switcher overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments list */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Today's Appointment Log</h4>
          <div className="space-y-3">
            {stats.rawAppointments.slice(0, 3).map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs dark:bg-primary/20">
                    {appt.patientName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">{appt.patientName}</h5>
                    <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" /> {appt.time} ({appt.duration}m) • {appt.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {clinicMap[appt.clinicId]?.split(' ')[0]}
                  </span>
                  <Badge
                    variant={
                      appt.status === 'Completed'
                        ? 'success'
                        : appt.status === 'Checked-In'
                        ? 'info'
                        : appt.status === 'Cancelled'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="text-[10px] py-0.5 px-2 font-semibold"
                  >
                    {appt.status}
                  </Badge>
                </div>
              </div>
            ))}
            {stats.rawAppointments.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground font-medium">
                No appointments scheduled for the selected clinic.
              </div>
            )}
          </div>
        </div>

        {/* Global Clinic Overview (Available to all, detailed stats) */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Practice Locations</h4>
          <div className="space-y-3">
            {clinics.map((clinic) => {
              const patientCount = patients.filter((p) => p.clinicId === clinic.id).length;
              return (
                <div key={clinic.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/10 transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-foreground">{clinic.name}</h5>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{clinic.location}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1 items-end">
                    <Badge variant={clinic.status === 'active' ? 'success' : 'secondary'} className="text-[9px] font-bold py-0">
                      {clinic.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      {patientCount} registered patients
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
