import { create } from 'zustand';
import { useDentistStore } from './dentistStore';

const INITIAL_TODAY_PATIENTS = [
  { id: 'pat-1', name: 'James Carter', age: 45, dentistName: 'Dr. Michael Chen', treatmentType: 'Teeth Cleaning', status: 'Waiting' },
  { id: 'pat-2', name: 'Mary Watson', age: 34, dentistName: 'Dr. Michael Chen', treatmentType: 'Root Canal Therapy', status: 'In Treatment' },
  { id: 'pat-3', name: 'Alex Johnson', age: 29, dentistName: 'Dr. Michael Chen', treatmentType: 'Orthodontic Checkup', status: 'Completed' }
];

const DEFAULT_CHAIRSIDE_TASKS = [
  // Sterilization Checklist
  { id: 'ster-1', category: 'Sterilization', text: 'Sanitize and prep treatment chair', completed: false },
  { id: 'ster-2', category: 'Sterilization', text: 'Autoclave dental mirrors and explorers', completed: false },
  { id: 'ster-3', category: 'Sterilization', text: 'Place protective barriers on handles and switches', completed: false },
  { id: 'ster-4', category: 'Sterilization', text: 'Dispose of biohazard waste from previous session', completed: false },
  
  // Instrument Tracking
  { id: 'inst-1', category: 'Instrument', text: 'Confirm high-speed handpiece is clean and tracked', completed: false },
  { id: 'inst-2', category: 'Instrument', text: 'Set up high-volume evacuator (suction) tips', completed: false },
  { id: 'inst-3', category: 'Instrument', text: 'Lay out composite restorative materials and curing light', completed: false },
  { id: 'inst-4', category: 'Instrument', text: 'Prepare articulating paper and polishing burs', completed: false },

  // Stage Checklist
  { id: 'stage-1', category: 'Stage', text: 'Review patient medical history & vitals', completed: false },
  { id: 'stage-2', category: 'Stage', text: 'Assist dentist during procedure', completed: false },
  { id: 'stage-3', category: 'Stage', text: 'Review post-op care instructions with patient', completed: false }
];

const INITIAL_CHAIRSIDE = {
  'pat-1': [...DEFAULT_CHAIRSIDE_TASKS],
  'pat-2': DEFAULT_CHAIRSIDE_TASKS.map(t => t.id === 'ster-1' || t.id === 'ster-2' || t.id === 'stage-1' ? { ...t, completed: true } : t),
  'pat-3': DEFAULT_CHAIRSIDE_TASKS.map(t => ({ ...t, completed: true }))
};

const INITIAL_XRAYS = [
  { id: 'xr-101', patientId: 'pat-1', type: 'Bitewing', name: 'bitewing_molar_left.jpg', date: '2026-06-08', notes: 'Check distal enamel decay on #14.' },
  { id: 'xr-102', patientId: 'pat-2', type: 'Panoramic', name: 'panoramic_full_review.jpg', date: '2026-06-08', notes: 'Deep caries encroaching dental pulp on #19.' }
];

const INITIAL_NOTES = {
  'pat-1': [],
  'pat-2': [
    { id: 'note-1', date: '2026-06-08', dentistName: 'Dr. Michael Chen', procedureType: 'Root Canal Therapy', observations: 'Patient is comfortable under local anesthesia. High volume suction maintained.', actions: ['Sterilization completed', 'Instruments prepped'] }
  ],
  'pat-3': []
};

export const useDentalAssistantStore = create((set) => ({
  todayPatients: INITIAL_TODAY_PATIENTS,
  activePatientId: 'pat-1',
  xrayUploads: INITIAL_XRAYS,
  chairsideTasks: INITIAL_CHAIRSIDE,
  clinicalNotes: INITIAL_NOTES,

  // Set active patient session context
  setActivePatientId: (id) => set({ activePatientId: id }),

  // Update Patient Status
  updatePatientStatus: (patientId, status) =>
    set((state) => ({
      todayPatients: state.todayPatients.map((p) =>
        p.id === patientId ? { ...p, status } : p
      )
    })),

  // Toggle Task Status
  toggleTaskStatus: (patientId, taskId) =>
    set((state) => {
      const patientTasks = state.chairsideTasks[patientId] || [...DEFAULT_CHAIRSIDE_TASKS];
      return {
        chairsideTasks: {
          ...state.chairsideTasks,
          [patientId]: patientTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        }
      };
    }),

  // Upload X-Ray and Sync to Dentist
  uploadXray: (patientId, xrayInfo) => {
    const newId = `xr-${Date.now()}`;
    const newXray = {
      id: newId,
      patientId,
      type: xrayInfo.type,
      name: xrayInfo.name || 'radiograph_upload.jpg',
      date: new Date().toISOString().split('T')[0],
      notes: xrayInfo.notes || ''
    };

    // 1. Sync to local state
    set((state) => ({
      xrayUploads: [newXray, ...state.xrayUploads]
    }));

    // 2. Sync to useDentistStore to make it available to the Dentist
    useDentistStore.getState().addXray(patientId, {
      name: `[${xrayInfo.type}] ${xrayInfo.name}`,
      notes: `[Assistant Upload] ${xrayInfo.notes}`
    });
  },

  // Save Assistant Clinical Note and Sync to Dentist EHR Notes
  saveAssistantNote: (patientId, noteData) => {
    const newId = `note-${Date.now()}`;
    const newNote = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      dentistName: noteData.dentistName || 'Dr. Michael Chen',
      procedureType: noteData.procedureType || 'General Treatment',
      observations: noteData.observations || '',
      actions: noteData.actions || []
    };

    // 1. Sync to local state
    set((state) => {
      const patientNotes = state.clinicalNotes[patientId] || [];
      return {
        clinicalNotes: {
          ...state.clinicalNotes,
          [patientId]: [newNote, ...patientNotes]
        }
      };
    });

    // 2. Sync and append to useDentistStore's notes
    const currentDentistNotes = useDentistStore.getState().notes[patientId] || '';
    const formattedAppend = `\n\n[Assistant Chairside Note - ${new Date().toLocaleDateString()}]\n- Dentist: ${newNote.dentistName}\n- Procedure: ${newNote.procedureType}\n- Observations: ${newNote.observations}\n- Actions Taken: ${newNote.actions.join(', ')}`;
    useDentistStore.getState().saveClinicalNote(patientId, currentDentistNotes + formattedAppend);
  }
}));
