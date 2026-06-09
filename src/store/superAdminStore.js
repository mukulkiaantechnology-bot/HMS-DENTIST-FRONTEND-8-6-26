import { create } from 'zustand';

const INITIAL_CLINICS = [
  {
    id: 'clinic-1',
    name: 'Metropolitan Dental Care',
    location: 'Downtown Seattle, WA',
    phone: '(206) 555-0192',
    status: 'Active',
    plan: 'Enterprise',
    monthlyFee: 499.0,
    patients: 1240,
    revenue: 24500,
    performanceScore: 94,
    aiModules: { diagnostic: true, recallSMS: true, workload: true }
  },
  {
    id: 'clinic-2',
    name: 'Apex Orthodontics & Pediatrics',
    location: 'Bellevue, WA',
    phone: '(425) 555-0143',
    status: 'Active',
    plan: 'Premium',
    monthlyFee: 299.0,
    patients: 860,
    revenue: 16200,
    performanceScore: 89,
    aiModules: { diagnostic: true, recallSMS: true, workload: false }
  },
  {
    id: 'clinic-3',
    name: 'Northside Family Dentistry',
    location: 'Everett, WA',
    phone: '(425) 555-0187',
    status: 'Active',
    plan: 'Basic',
    monthlyFee: 149.0,
    patients: 450,
    revenue: 8400,
    performanceScore: 81,
    aiModules: { diagnostic: false, recallSMS: false, workload: false }
  },
  {
    id: 'clinic-4',
    name: 'Westside Pediatric Dental',
    location: 'Tacoma, WA',
    phone: '(253) 555-0210',
    status: 'Trialing',
    plan: 'Trial',
    monthlyFee: 0.0,
    patients: 120,
    revenue: 0,
    performanceScore: 78,
    aiModules: { diagnostic: true, recallSMS: false, workload: false }
  }
];

const INITIAL_USERS = [
  { id: 'usr-1', name: 'Dr. Arthur Vance', role: 'clinic_owner', email: 'owner@vancedental.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' },
  { id: 'usr-2', name: 'Dr. Michael Chen, DDS', role: 'dentist', email: 'dr.chen@vancedental.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' },
  { id: 'usr-3', name: 'Elena Rostova, RDH', role: 'hygienist', email: 'elena.r@vancedental.com', clinicId: 'clinic-2', status: 'Approved', password: 'password123' },
  { id: 'usr-4', name: 'Amara Lopez', role: 'front_desk', email: 'amara.reception@vancedental.com', clinicId: 'clinic-3', status: 'Approved', password: 'password123' },
  { id: 'usr-5', name: 'Dr. Rajesh Sharma', role: 'clinic_owner', email: 'rajesh@sharmadental.com', clinicId: 'clinic-3', status: 'Pending Approval', password: '123' },
  { id: 'usr-6', name: 'Dr. Jane Miller', role: 'clinic_owner', email: 'jane.miller@millerdental.com', clinicId: 'clinic-4', status: 'Pending Approval', password: '123' },
  { id: 'usr-7', name: 'Samantha Billing', role: 'billing_staff', email: 'billing@vancedental.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' },
  { id: 'usr-8', name: 'David Miller', role: 'dental_assistant', email: 'assistant@vancedental.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' },
  { id: 'usr-9', name: 'Marcus Vance', role: 'lab_coordinator', email: 'lab@vancedental.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' },
  { id: 'usr-10', name: 'James Carter', role: 'patient', email: 'james@gmail.com', clinicId: 'clinic-1', status: 'Approved', password: 'password123' }
];

const INITIAL_PLANS = [
  { id: 'plan-1', name: 'Basic', fee: 149.00, billingPeriod: 'Monthly', status: 'Active', features: 'Up to 3 staff, Basic Diagnostics, Text Reminders' },
  { id: 'plan-2', name: 'Premium', fee: 299.00, billingPeriod: 'Monthly', status: 'Active', features: 'Up to 10 staff, AI Recall, Full Diagnostics, Custom SMS' },
  { id: 'plan-3', name: 'Enterprise', fee: 499.00, billingPeriod: 'Monthly', status: 'Active', features: 'Unlimited staff, Full AI Suite, Multi-Location Aggregates, 24/7 Priority Support' }
];

const INITIAL_SAAS_INVOICES = [
  { id: 'sinv-101', clinicId: 'clinic-1', clinicName: 'Metropolitan Dental Care', amount: 499.00, issueDate: '2026-06-01', status: 'Paid', plan: 'Enterprise' },
  { id: 'sinv-102', clinicId: 'clinic-2', clinicName: 'Apex Orthodontics & Pediatrics', amount: 299.00, issueDate: '2026-06-01', status: 'Paid', plan: 'Premium' },
  { id: 'sinv-103', clinicId: 'clinic-3', clinicName: 'Northside Family Dentistry', amount: 149.00, issueDate: '2026-06-01', status: 'Unpaid', plan: 'Basic' },
  { id: 'sinv-104', clinicId: 'clinic-4', clinicName: 'Westside Pediatric Dental', amount: 0.00, issueDate: '2026-06-01', status: 'Trial', plan: 'Trial' }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'log-1', timestamp: '2026-06-08 09:12', user: 'Sarah Jenkins', action: 'Upgraded Apex Orthodontics to Premium Plan', clinic: 'Apex Orthodontics & Pediatrics' },
  { id: 'log-2', timestamp: '2026-06-08 08:45', user: 'Sarah Jenkins', action: 'Enabled AI Diagnosis Module for Metropolitan Dental Care', clinic: 'Metropolitan Dental Care' },
  { id: 'log-3', timestamp: '2026-06-07 14:20', user: 'Sarah Jenkins', action: 'Registered new clinic location: Westside Pediatric Dental', clinic: 'Westside Pediatric Dental' },
  { id: 'log-4', timestamp: '2026-06-07 11:05', user: 'Sarah Jenkins', action: 'Suspended legacy clinic location: Eastside Orthodontics', clinic: 'Eastside Orthodontics' }
];

const getTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

export const useSuperAdminStore = create((set) => ({
  clinics: INITIAL_CLINICS,
  users: INITIAL_USERS,
  plans: INITIAL_PLANS,
  saasInvoices: INITIAL_SAAS_INVOICES,
  auditLogs: INITIAL_AUDIT_LOGS,

  // --- CLINICS CRUD ACTIONS ---
  addClinic: (clinicData) =>
    set((state) => {
      const newId = `clinic-${state.clinics.length + 1}`;
      const feeMapping = { Basic: 149.0, Premium: 299.0, Enterprise: 499.0, Trial: 0.0 };
      const newClinic = {
        id: newId,
        name: clinicData.name,
        location: clinicData.location,
        phone: clinicData.phone,
        status: clinicData.status || 'Active',
        plan: clinicData.plan || 'Basic',
        monthlyFee: feeMapping[clinicData.plan] || 149.00,
        patients: clinicData.patients || 0,
        revenue: clinicData.revenue || 0,
        performanceScore: clinicData.performanceScore || 85,
        aiModules: clinicData.aiModules || { diagnostic: false, recallSMS: false, workload: false }
      };

      const actionText = `Registered new clinic location: ${newClinic.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: newClinic.name
      };

      return {
        clinics: [...state.clinics, newClinic],
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updateClinic: (id, updatedData) =>
    set((state) => {
      const feeMapping = { Basic: 149.0, Premium: 299.0, Enterprise: 499.0, Trial: 0.0 };
      const updatedClinics = state.clinics.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          ...updatedData,
          monthlyFee: updatedData.plan ? feeMapping[updatedData.plan] : c.monthlyFee
        };
      });

      const targetClinic = state.clinics.find((c) => c.id === id);
      const actionText = `Updated details for clinic location: ${targetClinic.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetClinic.name
      };

      return {
        clinics: updatedClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  deleteClinic: (id) =>
    set((state) => {
      const targetClinic = state.clinics.find((c) => c.id === id);
      if (!targetClinic) return {};

      const filteredClinics = state.clinics.filter((c) => c.id !== id);
      const actionText = `Removed clinic record: ${targetClinic.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetClinic.name
      };

      return {
        clinics: filteredClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  toggleAiModule: (clinicId, moduleName) =>
    set((state) => {
      const updatedClinics = state.clinics.map((c) => {
        if (c.id !== clinicId) return c;
        const updatedAi = { ...c.aiModules, [moduleName]: !c.aiModules[moduleName] };
        return { ...c, aiModules: updatedAi };
      });

      const targetClinic = state.clinics.find((c) => c.id === clinicId);
      const actionText = `${targetClinic.aiModules[moduleName] ? 'Disabled' : 'Enabled'} AI ${moduleName} module for ${targetClinic.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetClinic.name
      };

      return {
        clinics: updatedClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updateSubscription: (clinicId, plan, status) =>
    set((state) => {
      const feeMapping = { Basic: 149.0, Premium: 299.0, Enterprise: 499.0, Trial: 0.0 };
      const updatedClinics = state.clinics.map((c) => {
        if (c.id !== clinicId) return c;
        return {
          ...c,
          plan,
          status,
          monthlyFee: status === 'Suspended' ? 0.0 : feeMapping[plan] || 0.0
        };
      });

      const targetClinic = state.clinics.find((c) => c.id === clinicId);
      const actionText = `Updated ${targetClinic.name} subscription to plan: ${plan} (${status})`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetClinic.name
      };

      return {
        clinics: updatedClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updateClinicStatus: (clinicId, status) =>
    set((state) => {
      const updatedClinics = state.clinics.map((c) => {
        if (c.id !== clinicId) return c;
        return {
          ...c,
          status,
          monthlyFee: status === 'Suspended' ? 0.0 : c.monthlyFee
        };
      });

      const targetClinic = state.clinics.find((c) => c.id === clinicId);
      const actionText = `Changed ${targetClinic.name} operational status to: ${status}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetClinic.name
      };

      return {
        clinics: updatedClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  // --- USERS CRUD ACTIONS ---
  addUser: (userData) =>
    set((state) => {
      const newId = `usr-${state.users.length + 1}`;
      const newUser = {
        id: newId,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        clinicId: userData.clinicId,
        status: userData.status || 'Approved',
        password: userData.password || '123'
      };

      const targetClinic = state.clinics.find((c) => c.id === userData.clinicId);
      const clinicName = targetClinic ? targetClinic.name : 'Unknown Clinic';
      const actionText = `Registered new platform user: ${newUser.name} as ${newUser.role} for ${clinicName}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: clinicName
      };

      return {
        users: [...state.users, newUser],
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updateUser: (id, updatedData) =>
    set((state) => {
      const updatedUsers = state.users.map((u) => {
        if (u.id !== id) return u;
        return { ...u, ...updatedData };
      });

      const targetUser = state.users.find((u) => u.id === id);
      const targetClinic = state.clinics.find((c) => c.id === updatedData.clinicId || targetUser.clinicId);
      const clinicName = targetClinic ? targetClinic.name : 'Unknown Clinic';
      const actionText = `Modified permissions/details for user: ${targetUser.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: clinicName
      };

      return {
        users: updatedUsers,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  deleteUser: (id) =>
    set((state) => {
      const targetUser = state.users.find((u) => u.id === id);
      if (!targetUser) return {};

      const filteredUsers = state.users.filter((u) => u.id !== id);
      const targetClinic = state.clinics.find((c) => c.id === targetUser.clinicId);
      const clinicName = targetClinic ? targetClinic.name : 'Global';
      const actionText = `Revoked credential keys for user: ${targetUser.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: clinicName
      };

      return {
        users: filteredUsers,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  // --- SAAS BILLING INVOICES CRUD ---
  addSaasInvoice: (invoiceData) =>
    set((state) => {
      const newId = `sinv-${100 + state.saasInvoices.length + 1}`;
      const targetClinic = state.clinics.find((c) => c.id === invoiceData.clinicId);
      const clinicName = targetClinic ? targetClinic.name : 'Unknown Clinic';
      const newInvoice = {
        id: newId,
        clinicId: invoiceData.clinicId,
        clinicName,
        amount: Number(invoiceData.amount) || 0.0,
        issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
        status: invoiceData.status || 'Unpaid',
        plan: targetClinic ? targetClinic.plan : 'Basic'
      };

      const actionText = `Generated SaaS invoice #${newId} for ${clinicName} ($${newInvoice.amount})`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: clinicName
      };

      return {
        saasInvoices: [newInvoice, ...state.saasInvoices],
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updateSaasInvoice: (id, updatedData) =>
    set((state) => {
      const updatedInvoices = state.saasInvoices.map((inv) => {
        if (inv.id !== id) return inv;
        return { ...inv, ...updatedData };
      });

      const targetInvoice = state.saasInvoices.find((inv) => inv.id === id);
      const actionText = `Modified status/details of SaaS invoice #${id} for ${targetInvoice.clinicName}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetInvoice.clinicName
      };

      return {
        saasInvoices: updatedInvoices,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  deleteSaasInvoice: (id) =>
    set((state) => {
      const targetInvoice = state.saasInvoices.find((inv) => inv.id === id);
      if (!targetInvoice) return {};

      const filteredInvoices = state.saasInvoices.filter((inv) => inv.id !== id);
      const actionText = `Deleted SaaS invoice #${id} for ${targetInvoice.clinicName}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: targetInvoice.clinicName
      };

      return {
        saasInvoices: filteredInvoices,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  approveUser: (id) =>
    set((state) => {
      const targetUser = state.users.find((u) => u.id === id);
      if (!targetUser) return {};
      const updatedUsers = state.users.map((u) => {
        if (u.id === id) return { ...u, status: 'Approved' };
        return u;
      });

      // Find the associated clinic and make it Active
      const updatedClinics = state.clinics.map((c) => {
        if (c.id === targetUser.clinicId) {
          return { ...c, status: 'Active' };
        }
        return c;
      });

      const targetClinic = state.clinics.find((c) => c.id === targetUser.clinicId);
      const clinicName = targetClinic ? targetClinic.name : 'Unknown Clinic';
      const actionText = `Approved account for Clinic Owner: ${targetUser.name} (${clinicName})`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: clinicName
      };

      return {
        users: updatedUsers,
        clinics: updatedClinics,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  addPlan: (planData) =>
    set((state) => {
      const newId = `plan-${state.plans.length + 1}`;
      const newPlan = {
        id: newId,
        name: planData.name,
        fee: Number(planData.fee) || 0.0,
        billingPeriod: planData.billingPeriod || 'Monthly',
        status: planData.status || 'Active',
        features: planData.features || ''
      };

      const actionText = `Created new SaaS Pricing Plan: ${newPlan.name} ($${newPlan.fee}/mo)`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: 'System Plans'
      };

      return {
        plans: [...state.plans, newPlan],
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  updatePlan: (id, updatedData) =>
    set((state) => {
      const updatedPlans = state.plans.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...updatedData,
          fee: updatedData.fee !== undefined ? Number(updatedData.fee) : p.fee
        };
      });

      const targetPlan = state.plans.find((p) => p.id === id);
      const actionText = `Updated SaaS Pricing Plan configuration: ${targetPlan.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: 'System Plans'
      };

      return {
        plans: updatedPlans,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }),

  deletePlan: (id) =>
    set((state) => {
      const targetPlan = state.plans.find((p) => p.id === id);
      if (!targetPlan) return {};

      const filteredPlans = state.plans.filter((p) => p.id !== id);
      const actionText = `Deleted SaaS Pricing Plan: ${targetPlan.name}`;
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        user: 'Sarah Jenkins',
        action: actionText,
        clinic: 'System Plans'
      };

      return {
        plans: filteredPlans,
        auditLogs: [newLog, ...state.auditLogs]
      };
    })
}));
