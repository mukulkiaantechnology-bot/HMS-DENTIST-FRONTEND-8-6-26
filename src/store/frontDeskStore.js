import { create } from 'zustand';

const INITIAL_WAITLIST = [
  { id: 'wl-1', patientName: 'Arthur Dent', phone: '(206) 555-4242', preferredTime: 'Morning', priority: 'High', addedTime: '2026-06-08 08:30 AM', reason: 'Emergency toothache' },
  { id: 'wl-2', patientName: 'Ford Prefect', phone: '(206) 555-7722', preferredTime: 'Afternoon', priority: 'Medium', addedTime: '2026-06-08 09:15 AM', reason: 'Broken crown check' },
  { id: 'wl-3', patientName: 'Tricia McMillan', phone: '(206) 555-8833', preferredTime: 'Late Afternoon', priority: 'Low', addedTime: '2026-06-08 10:00 AM', reason: 'Routine consultation' }
];

const INITIAL_INSURANCE_CHECKS = [
  { id: 'ins-1', patientName: 'Alice Henderson', provider: 'Blue Cross Blue Shield', policyNumber: 'BCBS-987654', status: 'Approved', coverageDetails: '100% preventive, 80% basic restorations, 50% major services. Max annual benefit $2,000.', lastChecked: '2026-06-08' },
  { id: 'ins-2', patientName: 'Robert Vance', provider: 'Aetna', policyNumber: 'AET-112233', status: 'Approved', coverageDetails: '100% preventive, 70% basic restorations, 50% major services. Max annual benefit $1,500.', lastChecked: '2026-06-08' },
  { id: 'ins-3', patientName: 'Chloe Sinclair', provider: 'Cigna', policyNumber: 'CIG-882200', status: 'Pending', coverageDetails: '', lastChecked: '2026-06-08' },
  { id: 'ins-4', patientName: 'Ethan Hunt', provider: 'UnitedHealthcare', policyNumber: 'UHC-404404', status: 'Rejected', coverageDetails: 'Plan terminated as of 2026-05-31. Out of network.', lastChecked: '2026-06-07' }
];

const INITIAL_WALKINS = [
  { id: 'wi-1', patientName: 'Zaphod Beeblebrox', phone: '(206) 555-9999', arrivedTime: '11:15 AM', status: 'Waiting', doctor: 'Dr. Michael Chen, DDS' },
  { id: 'wi-2', patientName: 'Marvin Android', phone: '(206) 555-1111', arrivedTime: '11:30 AM', status: 'Checked-In', doctor: 'Dr. Michael Chen, DDS' }
];

export const useFrontDeskStore = create((set) => ({
  waitlist: INITIAL_WAITLIST,
  insuranceChecks: INITIAL_INSURANCE_CHECKS,
  walkins: INITIAL_WALKINS,

  addToWaitlist: (item) =>
    set((state) => {
      const newId = `wl-${state.waitlist.length + 1}`;
      const newItem = {
        id: newId,
        addedTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...item
      };
      return { waitlist: [...state.waitlist, newItem] };
    }),

  removeFromWaitlist: (id) =>
    set((state) => ({
      waitlist: state.waitlist.filter((w) => w.id !== id)
    })),

  updateWaitlistPriority: (id, priority) =>
    set((state) => ({
      waitlist: state.waitlist.map((w) => (w.id === id ? { ...w, priority } : w))
    })),

  addInsuranceCheck: (check) =>
    set((state) => {
      const newId = `ins-${state.insuranceChecks.length + 1}`;
      const newCheck = {
        id: newId,
        status: 'Pending',
        coverageDetails: '',
        lastChecked: new Date().toISOString().split('T')[0],
        ...check
      };
      return { insuranceChecks: [newCheck, ...state.insuranceChecks] };
    }),

  evaluateEligibility: (id, status, coverageDetails) =>
    set((state) => ({
      insuranceChecks: state.insuranceChecks.map((ins) =>
        ins.id === id
          ? {
              ...ins,
              status,
              coverageDetails,
              lastChecked: new Date().toISOString().split('T')[0]
            }
          : ins
      )
    })),

  addWalkIn: (walkin) =>
    set((state) => {
      const newId = `wi-${state.walkins.length + 1}`;
      const newWalkIn = {
        id: newId,
        arrivedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Waiting',
        ...walkin
      };
      return { walkins: [newWalkIn, ...state.walkins] };
    }),

  updateWalkInStatus: (id, status) =>
    set((state) => ({
      walkins: state.walkins.map((wi) => (wi.id === id ? { ...wi, status } : wi))
    }))
}));
