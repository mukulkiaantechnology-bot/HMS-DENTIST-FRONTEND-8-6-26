import { create } from 'zustand';

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const INITIAL_INVOICES = [
  {
    id: 'inv-1001',
    patientId: 'pat-1',
    patientName: 'Alice Henderson',
    clinicId: 'clinic-1',
    date: '2026-05-14',
    dueDate: '2026-05-28',
    amount: 180.0,
    tax: 9.0,
    discount: 0.0,
    insurancePaid: 120.0,
    patientPaid: 60.0,
    status: 'Paid',
    items: [
      { description: 'Comprehensive Exam', cost: 80.0 },
      { description: 'Prophylaxis - Adult Cleaning', cost: 100.0 }
    ]
  },
  {
    id: 'inv-1002',
    patientId: 'pat-2',
    patientName: 'Robert Vance',
    clinicId: 'clinic-1',
    date: '2026-05-20',
    dueDate: '2026-06-03',
    amount: 1200.0,
    tax: 60.0,
    discount: 0.0,
    insurancePaid: 800.0,
    patientPaid: 100.0,
    status: 'Partial',
    items: [
      { description: 'Root Canal - Molar', cost: 950.0 },
      { description: 'Core Buildup', cost: 250.0 }
    ]
  },
  {
    id: 'inv-1003',
    patientId: 'pat-3',
    patientName: 'Chloe Sinclair',
    clinicId: 'clinic-2',
    date: '2026-06-01',
    dueDate: '2026-06-15',
    amount: 3500.0,
    tax: 175.0,
    discount: 200.0,
    insurancePaid: 1500.0,
    patientPaid: 0.0,
    status: 'Unpaid',
    items: [
      { description: 'Invisalign Treatment Tier 1', cost: 3500.0 }
    ]
  },
  {
    id: 'inv-1004',
    patientId: 'pat-5',
    patientName: 'Samantha Collins',
    clinicId: 'clinic-3',
    date: '2026-04-15',
    dueDate: '2026-04-29',
    amount: 450.0,
    tax: 22.5,
    discount: 0.0,
    insurancePaid: 0.0,
    patientPaid: 0.0,
    status: 'Overdue',
    items: [
      { description: 'Night Guard Custom', cost: 450.0 }
    ]
  },
  {
    id: 'inv-1005',
    patientId: 'pat-4',
    patientName: 'Ethan Hunt',
    clinicId: 'clinic-2',
    date: '2026-06-05',
    dueDate: '2026-06-19',
    amount: 680.0,
    tax: 34.0,
    discount: 50.0,
    insurancePaid: 400.0,
    patientPaid: 0.0,
    status: 'Unpaid',
    items: [
      { description: 'Porcelain Crown Preparation', cost: 480.0 },
      { description: 'Temporary Crown Placement', cost: 200.0 }
    ]
  },
  {
    id: 'inv-1006',
    patientId: 'pat-6',
    patientName: 'Marcus Aurelius',
    clinicId: 'clinic-3',
    date: '2026-06-08',
    dueDate: '2026-06-22',
    amount: 290.0,
    tax: 14.5,
    discount: 0.0,
    insurancePaid: 0.0,
    patientPaid: 290.0,
    status: 'Paid',
    items: [
      { description: 'Teeth Whitening - In-Office', cost: 290.0 }
    ]
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay-001',
    invoiceId: 'inv-1001',
    patientName: 'Alice Henderson',
    amount: 60.0,
    method: 'Card',
    date: '2026-05-14',
    note: 'Patient co-pay at checkout'
  },
  {
    id: 'pay-002',
    invoiceId: 'inv-1001',
    patientName: 'Alice Henderson',
    amount: 120.0,
    method: 'Insurance',
    date: '2026-05-18',
    note: 'Blue Cross Blue Shield reimbursement'
  },
  {
    id: 'pay-003',
    invoiceId: 'inv-1002',
    patientName: 'Robert Vance',
    amount: 100.0,
    method: 'Cash',
    date: '2026-05-20',
    note: 'Partial cash payment at front desk'
  },
  {
    id: 'pay-004',
    invoiceId: 'inv-1002',
    patientName: 'Robert Vance',
    amount: 800.0,
    method: 'Insurance',
    date: '2026-05-26',
    note: 'Aetna insurance partial claim payout'
  },
  {
    id: 'pay-005',
    invoiceId: 'inv-1006',
    patientName: 'Marcus Aurelius',
    amount: 290.0,
    method: 'Card',
    date: '2026-06-08',
    note: 'Full payment by card'
  }
];

const INITIAL_CLAIMS = [
  {
    id: 'clm-001',
    invoiceId: 'inv-1001',
    patientName: 'Alice Henderson',
    carrier: 'Blue Cross Blue Shield',
    claimAmount: 120.0,
    approvedAmount: 120.0,
    submittedDate: '2026-05-14',
    status: 'Approved',
    note: 'Full claim approved for preventive services'
  },
  {
    id: 'clm-002',
    invoiceId: 'inv-1002',
    patientName: 'Robert Vance',
    carrier: 'Aetna',
    claimAmount: 900.0,
    approvedAmount: 800.0,
    submittedDate: '2026-05-20',
    status: 'Approved',
    note: 'Partial approval — deductible applied'
  },
  {
    id: 'clm-003',
    invoiceId: 'inv-1003',
    patientName: 'Chloe Sinclair',
    carrier: 'Cigna',
    claimAmount: 2000.0,
    approvedAmount: 0.0,
    submittedDate: '2026-06-01',
    status: 'Pending',
    note: 'Orthodontic pre-authorization pending'
  },
  {
    id: 'clm-004',
    invoiceId: 'inv-1005',
    patientName: 'Ethan Hunt',
    carrier: 'UnitedHealthcare',
    claimAmount: 480.0,
    approvedAmount: 0.0,
    submittedDate: '2026-06-05',
    status: 'Pending',
    note: 'Crown procedure under review'
  }
];

const INITIAL_STATEMENTS = [
  {
    id: 'stmt-001',
    patientId: 'pat-1',
    patientName: 'Alice Henderson',
    generatedDate: '2026-06-01',
    periodStart: '2026-01-01',
    periodEnd: '2026-06-01',
    totalBilled: 180.0,
    totalPaid: 180.0,
    balance: 0.0
  },
  {
    id: 'stmt-002',
    patientId: 'pat-2',
    patientName: 'Robert Vance',
    generatedDate: '2026-06-01',
    periodStart: '2026-01-01',
    periodEnd: '2026-06-01',
    totalBilled: 1200.0,
    totalPaid: 900.0,
    balance: 300.0
  }
];

// ─── STORE ────────────────────────────────────────────────────────────────────

export const useBillingStore = create((set, get) => ({
  invoices: INITIAL_INVOICES,
  payments: INITIAL_PAYMENTS,
  claims: INITIAL_CLAIMS,
  statements: INITIAL_STATEMENTS,

  // ── INVOICE ACTIONS ──────────────────────────────────────────────────────
  createInvoice: (invoice) =>
    set((state) => {
      const newId = `inv-${1000 + state.invoices.length + 1}`;
      return {
        invoices: [{ ...invoice, id: newId, patientPaid: 0, insurancePaid: 0 }, ...state.invoices]
      };
    }),

  updateInvoice: (id, updates) =>
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    })),

  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id)
    })),

  // Legacy alias used by ClinicOwnerPages
  addInvoice: (invoice) =>
    set((state) => {
      const newId = `inv-${1000 + state.invoices.length + 1}`;
      return {
        invoices: [{ ...invoice, id: newId, patientPaid: invoice.patientPaid || 0, insurancePaid: invoice.insurancePaid || 0 }, ...state.invoices]
      };
    }),

  payInvoice: (id, amount) =>
    set((state) => ({
      invoices: state.invoices.map((inv) => {
        if (inv.id !== id) return inv;
        const newPatientPaid = inv.patientPaid + amount;
        const totalPaid = inv.insurancePaid + newPatientPaid;
        const newStatus =
          totalPaid >= inv.amount ? 'Paid' :
          newPatientPaid === 0 && inv.insurancePaid === 0 ? 'Unpaid' :
          'Partial';
        return { ...inv, patientPaid: newPatientPaid, status: newStatus };
      })
    })),

  // ── PAYMENT ACTIONS ──────────────────────────────────────────────────────
  recordPayment: (payment) =>
    set((state) => {
      const newId = `pay-${String(state.payments.length + 1).padStart(3, '0')}`;
      const newPayment = { ...payment, id: newId, date: payment.date || new Date().toISOString().split('T')[0] };

      // Auto-update linked invoice balance
      const updatedInvoices = state.invoices.map((inv) => {
        if (inv.id !== payment.invoiceId) return inv;
        let newPatientPaid = inv.patientPaid;
        let newInsurancePaid = inv.insurancePaid;
        if (payment.method === 'Insurance') {
          newInsurancePaid += payment.amount;
        } else {
          newPatientPaid += payment.amount;
        }
        const totalPaid = newInsurancePaid + newPatientPaid;
        const newStatus =
          totalPaid >= inv.amount ? 'Paid' :
          totalPaid === 0 ? 'Unpaid' :
          'Partial';
        return { ...inv, patientPaid: newPatientPaid, insurancePaid: newInsurancePaid, status: newStatus };
      });

      return { payments: [newPayment, ...state.payments], invoices: updatedInvoices };
    }),

  deletePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((p) => p.id !== id)
    })),

  // ── CLAIM ACTIONS ────────────────────────────────────────────────────────
  createClaim: (claim) =>
    set((state) => {
      const newId = `clm-${String(state.claims.length + 1).padStart(3, '0')}`;
      return {
        claims: [
          {
            ...claim,
            id: newId,
            approvedAmount: 0,
            submittedDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
          },
          ...state.claims
        ]
      };
    }),

  updateClaimStatus: (id, status, approvedAmount) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === id ? { ...c, status, approvedAmount: approvedAmount ?? c.approvedAmount } : c
      )
    })),

  deleteClaim: (id) =>
    set((state) => ({
      claims: state.claims.filter((c) => c.id !== id)
    })),

  // ── STATEMENT ACTIONS ────────────────────────────────────────────────────
  generateStatement: (patientId, patientName, periodStart, periodEnd) =>
    set((state) => {
      const patInvoices = state.invoices.filter(
        (inv) => inv.patientId === patientId || inv.patientName === patientName
      );
      const totalBilled = patInvoices.reduce((s, inv) => s + inv.amount, 0);
      const totalPaid = patInvoices.reduce((s, inv) => s + inv.patientPaid + inv.insurancePaid, 0);
      const newId = `stmt-${String(state.statements.length + 1).padStart(3, '0')}`;
      const newStatement = {
        id: newId,
        patientId,
        patientName,
        generatedDate: new Date().toISOString().split('T')[0],
        periodStart,
        periodEnd,
        totalBilled,
        totalPaid,
        balance: totalBilled - totalPaid
      };
      return { statements: [newStatement, ...state.statements] };
    }),

  deleteStatement: (id) =>
    set((state) => ({
      statements: state.statements.filter((s) => s.id !== id)
    })),

  // ── COMPUTED HELPERS ─────────────────────────────────────────────────────
  getTodayRevenue: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().payments
      .filter((p) => p.date === today)
      .reduce((s, p) => s + p.amount, 0);
  },

  getMonthRevenue: (month, year) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return get().payments
      .filter((p) => p.date.startsWith(prefix))
      .reduce((s, p) => s + p.amount, 0);
  }
}));
