import { create } from 'zustand';
import { useSuperAdminStore } from './superAdminStore';

// Check local storage for persistent mock session
const getInitialState = () => {
  const saved = localStorage.getItem('hms_auth_session');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        user: parsed,
        isAuthenticated: true,
      };
    } catch {
      // Ignored
    }
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  loginWithCredentials: (email, password) => {
    // 1. Check for Super Admin mock profile
    if (email === 's.jenkins@hms-saas.com' || email === 'admin@hms.com') {
      const superAdminProfile = {
        name: 'Sarah Jenkins',
        email: 's.jenkins@hms-saas.com',
        role: 'super_admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        clinicId: 'all',
      };
      localStorage.setItem('hms_auth_session', JSON.stringify(superAdminProfile));
      set({ user: superAdminProfile, isAuthenticated: true });
      return { success: true, role: 'super_admin' };
    }

    // 2. Scan superAdminStore user directory
    const storeUsers = useSuperAdminStore.getState().users;
    const matchedUser = storeUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (matchedUser.status === 'Pending Approval') {
      return { success: false, error: 'Account pending approval by Super Admin' };
    }

    const clinicId = matchedUser.clinicId || 'clinic-1';
    const profile = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role, // e.g. clinic_owner, dentist, etc.
      avatarUrl: matchedUser.role === 'clinic_owner'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      clinicId,
    };

    localStorage.setItem('hms_auth_session', JSON.stringify(profile));
    set({ user: profile, isAuthenticated: true });
    return { success: true, role: matchedUser.role, clinicId };
  },

  login: (role, clinicId) => {
    const defaultEmails = {
      super_admin: 's.jenkins@hms-saas.com',
      clinic_owner: 'owner@vancedental.com',
      billing_staff: 'billing@vancedental.com',
      dental_assistant: 'assistant@vancedental.com',
      assistant: 'assistant@vancedental.com',
      lab_coordinator: 'lab@vancedental.com',
      patient: 'james@gmail.com'
    };
    const defaultNames = {
      super_admin: 'Sarah Jenkins',
      clinic_owner: 'Dr. Arthur Vance',
      billing_staff: 'Samantha Billing',
      dental_assistant: 'David Miller',
      assistant: 'David Miller',
      lab_coordinator: 'Marcus Vance',
      patient: 'James Carter'
    };
    const profile = {
      name: defaultNames[role] || 'User',
      email: defaultEmails[role] || 'user@hms.com',
      role,
      avatarUrl: role === 'super_admin'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      clinicId,
    };
    localStorage.setItem('hms_auth_session', JSON.stringify(profile));
    set({ user: profile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('hms_auth_session');
    set({ user: null, isAuthenticated: false });
  },
}));
