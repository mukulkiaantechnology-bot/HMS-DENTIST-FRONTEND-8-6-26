import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Play,
  Clock
} from 'lucide-react';
import { useDentistStore } from '../../../store/dentistStore';
import { useClinicOwnerStore } from '../../../store/clinicOwnerStore';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { DataTable } from '../../../shared/ui/DataTable';

export function DentistAppointmentsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const { patients, setActivePatientId } = useDentistStore();
  const { appointments, updateAppointment } = useClinicOwnerStore();

  const dentistNameFilter = 'Dr. Michael Chen';
  const todayDate = '2026-06-08';

  // Filter appointments specifically for Dr. Michael Chen
  const doctorApts = useMemo(() => {
    return appointments.filter((a) => a.dentistName.includes(dentistNameFilter));
  }, [appointments]);

  // Separate today's schedule vs upcoming schedule
  const todayApts = useMemo(() => {
    return doctorApts.filter((a) => a.date === todayDate);
  }, [doctorApts, todayDate]);

  const upcomingApts = useMemo(() => {
    return doctorApts.filter((a) => a.date !== todayDate);
  }, [doctorApts, todayDate]);

  const handleStartTreatment = (patientName) => {
    const pat = patients.find((p) => p.name.toLowerCase() === patientName.toLowerCase());
    if (pat) {
      setActivePatientId(pat.id);
      toast.success(`Active patient context set to ${pat.name}`, 'Clinical Chart Activated');
      navigate(`/dentist/patients/${pat.id}?tab=chart`);
    } else {
      toast.warning(`No registered patient profile matches "${patientName}". Redirecting to Patient registry.`);
      navigate('/dentist/patients');
    }
  };

  const handleStatusChange = (aptId, newStatus) => {
    updateAppointment(aptId, { status: newStatus });
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'arrived') {
      return <Badge variant="success">Arrived</Badge>;
    }
    if (s === 'done') {
      return <Badge variant="secondary">Done</Badge>;
    }
    return <Badge variant="info">Pending</Badge>;
  };

  const columns = [
    { key: 'time', header: 'Time Slot', render: (a) => <span className="font-bold text-foreground">{a.time}</span> },
    { key: 'patientName', header: 'Patient Name', render: (a) => <span className="font-extrabold text-foreground">{a.patientName}</span> },
    { key: 'treatment', header: 'Treatment Focus' },
    { key: 'status', header: 'Status', render: (a) => getStatusBadge(a.status) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div className="flex gap-2 justify-end items-center">
          {/* Quick status updates */}
          <div className="flex bg-muted p-0.5 rounded-lg border border-border">
            <button
              onClick={() => handleStatusChange(a.id, 'Pending')}
              className={`px-2 py-1 text-[9px] font-bold rounded-md cursor-pointer transition-colors ${
                a.status.toLowerCase() === 'pending' ? 'bg-indigo-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Set to Pending"
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange(a.id, 'Arrived')}
              className={`px-2 py-1 text-[9px] font-bold rounded-md cursor-pointer transition-colors ${
                a.status.toLowerCase() === 'confirmed' || a.status.toLowerCase() === 'arrived' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Set to Arrived"
            >
              Arrived
            </button>
            <button
              onClick={() => handleStatusChange(a.id, 'Done')}
              className={`px-2 py-1 text-[9px] font-bold rounded-md cursor-pointer transition-colors ${
                a.status.toLowerCase() === 'done' ? 'bg-slate-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Set to Done"
            >
              Done
            </button>
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Trigger Treatment */}
          <Button
            size="sm"
            onClick={() => handleStartTreatment(a.patientName)}
            className="font-bold text-[10px] gap-1 bg-primary hover:bg-primary/90 hover:scale-102 transition-all cursor-pointer h-8"
          >
            <Play className="h-3 w-3 fill-current" />
            Start Treatment
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Clinical Appointments & Calendar
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Review daily schedules, update patient statuses, and open active charts to execute treatments.
        </p>
      </div>

      {/* Grid: Left - Today's Calendar, Right - Upcoming */}
      <div className="grid grid-cols-1 gap-6">
        {/* Today's Schedule panel */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-black text-sm uppercase text-primary tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Dr. Michael Chen &bull; Today's Schedule
            </h3>
            <span className="text-xs font-bold text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-lg">
              Date: {todayDate}
            </span>
          </div>

          <DataTable columns={columns} data={todayApts} searchKey="patientName" searchPlaceholder="Search today's schedule..." pageSize={5} />
        </div>

        {/* Upcoming Schedule panel */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-black text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Upcoming Schedule (Future Calendar)
            </h3>
          </div>

          <DataTable columns={columns} data={upcomingApts} searchKey="patientName" searchPlaceholder="Search upcoming calendar..." pageSize={5} />
        </div>
      </div>
    </div>
  );
}
export default DentistAppointmentsPage;
