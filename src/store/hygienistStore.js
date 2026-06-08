import { create } from 'zustand';

const MOCK_PATIENTS = [
  { id: 'pat-1', name: 'James Carter', age: 45, phone: '(206) 555-1212', email: 'james@gmail.com', status: 'Active', vitals: 'BP: 120/80, Temp: 98.6 F, Pulse: 72 bpm', allergies: 'None', history: 'No systemic diseases. High hygiene compliance. Mild bruxism.' },
  { id: 'pat-2', name: 'Mary Watson', age: 34, phone: '(206) 555-8989', email: 'mary@gmail.com', status: 'Active', vitals: 'BP: 118/75, Temp: 98.2 F, Pulse: 68 bpm', allergies: 'Penicillin', history: 'Prefers local sedation. Mild gingivitis reported in lower mandibular segment.' },
  { id: 'pat-3', name: 'Alex Johnson', age: 29, phone: '(206) 555-4343', email: 'alex.j@gmail.com', status: 'Inactive', vitals: 'BP: 130/85, Temp: 98.9 F, Pulse: 80 bpm', allergies: 'Latex', history: 'Bruxism. Wears custom night guard. History of orthodontic alignment (2022).' },
  { id: 'pat-4', name: 'David Miller', age: 52, phone: '(206) 555-9876', email: 'david@gmail.com', status: 'Active', vitals: 'BP: 135/88, Temp: 98.7 F, Pulse: 78 bpm', allergies: 'Sulfa Drugs', history: 'Former smoker. Heavy staining. History of root plane treatment in 2024.' }
];

const createDefaultPerioChart = () => {
  const chart = {};
  for (let i = 1; i <= 32; i++) {
    chart[i] = { pocketDepth: 3, bleeding: false, mobility: 0 };
  }
  return chart;
};

const INITIAL_PERIO_CHARTS = {
  'pat-1': {
    ...createDefaultPerioChart(),
    3: { pocketDepth: 4, bleeding: true, mobility: 0 },
    14: { pocketDepth: 3, bleeding: false, mobility: 0 },
    19: { pocketDepth: 4, bleeding: true, mobility: 1 }
  },
  'pat-2': {
    ...createDefaultPerioChart(),
    2: { pocketDepth: 5, bleeding: true, mobility: 1 },
    18: { pocketDepth: 6, bleeding: true, mobility: 2 },
    19: { pocketDepth: 7, bleeding: true, mobility: 2 },
    20: { pocketDepth: 5, bleeding: true, mobility: 1 },
    30: { pocketDepth: 5, bleeding: true, mobility: 1 }
  },
  'pat-3': createDefaultPerioChart(),
  'pat-4': {
    ...createDefaultPerioChart(),
    14: { pocketDepth: 5, bleeding: true, mobility: 1 },
    15: { pocketDepth: 4, bleeding: true, mobility: 0 },
    30: { pocketDepth: 6, bleeding: true, mobility: 1 },
    31: { pocketDepth: 5, bleeding: false, mobility: 0 }
  }
};

const INITIAL_RISK_PROFILES = {
  'pat-1': {
    classification: 'Medium',
    lastAssessed: '2026-06-08',
    riskFactors: ['Localized 4mm pockets', 'Bleeding on 2 posterior sites', 'Mild bruxism'],
    aiAdvice: 'Provide localized oral hygiene tips for molar areas. Standard prophy cleaning every 6 months is recommended.'
  },
  'pat-2': {
    classification: 'High',
    lastAssessed: '2026-06-08',
    riskFactors: ['Generalized periodontitis', 'Deep pockets up to 7mm', 'Bleeding on 80% of sites probed', 'Class 2 mobility on molars'],
    aiAdvice: 'Urgent Periodontal Therapy required. Schedule Scaling & Root Planing (SRP) for Lower Left quadrant. Irrigate with Chlorhexidine. Refer to Periodontist.'
  },
  'pat-3': {
    classification: 'Low',
    lastAssessed: '2026-06-08',
    riskFactors: ['Excellent plaque control', 'No pockets > 3mm', 'No bleeding on probing'],
    aiAdvice: 'Maintain standard preventive prophylaxis every 6 months. Continue excellent oral hygiene routine.'
  },
  'pat-4': {
    classification: 'High',
    lastAssessed: '2026-06-08',
    riskFactors: ['Former smoker', 'Pockets up to 6mm', 'Calculus deposits on lower anteriors', 'Active bleeding on molar regions'],
    aiAdvice: 'Recommend Perio Maintenance cleaning every 3-4 months. Recommend electric toothbrush use and daily interdental flossing.'
  }
};

const INITIAL_RECALLS = [
  { id: 'rec-1', patientId: 'pat-1', patientName: 'James Carter', lastVisit: '2025-12-08', dueBy: '2026-06-08', status: 'Due', phone: '(206) 555-1212', email: 'james@gmail.com', frequency: '6 Months' },
  { id: 'rec-2', patientId: 'pat-2', patientName: 'Mary Watson', lastVisit: '2026-02-15', dueBy: '2026-05-15', status: 'Due', phone: '(206) 555-8989', email: 'mary@gmail.com', frequency: '3 Months' },
  { id: 'rec-3', patientId: 'pat-3', patientName: 'Alex Johnson', lastVisit: '2026-03-10', dueBy: '2026-09-10', status: 'Scheduled', phone: '(206) 555-4343', email: 'alex.j@gmail.com', frequency: '6 Months' },
  { id: 'rec-4', patientId: 'pat-4', patientName: 'David Miller', lastVisit: '2025-11-20', dueBy: '2026-05-20', status: 'Due', phone: '(206) 555-9876', email: 'david@gmail.com', frequency: '6 Months' }
];

const INITIAL_NOTES = {
  'pat-1': 'Pre-procedural chlorhexidine rinse administered. Conducted localized perio probing. Pockets stable at 3-4mm in posterior. Completed scaling and polishing with fine prophy paste. Flossed. Pt advised on interproximal cleaning.',
  'pat-2': 'Severe plaque accumulation on molar regions. Severe bleeding on probing. Deep pocketing up to 7mm on #19. Localized root plane of LL quadrant needed. Advised patient on periodontal disease progress. Patient scheduled for SRP.',
  'pat-3': 'Regular 6-month cleaning. Excellent hygiene compliance. Very minimal plaque. Scaled, polished, flossed, and fluoride treatment applied. Encouraged patient to continue current flossing habit.',
  'pat-4': 'Frequent coffee stains. Scaling completed using ultrasonic device. Heavily localized scaling on lingual surfaces of lower anteriors. Encouraged patient to brush distal of #15, #31. Periodic evaluation scheduled.'
};

export const useHygienistStore = create((set) => ({
  patients: MOCK_PATIENTS,
  activePatientId: 'pat-1',
  perioCharts: INITIAL_PERIO_CHARTS,
  riskProfiles: INITIAL_RISK_PROFILES,
  recalls: INITIAL_RECALLS,
  notes: INITIAL_NOTES,

  setActivePatientId: (id) => set({ activePatientId: id }),

  updateToothPerio: (patientId, toothNum, metrics) =>
    set((state) => {
      const patientChart = state.perioCharts[patientId] || createDefaultPerioChart();
      return {
        perioCharts: {
          ...state.perioCharts,
          [patientId]: {
            ...patientChart,
            [toothNum]: {
              ...patientChart[toothNum],
              ...metrics
            }
          }
        }
      };
    }),

  updateRiskAssessed: (patientId, classification, riskFactors, aiAdvice) =>
    set((state) => ({
      riskProfiles: {
        ...state.riskProfiles,
        [patientId]: {
          classification,
          lastAssessed: new Date().toISOString().split('T')[0],
          riskFactors,
          aiAdvice
        }
      }
    })),

  triggerRecallReminder: (recallId) =>
    set((state) => ({
      recalls: state.recalls.map((r) =>
        r.id === recallId ? { ...r, status: 'Reminded' } : r
      )
    })),

  autoScheduleRecall: (recallId, date) =>
    set((state) => ({
      recalls: state.recalls.map((r) =>
        r.id === recallId ? { ...r, status: 'Scheduled', dueBy: date } : r
      )
    })),

  saveClinicalNote: (patientId, text) =>
    set((state) => ({
      notes: {
        ...state.notes,
        [patientId]: text
      }
    }))
}));
