import { create } from 'zustand';

const MOCK_PATIENTS = [
  { id: 'pat-1', name: 'James Carter', age: 45, phone: '(206) 555-1212', email: 'james@gmail.com', status: 'Active', vitals: 'BP: 120/80, Temp: 98.6 F, Pulse: 72 bpm', allergies: 'None', history: 'No systemic diseases. High hygiene compliance. Mild bruxism.' },
  { id: 'pat-2', name: 'Mary Watson', age: 34, phone: '(206) 555-8989', email: 'mary@gmail.com', status: 'Active', vitals: 'BP: 118/75, Temp: 98.2 F, Pulse: 68 bpm', allergies: 'Penicillin', history: 'Prefers local sedation. Mild gingivitis reported in lower mandibular segment.' },
  { id: 'pat-3', name: 'Alex Johnson', age: 29, phone: '(206) 555-4343', email: 'alex.j@gmail.com', status: 'Inactive', vitals: 'BP: 130/85, Temp: 98.9 F, Pulse: 80 bpm', allergies: 'Latex', history: 'Bruxism. Wears custom night guard. History of orthodontic alignment (2022).' }
];

const createDefaultOdontogram = () => {
  const chart = {};
  for (let i = 1; i <= 32; i++) {
    chart[i] = 'Healthy';
  }
  return chart;
};

// Prefill some interesting tooth conditions
const INITIAL_ODONTOGRAMS = {
  'pat-1': {
    ...createDefaultOdontogram(),
    14: 'Cavity',
    19: 'Missing',
    3: 'Crown'
  },
  'pat-2': {
    ...createDefaultOdontogram(),
    19: 'Cavity',
    30: 'Implant'
  },
  'pat-3': {
    ...createDefaultOdontogram(),
    17: 'Missing',
    32: 'Missing'
  }
};

const INITIAL_TREATMENT_PLANS = {
  'pat-1': [
    { id: 'tx-1', tooth: '14', procedure: 'Composite Restoration (Class II)', cost: 180, status: 'Proposed' },
    { id: 'tx-2', tooth: '3', procedure: 'Porcelain Crown Replacement', cost: 1100, status: 'Accepted' }
  ],
  'pat-2': [
    { id: 'tx-3', tooth: '19', procedure: 'Root Canal Therapy & Core Buildup', cost: 1250, status: 'Accepted' },
    { id: 'tx-4', tooth: '19', procedure: 'PFM Crown Placement', cost: 950, status: 'Proposed' }
  ],
  'pat-3': []
};

const INITIAL_XRAYS = {
  'pat-1': [
    { id: 'xr-1', name: 'Bitewing Right.jpg', date: '2026-06-08', notes: 'Visible bone level acceptable. Check distal enamel of #14.', isScanned: false, aiReport: '' }
  ],
  'pat-2': [
    { id: 'xr-2', name: 'Bitewing Left.jpg', date: '2026-06-08', notes: 'Deep caries on #19 approximating pulp chamber.', isScanned: true, aiReport: 'AI Diagnosis: Caries lesion encroaching dental pulp on tooth #19. Recommend pulpotomy/pulpectomy.' }
  ],
  'pat-3': []
};

const INITIAL_PRESCRIPTIONS = {
  'pat-1': [
    { id: 'rx-1', drug: 'Chlorhexidine 0.12% Oral Rinse', dosage: '15 ml', frequency: 'Twice daily after brushing', duration: '14 days', date: '2026-06-08' }
  ],
  'pat-2': [
    { id: 'rx-2', drug: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Three times daily', duration: '7 days', date: '2026-06-08' },
    { id: 'rx-3', drug: 'Ibuprofen 600mg', dosage: '1 tablet', frequency: 'Every 6 hours as needed for discomfort', duration: '5 days', date: '2026-06-08' }
  ],
  'pat-3': []
};

const INITIAL_NOTES = {
  'pat-1': 'Patient James Carter presented today for standard comprehensive clinical review. Vital signs normal. Charted superficial decay on tooth #14. Recommended composite restoration. Patient accepted night guard audit.',
  'pat-2': 'Patient Mary Watson reported severe pain on cold/chewing in lower left quadrant. Diagnostic examination reveals deep disto-occlusal decay on tooth #19 with apical tenderness. Recommended RCT and Crown. Initiated pulpal access under lidocaine block today.',
  'pat-3': 'Patient Alex Johnson checked for night guard audit. Occlusal wear present. Advised continuing night wear. Dental charting healthy except missing wisdom teeth (#17, #32).'
};

export const useDentistStore = create((set) => ({
  patients: MOCK_PATIENTS,
  activePatientId: 'pat-1', // Default to James Carter
  odontograms: INITIAL_ODONTOGRAMS,
  treatmentPlans: INITIAL_TREATMENT_PLANS,
  xrays: INITIAL_XRAYS,
  prescriptions: INITIAL_PRESCRIPTIONS,
  notes: INITIAL_NOTES,

  // Set active patient session context
  setActivePatientId: (id) => set({ activePatientId: id }),

  // Charting Actions
  updateToothCondition: (patientId, toothNum, condition) =>
    set((state) => {
      const patientChart = state.odontograms[patientId] || createDefaultOdontogram();
      return {
        odontograms: {
          ...state.odontograms,
          [patientId]: {
            ...patientChart,
            [toothNum]: condition
          }
        }
      };
    }),

  // Treatment Plan Actions
  addProcedure: (patientId, proc) =>
    set((state) => {
      const patientProcs = state.treatmentPlans[patientId] || [];
      const newId = `tx-${Date.now()}`;
      const newProc = { id: newId, status: 'Proposed', ...proc, cost: Number(proc.cost) || 0 };
      return {
        treatmentPlans: {
          ...state.treatmentPlans,
          [patientId]: [...patientProcs, newProc]
        }
      };
    }),

  updateProcedureStatus: (patientId, procId, status) =>
    set((state) => {
      const patientProcs = state.treatmentPlans[patientId] || [];
      return {
        treatmentPlans: {
          ...state.treatmentPlans,
          [patientId]: patientProcs.map((p) => (p.id === procId ? { ...p, status } : p))
        }
      };
    }),

  deleteProcedure: (patientId, procId) =>
    set((state) => {
      const patientProcs = state.treatmentPlans[patientId] || [];
      return {
        treatmentPlans: {
          ...state.treatmentPlans,
          [patientId]: patientProcs.filter((p) => p.id !== procId)
        }
      };
    }),

  // X-Rays Actions
  addXray: (patientId, xrayFile) =>
    set((state) => {
      const patientXrays = state.xrays[patientId] || [];
      const newXray = {
        id: `xr-${Date.now()}`,
        name: xrayFile.name || 'radiograph_upload.jpg',
        date: new Date().toISOString().split('T')[0],
        notes: xrayFile.notes || 'Manually uploaded radiograph file.',
        isScanned: false,
        aiReport: ''
      };
      return {
        xrays: {
          ...state.xrays,
          [patientId]: [...patientXrays, newXray]
        }
      };
    }),

  updateXrayAIResult: (patientId, xrayId, aiReport) =>
    set((state) => {
      const patientXrays = state.xrays[patientId] || [];
      return {
        xrays: {
          ...state.xrays,
          [patientId]: patientXrays.map((x) =>
            x.id === xrayId ? { ...x, isScanned: true, aiReport } : x
          )
        }
      };
    }),

  // Prescriptions Actions
  addPrescription: (patientId, rx) =>
    set((state) => {
      const patientRxs = state.prescriptions[patientId] || [];
      const newRx = {
        id: `rx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...rx
      };
      return {
        prescriptions: {
          ...state.prescriptions,
          [patientId]: [...patientRxs, newRx]
        }
      };
    }),

  deletePrescription: (patientId, rxId) =>
    set((state) => {
      const patientRxs = state.prescriptions[patientId] || [];
      return {
        prescriptions: {
          ...state.prescriptions,
          [patientId]: patientRxs.filter((r) => r.id !== rxId)
        }
      };
    }),

  // Notes Actions
  saveClinicalNote: (patientId, text) =>
    set((state) => ({
      notes: {
        ...state.notes,
        [patientId]: text
      }
    }))
}));
