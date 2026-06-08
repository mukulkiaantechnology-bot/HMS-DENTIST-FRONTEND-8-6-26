import { create } from 'zustand';
import { useDentistStore } from './dentistStore';
import { useBillingStore } from './billingStore';

const INITIAL_LAB_CASES = [
  {
    id: 'case-1001',
    patientId: 'pat-1',
    patientName: 'James Carter',
    dentistName: 'Dr. Michael Chen',
    type: 'Crown',
    status: 'Created',
    expectedDelivery: '2026-06-12',
    cost: 250.00,
    notes: 'Fabricate porcelain fused to metal (PFM) crown for tooth #14. High occlusion clearance requested.',
    attachments: ['bite_scan_14.jpg', 'xray_mol_left.png'],
    labName: 'Pacific Dental Lab'
  },
  {
    id: 'case-1002',
    patientId: 'pat-2',
    patientName: 'Mary Watson',
    dentistName: 'Dr. Michael Chen',
    type: 'Implant',
    status: 'In Progress',
    expectedDelivery: '2026-06-20',
    cost: 850.00,
    notes: 'Implant custom abutment and zirconia crown for tooth #19. Shade A3.5.',
    attachments: ['cbct_implant_19.dcm', 'intraoral_scan.jpg'],
    labName: 'Elite Biotech Lab'
  },
  {
    id: 'case-1003',
    patientId: 'pat-3',
    patientName: 'Alex Johnson',
    dentistName: 'Dr. Michael Chen',
    type: 'Bridge',
    status: 'Delivered',
    expectedDelivery: '2026-06-05',
    cost: 1100.00,
    notes: '3-unit ceramic bridge replacing tooth #18, anchored on #17 and #19. Shade A1.',
    attachments: ['bridge_scan_3unit.jpg'],
    labName: 'Pacific Dental Lab'
  }
];

const INITIAL_CROWN_CASES = [
  {
    caseId: 'case-1001',
    toothNumber: '14',
    material: 'Ceramic',
    shade: 'A2',
    notes: 'Dento-facial analysis suggests warm tone.'
  }
];

const INITIAL_IMPLANT_CASES = [
  {
    caseId: 'case-1002',
    stage: 'Manufacturing',
    planningNotes: 'Custom abutment with 15-degree angulation.',
    dimensions: 'Platform: 4.5mm, Length: 10.0mm',
    surgicalNotes: 'Good bone density. Surgical guide ready.'
  }
];

export const useLabStore = create((set, get) => ({
  labCases: INITIAL_LAB_CASES,
  crownCases: INITIAL_CROWN_CASES,
  implantCases: INITIAL_IMPLANT_CASES,
  activeCaseId: 'case-1001',

  setActiveCaseId: (id) => set({ activeCaseId: id }),

  // Create Lab Case
  createLabCase: (caseData) => {
    const newId = `case-${1000 + get().labCases.length + 1}`;
    const newCase = {
      id: newId,
      patientId: caseData.patientId || 'pat-1',
      patientName: caseData.patientName || 'James Carter',
      dentistName: caseData.dentistName || 'Dr. Michael Chen',
      type: caseData.type || 'Crown',
      status: 'Created',
      expectedDelivery: caseData.expectedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cost: Number(caseData.cost) || 150.00,
      notes: caseData.notes || '',
      attachments: caseData.attachments || [],
      labName: caseData.labName || 'Pending Assignment'
    };

    set((state) => {
      const nextCases = [newCase, ...state.labCases];
      
      // Seed default details if type is Crown/Implant
      const nextCrowns = [...state.crownCases];
      if (newCase.type === 'Crown') {
        nextCrowns.push({
          caseId: newId,
          toothNumber: caseData.toothNumber || '8',
          material: caseData.material || 'Ceramic',
          shade: caseData.shade || 'A1',
          notes: ''
        });
      }

      const nextImplants = [...state.implantCases];
      if (newCase.type === 'Implant') {
        nextImplants.push({
          caseId: newId,
          stage: 'Planning',
          planningNotes: '',
          dimensions: 'Platform: 4.0mm, Length: 10.0mm',
          surgicalNotes: ''
        });
      }

      return {
        labCases: nextCases,
        crownCases: nextCrowns,
        implantCases: nextImplants,
        activeCaseId: newId
      };
    });

    // Notify dentist of case creation
    const currentNotes = useDentistStore.getState().notes[newCase.patientId] || '';
    const formattedAppend = `\n\n[Lab Case Created - ${new Date().toLocaleDateString()}]\n- Case ID: ${newCase.id}\n- Type: ${newCase.type}\n- Lab: ${newCase.labName}\n- Cost: $${newCase.cost}\n- Expected: ${newCase.expectedDelivery}`;
    useDentistStore.getState().saveClinicalNote(newCase.patientId, currentNotes + formattedAppend);

    return newId;
  },

  // Update Case Status & Sync
  updateCaseStatus: (caseId, status) => {
    set((state) => {
      const updatedCases = state.labCases.map((c) => {
        if (c.id === caseId) {
          const nextCase = { ...c, status };
          
          // Dentist Notification sync
          const currentNotes = useDentistStore.getState().notes[nextCase.patientId] || '';
          const formattedAppend = `\n\n[Lab Status Update - ${new Date().toLocaleDateString()}]\n- Case: ${nextCase.type} (${nextCase.id})\n- New Status: ${status}\n- Lab: ${nextCase.labName}`;
          useDentistStore.getState().saveClinicalNote(nextCase.patientId, currentNotes + formattedAppend);

          // Billing Integration if Delivered
          if (status === 'Delivered') {
            useBillingStore.getState().createInvoice({
              patientId: nextCase.patientId,
              patientName: nextCase.patientName,
              clinicId: 'clinic-1',
              date: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              amount: Number(nextCase.cost) || 0,
              tax: (Number(nextCase.cost) || 0) * 0.05,
              discount: 0,
              status: 'Unpaid',
              items: [
                { description: `Lab Fees - ${nextCase.type} Fabrication (${nextCase.labName})`, cost: Number(nextCase.cost) || 0 }
              ]
            });
          }

          return nextCase;
        }
        return c;
      });
      return { labCases: updatedCases };
    });
  },

  // Assign to external Lab
  assignToLab: (caseId, labName, expectedDelivery) => {
    set((state) => {
      const updated = state.labCases.map((c) => {
        if (c.id === caseId) {
          const next = { ...c, labName, expectedDelivery, status: 'Sent' };
          
          // Sync to Dentist EHR
          const currentNotes = useDentistStore.getState().notes[next.patientId] || '';
          const formattedAppend = `\n\n[Lab Dispatch - ${new Date().toLocaleDateString()}]\n- Case ID: ${next.id}\n- Dispatched to: ${labName}\n- Est. Delivery: ${expectedDelivery}`;
          useDentistStore.getState().saveClinicalNote(next.patientId, currentNotes + formattedAppend);

          return next;
        }
        return c;
      });
      return { labCases: updated };
    });
  },

  // Update Crown Details
  updateCrownTracking: (caseId, crownInfo) => {
    set((state) => {
      const exists = state.crownCases.some((c) => c.caseId === caseId);
      let nextCrowns = [];
      if (exists) {
        nextCrowns = state.crownCases.map((c) => (c.caseId === caseId ? { ...c, ...crownInfo } : c));
      } else {
        nextCrowns = [...state.crownCases, { caseId, ...crownInfo }];
      }
      return { crownCases: nextCrowns };
    });
  },

  // Update Implant Stage Tracking
  updateImplantStage: (caseId, implantInfo) => {
    set((state) => {
      const exists = state.implantCases.some((i) => i.caseId === caseId);
      let nextImplants = [];
      if (exists) {
        nextImplants = state.implantCases.map((i) => (i.caseId === caseId ? { ...i, ...implantInfo } : i));
      } else {
        nextImplants = [...state.implantCases, { caseId, ...implantInfo }];
      }

      // If implant stage updates to 'Ready' or 'Delivered', keep in sync with case status
      const relatedCase = state.labCases.find((c) => c.id === caseId);
      if (relatedCase && implantInfo.stage) {
        let matchingStatus = relatedCase.status;
        if (implantInfo.stage === 'Ready') matchingStatus = 'Ready';
        if (implantInfo.stage === 'Delivered') matchingStatus = 'Delivered';
        
        if (matchingStatus !== relatedCase.status) {
          setTimeout(() => {
            get().updateCaseStatus(caseId, matchingStatus);
          }, 0);
        }
      }

      return { implantCases: nextImplants };
    });
  },

  // Mark Delivery Completed
  markDelivered: (caseId) => {
    get().updateCaseStatus(caseId, 'Delivered');
    
    // Sync implant stage if it is an implant case
    const isImplant = get().implantCases.some((i) => i.caseId === caseId);
    if (isImplant) {
      get().updateImplantStage(caseId, { stage: 'Delivered' });
    }
  }
}));
