import { create } from 'zustand';
import { useDentistStore } from './dentistStore';
import { useBillingStore } from './billingStore';
import { useLabStore } from './labStore';
import { useAppointmentStore } from './appointmentStore';

export const usePatientStore = create((set, get) => ({
  patientProfile: null,
  appointments: [],
  treatmentPlans: [],
  invoices: [],
  prescriptions: [],
  reports: [],
  labStatus: [],
  activePatientId: 'pat-1', // Default to James Carter for sandbox simulation

  // Dynamic Query Sync across all HMS Stores
  fetchPatientData: (patientId = 'pat-1') => {
    // 1. Fetch Patient details from DentistStore
    const dentistStore = useDentistStore.getState();
    const billingStore = useBillingStore.getState();
    const labStore = useLabStore.getState();
    const apptStore = useAppointmentStore.getState();

    const matchedProfile = dentistStore.patients.find((p) => p.id === patientId) || {
      id: patientId,
      name: 'James Carter',
      age: 45,
      phone: '(206) 555-1212',
      email: 'james@gmail.com',
      vitals: 'BP: 120/80, Temp: 98.6 F',
      allergies: 'None',
      history: 'Standard checkups. No chronic conditions.'
    };

    // 2. Filter Appointments
    const patAppts = apptStore.appointments.filter((a) => a.patientId === patientId);

    // 3. Filter Treatment Plans
    const patTx = dentistStore.treatmentPlans[patientId] || [];

    // 4. Filter Invoices
    const patInvoices = billingStore.invoices.filter((i) => i.patientId === patientId);

    // 5. Filter Prescriptions
    const patRxs = dentistStore.prescriptions[patientId] || [];

    // 6. Filter Reports & X-Rays
    const patXrays = dentistStore.xrays[patientId] || [];

    // 7. Filter Lab Status
    const patLabs = labStore.labCases.filter((c) => c.patientId === patientId);

    set({
      activePatientId: patientId,
      patientProfile: matchedProfile,
      appointments: patAppts,
      treatmentPlans: patTx,
      invoices: patInvoices,
      prescriptions: patRxs,
      reports: patXrays,
      labStatus: patLabs
    });
  },

  // Request Reschedule
  requestReschedule: (apptId, newDate, newTime) => {
    useAppointmentStore.getState().updateAppointment(apptId, {
      date: newDate,
      time: newTime,
      status: 'Scheduled'
    });
    // Re-sync patient data
    get().fetchPatientData(get().activePatientId);
  },

  // Pay Invoice
  payInvoice: (invoiceId, amount) => {
    useBillingStore.getState().payInvoice(invoiceId, amount);
    // Re-sync patient data
    get().fetchPatientData(get().activePatientId);
  },

  syncTreatmentUpdates: () => {
    get().fetchPatientData(get().activePatientId);
  },

  loadInvoices: () => {
    const billingStore = useBillingStore.getState();
    const patInvoices = billingStore.invoices.filter((i) => i.patientId === get().activePatientId);
    set({ invoices: patInvoices });
  },

  refreshReports: () => {
    const dentistStore = useDentistStore.getState();
    const patXrays = dentistStore.xrays[get().activePatientId] || [];
    set({ reports: patXrays });
  }
}));
