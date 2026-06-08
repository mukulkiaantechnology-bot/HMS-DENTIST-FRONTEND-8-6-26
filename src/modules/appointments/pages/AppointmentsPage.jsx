import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Check, X as CancelIcon, Plus } from 'lucide-react';
import { useAppointmentStore } from '../../../store/appointmentStore';
import { usePatientStore } from '../../../store/patientStore';
import { useClinicStore } from '../../../store/clinicStore';
import { useAuthStore } from '../../../store/authStore';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';

// Booking Schema
const bookingSchema = z.object({
  patientId: z.string().min(1, 'Patient selection is required'),
  dentistName: z.string().min(1, 'Dentist selection is required'),
  date: z.string().min(1, 'Appointment date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Minimum 15 minutes').max(240, 'Maximum 4 hours'),
  type: z.enum(['Cleaning', 'Filling', 'Root Canal', 'Orthodontic', 'Crown', 'Consultation']),
  notes: z.string().optional()
});

export function AppointmentsPage() {
  const user = useAuthStore((state) => state.user);
  const selectedClinicId = useClinicStore((state) => state.selectedClinicId);
  const clinics = useClinicStore((state) => state.clinics);
  const patients = usePatientStore((state) => state.patients);
  const { appointments, addAppointment, updateAppointment } = useAppointmentStore();
  const toast = useToast();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

  // Generate 5 days (today, and next 4 days) for the scheduler navigation
  const schedulerDays = useMemo(() => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const isToday = i === 0;
      days.push({
        offset: i,
        dayName: weekdays[date.getDay()],
        dateString: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        label: isToday ? 'Today' : weekdays[date.getDay()]
      });
    }
    return days;
  }, []);

  const selectedDateString = schedulerDays[selectedDayOffset].dateString;

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientId: '',
      dentistName: 'Dr. Michael Chen, DDS',
      date: selectedDateString,
      time: '09:00',
      duration: 45,
      type: 'Cleaning',
      notes: ''
    }
  });

  // Filter appointments by selected clinic AND day
  const filteredAppointments = appointments.filter((appt) => {
    const matchesClinic = selectedClinicId === 'all' || appt.clinicId === selectedClinicId;
    const matchesDate = appt.date === selectedDateString;
    return matchesClinic && matchesDate;
  });

  // Open booking form
  const handleOpenBooking = () => {
    reset({
      patientId: patients.length > 0 ? patients[0].id : '',
      dentistName: 'Dr. Michael Chen, DDS',
      date: selectedDateString,
      time: '09:00',
      duration: 45,
      type: 'Cleaning',
      notes: ''
    });
    setIsBookModalOpen(true);
  };

  // Submit appointment booking
  const onSubmit = (data) => {
    const patientRecord = patients.find((p) => p.id === data.patientId);
    if (!patientRecord) {
      toast.error('Selected patient record could not be found.');
      return;
    }

    // Determine target clinic
    const targetClinicId = selectedClinicId === 'all' ? patientRecord.clinicId : selectedClinicId;

    const apptData = {
      ...data,
      patientName: patientRecord.name,
      clinicId: targetClinicId,
      status: 'Scheduled'
    };

    addAppointment(apptData);
    toast.success(`Appointment booked for ${patientRecord.name} on ${data.date} at ${data.time}.`);
    setIsBookModalOpen(false);
  };

  // Toggle status triggers
  const handleStatusChange = (id, newStatus, patientName) => {
    updateAppointment(id, { status: newStatus });
    toast.info(`Appointment status for ${patientName} updated to ${newStatus}.`);
  };

  // Map clinic ID to labels
  const clinicNames = clinics.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {});

  // Columns definition
  const columns = [
    { key: 'time', header: 'Time', render: (a) => <span className="font-semibold">{a.time}</span> },
    { key: 'patientName', header: 'Patient' },
    { key: 'dentistName', header: 'Doctor/DDS', render: (a) => <span className="text-xs text-muted-foreground font-semibold">{a.dentistName.split(',')[0]}</span> },
    { key: 'type', header: 'Treatment Type', render: (a) => <Badge variant="secondary">{a.type}</Badge> },
    {
      key: 'clinicId',
      header: 'Clinic Location',
      render: (a) => <span className="text-xs font-semibold text-muted-foreground">{clinicNames[a.clinicId]?.split(' ')[0]}</span>
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (a) => (
        <Badge
          variant={
            a.status === 'Completed'
              ? 'success'
              : a.status === 'Checked-In'
              ? 'info'
              : a.status === 'Cancelled'
              ? 'destructive'
              : 'default'
          }
          className="text-[10px] font-semibold py-0.5 px-2"
        >
          {a.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (a) => {
        if (a.status === 'Completed' || a.status === 'Cancelled') return null;
        return (
          <div className="flex items-center justify-end gap-1">
            {a.status === 'Scheduled' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(a.id, 'Checked-In', a.patientName)}
                className="h-8 px-2 text-xs text-info hover:bg-info/10 font-bold"
                title="Mark Patient as Checked-In"
              >
                Check In
              </Button>
            )}
            {a.status === 'Checked-In' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(a.id, 'Completed', a.patientName)}
                className="h-8 px-2 text-xs text-success hover:bg-success/10 font-bold"
                title="Complete Visit"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(a.id, 'Cancelled', a.patientName)}
              className="h-8 w-8 hover:bg-destructive/10 text-destructive rounded-full"
              title="Cancel Appointment"
            >
              <CancelIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Scheduler Calendar</h1>
          <p className="text-sm text-muted-foreground font-semibold mt-1">
            Book clinical procedures, view daily schedules, and manage patient statuses.
          </p>
        </div>
        {(user?.role === 'super_admin' ||
          user?.role === 'clinic_owner' ||
          user?.role === 'front_desk') && (
          <Button onClick={handleOpenBooking} className="gap-2 select-none cursor-pointer">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      {/* Interactive Daily Switcher */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-2xl bg-card border border-border p-1.5 rounded-xl">
        {schedulerDays.map((day) => (
          <button
            key={day.offset}
            onClick={() => setSelectedDayOffset(day.offset)}
            className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all cursor-pointer ${
              selectedDayOffset === day.offset
                ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground font-medium'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">{day.label}</span>
            <span className="text-sm font-bold mt-0.5">{day.displayDate}</span>
          </button>
        ))}
      </div>

      {/* Main Agenda list */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Visits Agenda for {schedulerDays[selectedDayOffset].displayDate}
        </h3>
        <DataTable
          columns={columns}
          data={filteredAppointments}
          searchPlaceholder="Search visits..."
          pageSize={10}
        />
      </div>

      {/* Booking Form Modal */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Book New Appointment Slot">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Select Patient"
            error={errors.patientId?.message}
            options={[
              { value: '', label: 'Select registered patient...' },
              ...patients.map((p) => ({
                value: p.id,
                label: `${p.name} (Age: ${p.age}) - Phone: ${p.phone}`
              }))
            ]}
            {...register('patientId')}
          />

          <Select
            label="Select Dentist"
            error={errors.dentistName?.message}
            options={[
              { value: 'Dr. Michael Chen, DDS', label: 'Dr. Michael Chen, DDS (General Dentist)' },
              { value: 'Dr. Sarah Patel, DDS', label: 'Dr. Sarah Patel, DDS (Orthodontist)' },
              { value: 'Dr. John Miller, DMD', label: 'Dr. John Miller, DMD (Pediatric)' }
            ]}
            {...register('dentistName')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Appointment Date" type="date" error={errors.date?.message} {...register('date')} />
            <Input label="Start Time" type="time" error={errors.time?.message} {...register('time')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" error={errors.duration?.message} {...register('duration', { valueAsNumber: true })} />
            <Select
              label="Treatment Type"
              error={errors.type?.message}
              options={[
                { value: 'Cleaning', label: 'Prophylaxis/Cleaning' },
                { value: 'Filling', label: 'Composite Filling' },
                { value: 'Root Canal', label: 'Endodontic Root Canal' },
                { value: 'Orthodontic', label: 'Orthodontic adjustment' },
                { value: 'Crown', label: 'Crown / Restorative' },
                { value: 'Consultation', label: 'Initial Consultation' }
              ]}
              {...register('type')}
            />
          </div>

          <Input label="Clinical Notes / Symptoms" error={errors.notes?.message} {...register('notes')} placeholder="e.g. Tooth ache on lower left molar, sensitivy to cold" />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Visit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
export default AppointmentsPage;
