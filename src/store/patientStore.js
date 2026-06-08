import { create } from 'zustand';

const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Alice Henderson',
    age: 34,
    gender: 'Female',
    phone: '(206) 555-0104',
    email: 'alice.henderson@example.com',
    address: '1043 Pine St, Seattle, WA 98101',
    clinicId: 'clinic-1',
    lastVisit: '2026-05-14',
    allergies: ['Penicillin'],
    insuranceProvider: 'Blue Cross Blue Shield',
    status: 'Active'
  },
  {
    id: 'pat-2',
    name: 'Robert Vance',
    age: 48,
    gender: 'Male',
    phone: '(206) 555-0112',
    email: 'bob.vance@vancerefrigeration.com',
    address: '1725 Slough Ave, Scranton, PA 18505',
    clinicId: 'clinic-1',
    lastVisit: '2026-04-20',
    allergies: ['Latex'],
    insuranceProvider: 'Aetna',
    status: 'Active'
  },
  {
    id: 'pat-3',
    name: 'Chloe Sinclair',
    age: 27,
    gender: 'Female',
    phone: '(425) 555-0176',
    email: 'chloe.s@example.com',
    address: '8820 NE 12th St, Bellevue, WA 98004',
    clinicId: 'clinic-2',
    lastVisit: '2026-06-01',
    allergies: [],
    insuranceProvider: 'Cigna',
    status: 'Active'
  },
  {
    id: 'pat-4',
    name: 'Ethan Hunt',
    age: 42,
    gender: 'Male',
    phone: '(425) 555-0199',
    email: 'ethan.hunt@imf.org',
    address: '404 IMF Way, Bellevue, WA 98004',
    clinicId: 'clinic-2',
    lastVisit: '2026-03-10',
    allergies: ['Sulfa drugs'],
    insuranceProvider: 'UnitedHealthcare',
    status: 'Active'
  },
  {
    id: 'pat-5',
    name: 'Samantha Collins',
    age: 61,
    gender: 'Female',
    phone: '(425) 555-0155',
    email: 'samantha.collins@example.com',
    address: '15201 100th Ave NE, Bothell, WA 98011',
    clinicId: 'clinic-3',
    lastVisit: '2026-05-28',
    allergies: ['Aspirin'],
    insuranceProvider: 'Delta Dental',
    status: 'Active'
  },
  {
    id: 'pat-6',
    name: 'Marcus Aurelius',
    age: 55,
    gender: 'Male',
    phone: '(425) 555-0131',
    email: 'philosopher.emperor@rome.gov',
    address: '12 Roman Forum Way, Everett, WA 98201',
    clinicId: 'clinic-3',
    lastVisit: '2026-05-02',
    allergies: [],
    insuranceProvider: 'MetLife',
    status: 'Inactive'
  }
];

export const usePatientStore = create((set) => ({
  patients: INITIAL_PATIENTS,
  addPatient: (patient) =>
    set((state) => {
      const newId = `pat-${state.patients.length + 1}`;
      const newPatient = {
        ...patient,
        id: newId,
        lastVisit: new Date().toISOString().split('T')[0]
      };
      return { patients: [newPatient, ...state.patients] };
    }),
  updatePatient: (id, updated) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...updated } : p))
    })),
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id)
    }))
}));
