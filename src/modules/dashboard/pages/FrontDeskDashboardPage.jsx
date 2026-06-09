import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  ShieldAlert,
  Clock,
  UserPlus,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAppointmentStore } from '../../../store/appointmentStore';
import { useDentistStore } from '../../../store/dentistStore';
import { useFrontDeskStore } from '../../../store/frontDeskStore';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';

export function FrontDeskDashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const { appointments, updateAppointment } = useAppointmentStore();
  const { patients } = useDentistStore();
  const { waitlist, insuranceChecks, walkins, addWalkIn, updateWalkInStatus } = useFrontDeskStore();

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinDoctor, setWalkinDoctor] = useState('Dr. Michael Chen, DDS');

  // Calculations for KPIs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = useMemo(() => {
    return appointments.filter((a) => a.date === todayStr).length;
  }, [appointments, todayStr]);

  const newPatientsCount = patients.length;
  const pendingInsurancesCount = useMemo(() => {
    return insuranceChecks.filter((ins) => ins.status === 'Pending').length;
  }, [insuranceChecks]);

  const waitlistCount = waitlist.length;

  // Filter today's appointments for the live queue
  const todayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === todayStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, todayStr]);

  const handleAddWalkIn = (e) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) {
      toast.error('Please enter patient name and contact phone!');
      return;
    }
    addWalkIn({
      patientName: walkinName,
      phone: walkinPhone,
      doctor: walkinDoctor
    });
    toast.success(`Walk-in checked in successfully for ${walkinName}!`, 'Added to Queue');
    setWalkinName('');
    setWalkinPhone('');
  };

  const handleUpdateAptStatus = (aptId, status) => {
    updateAppointment(aptId, { status });
    toast.success(`Appointment status updated to ${status}!`);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-12">
      {/* Header Title */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            Front Desk Hub
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Manage daily check-ins, register new patients, verify eligibility, and update clinic calendar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/frontdesk/registration', { state: { openForm: true } })}
            className="font-bold text-xs gap-1.5 h-9"
          >
            <UserPlus className="h-4 w-4" />
            Register New Patient
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-card border border-border/80 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Today's Bookings</span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">{todayBookingsCount}</h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[9px] sm:text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>Active schedule check-ins</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-card border border-border/80 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Registered Patients</span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">{newPatientsCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[9px] sm:text-[10px] text-muted-foreground font-semibold">
            Onboarded clinic EHR files
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-card border border-border/80 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Insurance Pending</span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">{pendingInsurancesCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[9px] sm:text-[10px] text-muted-foreground font-semibold">
            Awaiting verification checks
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-card border border-border/80 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Waitlisted Patients</span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">{waitlistCount}</h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[9px] sm:text-[10px] text-muted-foreground font-semibold">
            Awaiting slot cancellations
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Walk-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Live Queue */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
              Live Appointment Intake Queue
            </h3>
            <Badge variant="secondary" className="font-bold text-[9px] uppercase">
              Intake Desk
            </Badge>
          </div>

          <div className="overflow-x-auto min-h-[220px]">
            {todayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-xs text-muted-foreground">
                <Calendar className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <span>No appointments booked for today.</span>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <table className="hidden md:table w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      <th className="py-2.5">Time</th>
                      <th className="py-2.5">Patient</th>
                      <th className="py-2.5">Provider</th>
                      <th className="py-2.5 text-center">Intake Status</th>
                      <th className="py-2.5 text-right">Check-In Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium text-foreground">
                    {todayAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-bold text-primary">{appt.time}</td>
                        <td className="py-3">
                          <div className="font-extrabold text-foreground">{appt.patientName}</div>
                          <div className="text-[10px] text-muted-foreground">{appt.type}</div>
                        </td>
                        <td className="py-3 text-muted-foreground truncate max-w-[120px]">{appt.dentistName}</td>
                        <td className="py-3 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            appt.status === 'Checked-In'
                              ? 'text-primary bg-primary/10 border border-primary/20'
                              : appt.status === 'Completed'
                              ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="xs"
                              variant="primary"
                              disabled={appt.status === 'Checked-In'}
                              onClick={() => handleUpdateAptStatus(appt.id, 'Checked-In')}
                              className="font-bold text-[9px] h-7 cursor-pointer"
                            >
                              Arrived
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={appt.status === 'Completed'}
                              onClick={() => handleUpdateAptStatus(appt.id, 'Completed')}
                              className="font-bold text-[9px] h-7 cursor-pointer"
                            >
                              Done
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card List View */}
                <div className="flex flex-col gap-3 md:hidden">
                  {todayAppointments.map((appt) => (
                    <div key={appt.id} className="p-4 border border-border/80 rounded-2xl bg-card text-left space-y-3 shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-black text-primary block">{appt.time}</span>
                          <h4 className="font-extrabold text-sm text-foreground">{appt.patientName}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold">{appt.type}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          appt.status === 'Checked-In'
                            ? 'text-primary bg-primary/10 border border-primary/20'
                            : appt.status === 'Completed'
                            ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-muted-foreground">
                        <span className="font-semibold text-muted-foreground/75">Provider:</span> {appt.dentistName}
                      </div>
                      <div className="flex gap-2.5 pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={appt.status === 'Checked-In'}
                          onClick={() => handleUpdateAptStatus(appt.id, 'Checked-In')}
                          className="flex-1 font-bold text-xs h-10 cursor-pointer"
                        >
                          Arrived
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={appt.status === 'Completed'}
                          onClick={() => handleUpdateAptStatus(appt.id, 'Completed')}
                          className="flex-1 font-bold text-xs h-10 cursor-pointer"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Walk-in Intake Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-primary" />
            Walk-In Patient Intake
          </h3>

          <form onSubmit={handleAddWalkIn} className="space-y-3 text-left">
            <Input
              label="Patient Full Name"
              value={walkinName}
              onChange={(e) => setWalkinName(e.target.value)}
              placeholder="e.g. Arthur Dent"
              className="h-9 font-medium text-xs text-foreground"
            />
            <Input
              label="Contact Phone"
              value={walkinPhone}
              onChange={(e) => setWalkinPhone(e.target.value)}
              placeholder="e.g. (206) 555-4242"
              className="h-9 font-medium text-xs text-foreground"
            />
            
            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Assign Dentist</label>
              <select
                value={walkinDoctor}
                onChange={(e) => setWalkinDoctor(e.target.value)}
                className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2 focus:outline-none cursor-pointer text-foreground"
              >
                <option value="Dr. Michael Chen, DDS">Dr. Michael Chen, DDS</option>
                <option value="Dr. Arthur Vance, DDS">Dr. Arthur Vance, DDS</option>
              </select>
            </div>

            <Button type="submit" size="sm" className="w-full h-9 font-bold text-xs mt-3">
              Add Walk-In to Queue
            </Button>
          </form>
        </div>
      </div>

      {/* Walk-in Queue Board & Clinic Status Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Walk-In Patients Table (2 columns on lg) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-foreground">Walk-In Patient Tracker</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Live status board for non-scheduled arrivals awaiting consultation.</p>
          </div>

          <div className="overflow-x-auto">
            {walkins.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No active walk-ins logged in the system.
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      <th className="py-2">Arrived</th>
                      <th className="py-2">Patient Name</th>
                      <th className="py-2">Assigned Doctor</th>
                      <th className="py-2 text-center">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium text-foreground">
                    {walkins.map((wi) => (
                      <tr key={wi.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-bold text-primary">{wi.arrivedTime}</td>
                        <td className="py-2.5">
                          <div className="font-extrabold text-foreground">{wi.patientName}</div>
                          <div className="text-[9px] text-muted-foreground">{wi.phone}</div>
                        </td>
                        <td className="py-2.5 text-muted-foreground">{wi.doctor}</td>
                        <td className="py-2.5 text-center">
                          <select
                            value={wi.status}
                            onChange={(e) => updateWalkInStatus(wi.id, e.target.value)}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border outline-none cursor-pointer ${
                              wi.status === 'Checked-In'
                                ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                            }`}
                          >
                            <option value="Waiting">Waiting</option>
                            <option value="Checked-In">Checked-In</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-2.5 text-right">
                          <Button
                            size="xs"
                            variant="ghost"
                            disabled={wi.status === 'Completed'}
                            onClick={() => {
                              updateWalkInStatus(wi.id, 'Completed');
                              toast.success(`${wi.patientName} checked-in successfully!`);
                            }}
                            className="font-bold text-[9px] h-7 text-primary hover:text-primary-foreground hover:bg-primary"
                          >
                            Check In
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card List View */}
                <div className="flex flex-col gap-3 md:hidden">
                  {walkins.map((wi) => (
                    <div key={wi.id} className="p-4 border border-border/80 rounded-2xl bg-card text-left space-y-3 shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-black text-primary block">{wi.arrivedTime}</span>
                          <h4 className="font-extrabold text-sm text-foreground">{wi.patientName}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold">{wi.phone}</span>
                        </div>
                        <div>
                          <select
                            value={wi.status}
                            onChange={(e) => updateWalkInStatus(wi.id, e.target.value)}
                            className={`text-[9px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border outline-none cursor-pointer ${
                              wi.status === 'Checked-In'
                                ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                            }`}
                          >
                            <option value="Waiting">Waiting</option>
                            <option value="Checked-In">Checked-In</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="text-[11px] font-medium text-muted-foreground">
                        <span className="font-semibold text-muted-foreground/75">Assigned Doctor:</span> {wi.doctor}
                      </div>
                      <div className="pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={wi.status === 'Completed'}
                          onClick={() => {
                            updateWalkInStatus(wi.id, 'Completed');
                            toast.success(`${wi.patientName} checked-in successfully!`);
                          }}
                          className="w-full font-bold text-xs h-10 text-primary hover:text-primary-foreground hover:bg-primary cursor-pointer"
                        >
                          Check In
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real-time Registration Activity Log */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-foreground">Front Desk Log</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Activity trail recorded by clinic intakes.</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar text-xs">
            <div className="p-3 bg-muted/40 border border-border/60 rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Patient Registered</span>
                <span className="text-[9px] text-muted-foreground">10 mins ago</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                Registered <strong>Samantha Collins</strong>. EHR dental profile generated.
              </p>
            </div>

            <div className="p-3 bg-muted/40 border border-border/60 rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Eligibility Check Dispatch</span>
                <span className="text-[9px] text-muted-foreground">25 mins ago</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                Submitted <strong>Robert Vance</strong>'s Aetna insurance policy eligibility verification request. Status: Approved.
              </p>
            </div>

            <div className="p-3 bg-muted/40 border border-border/60 rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Waitlist Prioritization</span>
                <span className="text-[9px] text-muted-foreground">45 mins ago</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
                Added <strong>Arthur Dent</strong> to waitlist for general dental hygiene. Priority flagged: High.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FrontDeskDashboardPage;
