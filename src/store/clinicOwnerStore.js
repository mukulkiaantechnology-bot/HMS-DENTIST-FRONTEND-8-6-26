import { create } from 'zustand';

const INITIAL_PATIENTS = [
  { id: 'pat-1', name: 'James Carter', age: 45, gender: 'Male', phone: '(206) 555-1212', email: 'james@gmail.com', status: 'Active', clinicId: 'clinic-1', insuranceProvider: 'MetLife Dental', allergies: ['Penicillin'], address: '123 Pine St, Seattle, WA' },
  { id: 'pat-2', name: 'Mary Watson', age: 34, gender: 'Female', phone: '(206) 555-8989', email: 'mary@gmail.com', status: 'Active', clinicId: 'clinic-1', insuranceProvider: 'Delta Dental', allergies: ['Latex'], address: '456 Oak St, Seattle, WA' },
  { id: 'pat-3', name: 'Alex Johnson', age: 29, gender: 'Male', phone: '(206) 555-4343', email: 'alex.j@gmail.com', status: 'Inactive', clinicId: 'clinic-1', insuranceProvider: 'Cigna', allergies: [], address: '789 Maple Ave, Bellevue, WA' },
  { id: 'pat-4', name: 'Sarah Jenkins', age: 38, gender: 'Female', phone: '(206) 555-7788', email: 's.jenkins@hms-saas.com', status: 'Active', clinicId: 'clinic-1', insuranceProvider: 'Guardian Dental', allergies: [], address: '101 Broadway, Seattle, WA' },
  { id: 'pat-5', name: 'Robert Chen', age: 52, gender: 'Male', phone: '(425) 555-9012', email: 'robert@chen.org', status: 'Active', clinicId: 'clinic-2', insuranceProvider: 'Aetna PPO', allergies: ['Sulfa'], address: '202 Bellevue Way, Bellevue, WA' },
  { id: 'pat-6', name: 'Emily Davis', age: 26, gender: 'Female', phone: '(425) 555-3456', email: 'emily.d@gmail.com', status: 'Active', clinicId: 'clinic-2', insuranceProvider: 'None', allergies: [], address: '303 Red Wood Ave, Redmond, WA' }
];

const INITIAL_STAFF = [
  { id: 'stf-1', name: 'Dr. Michael Chen', role: 'Dentist', speciality: 'General Dentistry', phone: '(206) 555-9090', email: 'chen@vancedental.com', status: 'Active' },
  { id: 'stf-2', name: 'Elena Rostova, RDH', role: 'Hygienist', speciality: 'Dental Hygiene', phone: '(206) 555-8080', email: 'elena@vancedental.com', status: 'Active' },
  { id: 'stf-3', name: 'David Miller', role: 'Assistant', speciality: 'Surgery Assistant', phone: '(206) 555-7070', email: 'david@vancedental.com', status: 'Inactive' }
];

const INITIAL_APPOINTMENTS = [
  { id: 'apt-1', patientName: 'James Carter', dentistName: 'Dr. Michael Chen', time: '09:00 AM', date: '2026-06-08', treatment: 'Teeth Cleaning', status: 'Confirmed' },
  { id: 'apt-2', patientName: 'Mary Watson', dentistName: 'Dr. Michael Chen', time: '11:30 AM', date: '2026-06-08', treatment: 'Root Canal Therapy', status: 'Confirmed' },
  { id: 'apt-3', patientName: 'Alex Johnson', dentistName: 'Dr. Michael Chen', time: '02:00 PM', date: '2026-06-09', treatment: 'Orthodontic Checkup', status: 'Pending' }
];

const INITIAL_CLINICAL_NOTES = [
  { id: 'cn-1', patientName: 'James Carter', dentistName: 'Dr. Michael Chen', toothNumber: '14', diagnosis: 'Class I caries', treatment: 'Composite Restoration', date: '2026-06-08', notes: 'Patient tolerated treatment well. Pre-op sensitivity reported.' },
  { id: 'cn-2', patientName: 'Mary Watson', dentistName: 'Dr. Michael Chen', toothNumber: '19', diagnosis: 'Irreversible pulpitis', treatment: 'Pulpectomy', date: '2026-06-08', notes: 'Root canal treatment started. Temporary restoration placed.' }
];

const INITIAL_INVOICES = [
  { id: 'inv-101', patientName: 'James Carter', amount: 150.00, date: '2026-06-08', status: 'Paid', paymentMethod: 'Card' },
  { id: 'inv-102', patientName: 'Mary Watson', amount: 450.00, date: '2026-06-08', status: 'Unpaid', paymentMethod: 'Pending' },
  { id: 'inv-103', patientName: 'Alex Johnson', amount: 80.00, date: '2026-06-07', status: 'Paid', paymentMethod: 'Cash' }
];

const INITIAL_SETTINGS = {
  name: 'Metropolitan Dental Care',
  address: 'Downtown Seattle, WA',
  phone: '(206) 555-0192',
  email: 'seattle@hms.com',
  website: 'www.metropolitandental.com',
  hours: 'Mon - Fri, 9:00 AM - 5:00 PM'
};

export const useClinicOwnerStore = create((set) => ({
  patients: INITIAL_PATIENTS,
  staff: INITIAL_STAFF,
  appointments: INITIAL_APPOINTMENTS,
  clinicalNotes: INITIAL_CLINICAL_NOTES,
  invoices: INITIAL_INVOICES,
  settings: INITIAL_SETTINGS,

  // --- PATIENTS CRUD ---
  addPatient: (data) =>
    set((state) => {
      const newId = `pat-${state.patients.length + 1}`;
      const newPat = { id: newId, status: 'Active', ...data };
      return { patients: [...state.patients, newPat] };
    }),
  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p))
    })),
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id)
    })),

  // --- STAFF CRUD ---
  addStaff: (data) =>
    set((state) => {
      const newId = `stf-${state.staff.length + 1}`;
      const newStf = { id: newId, status: 'Active', ...data };
      return { staff: [...state.staff, newStf] };
    }),
  updateStaff: (id, data) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s))
    })),
  deleteStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id)
    })),

  // --- APPOINTMENTS CRUD ---
  addAppointment: (data) =>
    set((state) => {
      const newId = `apt-${state.appointments.length + 1}`;
      const newApt = { id: newId, status: 'Pending', ...data };
      return { appointments: [...state.appointments, newApt] };
    }),
  updateAppointment: (id, data) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...data } : a))
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id)
    })),

  // --- CLINICAL NOTES CRUD ---
  addClinicalNote: (data) =>
    set((state) => {
      const newId = `cn-${state.clinicalNotes.length + 1}`;
      const newCN = { id: newId, date: new Date().toISOString().split('T')[0], ...data };
      return { clinicalNotes: [...state.clinicalNotes, newCN] };
    }),
  updateClinicalNote: (id, data) =>
    set((state) => ({
      clinicalNotes: state.clinicalNotes.map((n) => (n.id === id ? { ...n, ...data } : n))
    })),
  deleteClinicalNote: (id) =>
    set((state) => ({
      clinicalNotes: state.clinicalNotes.filter((n) => n.id !== id)
    })),

  // --- INVOICES CRUD ---
  addInvoice: (data) =>
    set((state) => {
      const newId = `inv-${100 + state.invoices.length + 1}`;
      const newInv = { id: newId, date: new Date().toISOString().split('T')[0], ...data, amount: Number(data.amount) || 0.0 };
      return { invoices: [...state.invoices, newInv] };
    }),
  updateInvoice: (id, data) =>
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...data, amount: data.amount !== undefined ? Number(data.amount) : inv.amount } : inv))
    })),
  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id)
    })),

  // --- CLINIC CONFIG SETTINGS ---
  updateClinicSettings: (data) =>
    set((state) => ({
      settings: { ...state.settings, ...data }
    }))
}));
