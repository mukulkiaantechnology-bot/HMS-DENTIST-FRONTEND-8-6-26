import { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Stethoscope,
  DollarSign,
  BrainCircuit,
  Settings,
  TrendingUp,
  Activity,
  UserCheck2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useClinicOwnerStore } from '../../../store/clinicOwnerStore';
import { DataTable } from '../../../shared/ui/DataTable';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';

// Shared Status badge helper
function StatusBadge({ status }) {
  if (status === 'Active' || status === 'Paid' || status === 'Confirmed') {
    return <Badge variant="success">{status}</Badge>;
  } else if (status === 'Pending' || status === 'Unpaid') {
    return <Badge variant="info">{status}</Badge>;
  } else {
    return <Badge variant="destructive">{status}</Badge>;
  }
}

// 1. SCOPED PATIENTS PAGE (CRUD)
export function ClinicPatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = useClinicOwnerStore();
  const toast = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activePat, setActivePat] = useState(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setAge('');
    setPhone('');
    setEmail('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (pat) => {
    setActivePat(pat);
    setName(pat.name);
    setAge(String(pat.age));
    setPhone(pat.phone);
    setEmail(pat.email);
    setIsEditOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addPatient({ name, age: Number(age) || 0, phone, email });
    toast.success(`Registered patient: ${name}`);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!activePat) return;
    updatePatient(activePat.id, { name, age: Number(age) || 0, phone, email });
    toast.success(`Updated details for patient: ${name}`);
    setIsEditOpen(false);
  };

  const handleDelete = (id, patName) => {
    if (confirm(`Permanently delete record for patient "${patName}"?`)) {
      deletePatient(id);
      toast.warning(`Deleted patient: ${patName}`);
    }
  };

  const columns = [
    { key: 'id', header: 'Patient ID', render: (p) => <span className="font-bold text-slate-500">#{p.id}</span> },
    { key: 'name', header: 'Full Name' },
    { key: 'age', header: 'Age' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} className="h-8 w-8 rounded-full">
            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.name)} className="h-8 w-8 rounded-full">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Patients Registry
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold">Manage clinical profiles and registration records for local clinic patients.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="bg-card p-4 md:p-5 border border-border rounded-xl shadow-sm">
        <DataTable columns={columns} data={patients} searchKey="name" searchPlaceholder="Search patients by name..." pageSize={10} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Patient Profile">
        <form onSubmit={handleAddSubmit} className="space-y-4 flex flex-col h-full">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 30" />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. (206) 555-1122" />
          </div>
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@gmail.com" />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Register Patient</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Patient Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4 flex flex-col h-full">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// 2. SCOPED APPOINTMENTS PAGE (CRUD)
export function ClinicAppointmentsPage() {
  const { appointments, patients, staff, addAppointment, updateAppointment, deleteAppointment } = useClinicOwnerStore();
  const toast = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeApt, setActiveApt] = useState(null);

  const [patientName, setPatientName] = useState('');
  const [dentistName, setDentistName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [treatment, setTreatment] = useState('Teeth Cleaning');
  const [status, setStatus] = useState('Confirmed');

  const handleOpenAdd = () => {
    setPatientName(patients[0]?.name || '');
    setDentistName(staff.find((s) => s.role === 'Dentist')?.name || '');
    setTime('09:00 AM');
    setDate(new Date().toISOString().split('T')[0]);
    setTreatment('Teeth Cleaning');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setActiveApt(apt);
    setPatientName(apt.patientName);
    setDentistName(apt.dentistName);
    setTime(apt.time);
    setDate(apt.date);
    setTreatment(apt.treatment);
    setStatus(apt.status);
    setIsEditOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAppointment({ patientName, dentistName, time, date, treatment });
    toast.success(`Booked appointment for ${patientName}`);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!activeApt) return;
    updateAppointment(activeApt.id, { patientName, dentistName, time, date, treatment, status });
    toast.success(`Rescheduled appointment for ${patientName}`);
    setIsEditOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Cancel this scheduled appointment?')) {
      deleteAppointment(id);
      toast.warning('Appointment cancelled successfully.');
    }
  };

  const columns = [
    { key: 'patientName', header: 'Patient Name' },
    { key: 'dentistName', header: 'Dentist / Clinician' },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time Slot' },
    { key: 'treatment', header: 'Treatment Focus' },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(a)} className="h-8 w-8 rounded-full">
            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="h-8 w-8 rounded-full">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Appointments Scheduler
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold">Coordinate patient dental schedules and staff clinician calendar slots.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <div className="bg-card p-4 md:p-5 border border-border rounded-xl shadow-sm">
        <DataTable columns={columns} data={appointments} searchKey="patientName" searchPlaceholder="Search by patient name..." pageSize={10} />
      </div>

      {/* Book Appointment Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule New Dental Appointment">
        <form onSubmit={handleAddSubmit} className="space-y-4 flex flex-col h-full">
          <Select
            label="Select Patient"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            options={patients.map((p) => ({ value: p.name, label: p.name }))}
          />
          <Select
            label="Select Dentist"
            value={dentistName}
            onChange={(e) => setDentistName(e.target.value)}
            options={staff.filter((s) => s.role === 'Dentist').map((s) => ({ value: s.name, label: s.name }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Appointment Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label="Time Slot" value={time} onChange={(e) => setTime(e.target.value)} required placeholder="e.g. 10:00 AM" />
          </div>
          <Select
            label="Treatment Plan"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            options={[
              { value: 'Teeth Cleaning', label: 'Hygiene & Cleaning' },
              { value: 'Root Canal Therapy', label: 'Endodontics (Root Canal)' },
              { value: 'Orthodontic Checkup', label: 'Braces / Orthodontics' },
              { value: 'Dental Crown Placement', label: 'Prosthodontics (Crown)' }
            ]}
          />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Book Slot</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Reschedule Appointment Settings">
        {activeApt && (
          <form onSubmit={handleEditSubmit} className="space-y-4 flex flex-col h-full">
            <Select
              label="Select Patient"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              options={patients.map((p) => ({ value: p.name, label: p.name }))}
              disabled
            />
            <Select
              label="Select Dentist"
              value={dentistName}
              onChange={(e) => setDentistName(e.target.value)}
              options={staff.filter((s) => s.role === 'Dentist').map((s) => ({ value: s.name, label: s.name }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Appointment Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <Input label="Time Slot" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <Select
              label="Treatment Plan"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              options={[
                { value: 'Teeth Cleaning', label: 'Hygiene & Cleaning' },
                { value: 'Root Canal Therapy', label: 'Endodontics (Root Canal)' },
                { value: 'Orthodontic Checkup', label: 'Braces / Orthodontics' },
                { value: 'Dental Crown Placement', label: 'Prosthodontics (Crown)' }
              ]}
            />
            <Select
              label="Appointment Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'Confirmed', label: 'Confirmed' },
                { value: 'Pending', label: 'Pending Request' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]}
            />
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// 3. CLINICAL CHARTS PAGE (CRUD)
export function ClinicClinicalPage() {
  const { clinicalNotes, patients, staff, addClinicalNote, updateClinicalNote, deleteClinicalNote } = useClinicOwnerStore();
  const toast = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const [patientName, setPatientName] = useState('');
  const [dentistName, setDentistName] = useState('');
  const [toothNumber, setToothNumber] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setPatientName(patients[0]?.name || '');
    setDentistName(staff.find((s) => s.role === 'Dentist')?.name || '');
    setToothNumber('');
    setDiagnosis('');
    setTreatment('');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (n) => {
    setActiveNote(n);
    setPatientName(n.patientName);
    setDentistName(n.dentistName);
    setToothNumber(n.toothNumber);
    setDiagnosis(n.diagnosis);
    setTreatment(n.treatment);
    setNotes(n.notes);
    setIsEditOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addClinicalNote({ patientName, dentistName, toothNumber, diagnosis, treatment, notes });
    toast.success(`Clinical note saved for ${patientName}`);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!activeNote) return;
    updateClinicalNote(activeNote.id, { patientName, dentistName, toothNumber, diagnosis, treatment, notes });
    toast.success(`Clinical note modified successfully.`);
    setIsEditOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Permanently purge this clinical chart entry?')) {
      deleteClinicalNote(id);
      toast.warning('Clinical chart entry deleted.');
    }
  };

  const columns = [
    { key: 'date', header: 'Entry Date' },
    { key: 'patientName', header: 'Patient' },
    { key: 'dentistName', header: 'Doctor' },
    { key: 'toothNumber', header: 'Tooth #', render: (n) => <span className="font-extrabold text-indigo-400">#{n.toothNumber}</span> },
    { key: 'diagnosis', header: 'Diagnosis' },
    { key: 'treatment', header: 'Completed Treatment' },
    { key: 'notes', header: 'Clinical Notes Summary', render: (n) => <span className="text-xs text-muted-foreground truncate max-w-xs block font-semibold">{n.notes}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (n) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(n)} className="h-8 w-8 rounded-full">
            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)} className="h-8 w-8 rounded-full">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold flex items-center gap-2 text-foreground">
            <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Clinical Notes & Charting
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold">Document dental diagnoses, charting graphs, and clinical procedure summaries.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Add Chart Entry
        </Button>
      </div>

      <div className="bg-card p-4 md:p-5 border border-border rounded-xl shadow-sm">
        <DataTable columns={columns} data={clinicalNotes} searchKey="patientName" searchPlaceholder="Search by patient..." pageSize={10} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Clinical Chart Entry">
        <form onSubmit={handleAddSubmit} className="space-y-4 flex flex-col h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Patient"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              options={patients.map((p) => ({ value: p.name, label: p.name }))}
            />
            <Select
              label="Clinician Doctor"
              value={dentistName}
              onChange={(e) => setDentistName(e.target.value)}
              options={staff.filter((s) => s.role === 'Dentist').map((s) => ({ value: s.name, label: s.name }))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Tooth Number (Universal System)" value={toothNumber} onChange={(e) => setToothNumber(e.target.value)} placeholder="e.g. 19" required />
            <Input label="Diagnosis / Classification" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Class I composite decay" required />
          </div>
          <Input label="Treatment / Procedure Completed" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="e.g. Filling, Root canal extraction" required />
          <Input label="Detailed Practitioner Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter details about anesthesia, composites, post-op..." />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Save Entry</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Clinical Chart Settings">
        {activeNote && (
          <form onSubmit={handleEditSubmit} className="space-y-4 flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Patient"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                options={patients.map((p) => ({ value: p.name, label: p.name }))}
                disabled
              />
              <Select
                label="Clinician Doctor"
                value={dentistName}
                onChange={(e) => setDentistName(e.target.value)}
                options={staff.filter((s) => s.role === 'Dentist').map((s) => ({ value: s.name, label: s.name }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Tooth Number" value={toothNumber} onChange={(e) => setToothNumber(e.target.value)} required />
              <Input label="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
            </div>
            <Input label="Treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
            <Input label="Detailed Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// 4. BILLING & INVOICES PAGE (CRUD)
// 4. BILLING HUB — Tabbed Billing System (imports from BillingPages.jsx)
import {
  BillingDashboardTab,
  BillingInvoicesTab,
  BillingPaymentsTab,
  BillingClaimsTab,
  BillingStatementsTab
} from './BillingPages';

export function ClinicBillingPage() {
  const BILLING_TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'invoices', label: 'Invoices', icon: '🧾' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'claims', label: 'Claims', icon: '🛡️' },
    { id: 'statements', label: 'Statements', icon: '📋' }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <BillingDashboardTab />;
      case 'invoices':  return <BillingInvoicesTab />;
      case 'payments':  return <BillingPaymentsTab />;
      case 'claims':    return <BillingClaimsTab />;
      case 'statements': return <BillingStatementsTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5 text-left animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Billing & Financial Management</h2>
          <p className="text-[10px] text-muted-foreground font-semibold">Invoices · Payments · Claims · Statements — all in one place.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-xl w-fit overflow-x-auto">
        {BILLING_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[500px]">
        {renderTab()}
      </div>
    </div>
  );
}

// 5. STAFF DIRECTORY PAGE (CRUD)
export function ClinicStaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useClinicOwnerStore();
  const toast = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeStf, setActiveStf] = useState(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Dentist');
  const [speciality, setSpeciality] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setRole('Dentist');
    setSpeciality('');
    setPhone('');
    setEmail('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (stf) => {
    setActiveStf(stf);
    setName(stf.name);
    setRole(stf.role);
    setSpeciality(stf.speciality);
    setPhone(stf.phone);
    setEmail(stf.email);
    setIsEditOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addStaff({ name, role, speciality, phone, email });
    toast.success(`Added employee credentials: ${name}`);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!activeStf) return;
    updateStaff(activeStf.id, { name, role, speciality, phone, email });
    toast.success(`Updated details for employee: ${name}`);
    setIsEditOpen(false);
  };

  const handleDelete = (id, stfName) => {
    if (confirm(`Revoke credentials and delete record for ${stfName}?`)) {
      deleteStaff(id);
      toast.warning(`Deleted staff record: ${stfName}`);
    }
  };

  const columns = [
    { key: 'name', header: 'Staff Name', render: (s) => <span className="font-semibold">{s.name}</span> },
    { key: 'role', header: 'Clinic Role', render: (s) => <span className="font-semibold text-slate-500">{s.role}</span> },
    { key: 'speciality', header: 'Speciality' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(s)} className="h-8 w-8 rounded-full">
            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id, s.name)} className="h-8 w-8 rounded-full">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold flex items-center gap-2 text-foreground">
            <UserCheck2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Clinic Staff Registry
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold">Manage clinical and administrative employees registered for this clinic location.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">
          <Plus className="h-4 w-4" />
          Register Employee
        </Button>
      </div>

      <div className="bg-card p-4 md:p-5 border border-border rounded-xl shadow-sm">
        <DataTable columns={columns} data={staff} searchKey="name" searchPlaceholder="Search employees by name..." pageSize={10} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Clinic Employee">
        <form onSubmit={handleAddSubmit} className="space-y-4 flex flex-col h-full">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Dr. Robert Miller" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Role Assignment"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'Dentist', label: 'Dentist (DDS/DMD)' },
                { value: 'Hygienist', label: 'Hygienist (RDH)' },
                { value: 'Assistant', label: 'Dental Assistant' },
                { value: 'Front Desk', label: 'Receptionist' }
              ]}
            />
            <Input label="Speciality Field" value={speciality} onChange={(e) => setSpeciality(e.target.value)} placeholder="e.g. Orthodontics, Surgery" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Contact" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. (206) 555-4433" />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. robert@clinic.com" />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Create Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Employee Settings">
        {activeStf && (
          <form onSubmit={handleEditSubmit} className="space-y-4 flex flex-col h-full">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Role Assignment"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: 'Dentist', label: 'Dentist (DDS/DMD)' },
                  { value: 'Hygienist', label: 'Hygienist (RDH)' },
                  { value: 'Assistant', label: 'Dental Assistant' },
                  { value: 'Front Desk', label: 'Receptionist' }
                ]}
              />
              <Input label="Speciality Field" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Phone Contact" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto h-12 sm:h-10 text-xs font-bold">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// 6. SCOPED REPORTS PAGE
export function ClinicReportsPage() {
  const { invoices } = useClinicOwnerStore();

  const totalSales = useMemo(() => {
    return invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [invoices]);

  const unpaidSales = useMemo(() => {
    return invoices
      .filter((i) => i.status === 'Unpaid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [invoices]);

  const chartData = [
    { name: 'Paid Collections', value: totalSales },
    { name: 'Pending Collections', value: unpaidSales }
  ];

  const barChartData = [
    { name: 'Teeth Cleaning', Amount: 300 },
    { name: 'Root Canal', Amount: 450 },
    { name: 'Crowns', Amount: 800 },
    { name: 'Consultations', Amount: 240 }
  ];

  const COLORS = ['#6366f1', '#fb7185'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Clinic Reports & Financials
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold">Review local clinic collections, procedural splits, and billing flows.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collections Pie Chart */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Billing Collections Structure</h3>
          <div className="h-64 lg:h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${v}`} />
                <Legend formatter={(value, entry) => `${value}: $${entry.payload.value}`} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treatment breakdown Bar Chart */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Procedural Revenue Shares</h3>
          <div className="h-64 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 500 }} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Bar dataKey="Amount" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. SCOPED AI INSIGHTS PAGE
export function ClinicAIPage() {
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [selectedFile, setSelectedFile] = useState('radiograph_lower_jaw.dcm');

  const runMockScan = () => {
    setIsScanning(true);
    setScanResult('');
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('AI Diagnosis Scan Complete: Suspicion of alveolar bone-loss detected on tooth #19. Diagnostic margin anomaly reported: 2.3mm. Recommended clinical review.');
      toast.success('Clinical AI Scanner diagnostics generated successfully.');
    }, 2000);
  };

  const sendMockRecalls = () => {
    toast.success('Recall SMS notifications generated and pushed to patient mobile carriers!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          Clinical AI Diagnostic Panel
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Simulate neural-network radiograph audits and recall automations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radiograph Diagnosis Simulator */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">1. DICOM Radiograph Scanner</span>
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Select a jaw radiograph/DICOM file to scan for caries, periodontal bone loss, or nerve root abnormalities.
            </p>
            <Select
              label="Select Target DICOM Scan File"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              options={[
                { value: 'radiograph_lower_jaw.dcm', label: 'Lower Jaw Panoramic (radiograph_lower_jaw.dcm)' },
                { value: 'radiograph_tooth_19.dcm', label: 'Tooth #19 Bitewing Scan (radiograph_tooth_19.dcm)' },
                { value: 'panoramic_full_mouth.dcm', label: 'Full Mouth Orthopantomogram (panoramic_full_mouth.dcm)' }
              ]}
            />

            {isScanning && (
              <div className="p-4 bg-muted/65 border border-border/70 rounded-xl flex items-center justify-center gap-3">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-xs font-bold text-foreground animate-pulse">Running diagnostic models...</span>
              </div>
            )}

            {scanResult && (
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold leading-relaxed">
                {scanResult}
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-border">
            <Button onClick={runMockScan} disabled={isScanning} className="w-full font-bold text-xs py-5">
              Launch Diagnostic Scan
            </Button>
          </div>
        </div>

        {/* Recall Automation Panel */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider block">2. Recall SMS Generative Agent</span>
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Scan clinical databases to find patients overdue for periodic checkups or hygiene treatments. Send automated recall notifications.
            </p>
            <div className="bg-muted p-4 border border-border rounded-xl space-y-2 text-xs font-semibold text-left">
              <div className="flex justify-between">
                <span>Overdue Checkups</span>
                <span className="text-foreground font-extrabold">3 Patients</span>
              </div>
              <div className="flex justify-between">
                <span>Last Campaign Date</span>
                <span className="text-muted-foreground font-bold">2026-06-05</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <Button onClick={sendMockRecalls} className="w-full font-bold text-xs py-5 bg-emerald-500 hover:bg-emerald-600">
              Run Recall Campaign (Send SMS)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. SCOPED CLINIC SETTINGS PAGE
export function ClinicSettingsPage() {
  const { settings, updateClinicSettings } = useClinicOwnerStore();
  const toast = useToast();

  const [name, setName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [hours, setHours] = useState(settings.hours);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClinicSettings({ name, address, phone, email, website, hours });
    toast.success('Local clinic settings updated successfully.');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Clinic General Settings
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Configure local workspace descriptors, contact numbers, and hour logs.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm max-w-2xl text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Practice / Clinic Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Office Location Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Contact" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Public Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Official Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <Input label="Operation Hours" value={hours} onChange={(e) => setHours(e.target.value)} required />
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
