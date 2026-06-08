import { create } from 'zustand';

export const MOCK_CLINICS = [
  { id: 'clinic-1', name: 'Metropolitan Dental Care', location: 'Downtown Seattle, WA', phone: '(206) 555-0192', status: 'active' },
  { id: 'clinic-2', name: 'Apex Orthodontics & Pediatrics', location: 'Bellevue, WA', phone: '(425) 555-0143', status: 'active' },
  { id: 'clinic-3', name: 'Northside Family Dentistry', location: 'Everett, WA', phone: '(425) 555-0187', status: 'active' }
];

export const useClinicStore = create((set, get) => ({
  clinics: MOCK_CLINICS,
  selectedClinicId: 'clinic-1',
  setSelectedClinicId: (id) => set({ selectedClinicId: id }),
  getClinicName: (id) => {
    if (id === 'all') return 'All Clinics (Global)';
    const clinic = get().clinics.find((c) => c.id === id);
    return clinic ? clinic.name : 'Unknown Clinic';
  }
}));
