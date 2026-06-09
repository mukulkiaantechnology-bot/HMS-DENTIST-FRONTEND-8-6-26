import { create } from 'zustand';

const getTodayDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Alice Henderson',
    dentistName: 'Dr. Michael Chen, DDS',
    hygienistName: 'Elena Rostova, RDH',
    clinicId: 'clinic-1',
    date: getTodayDateString(0),
    time: '09:00',
    duration: 60,
    status: 'Checked-In',
    type: 'Cleaning',
    notes: 'Routine 6-month cleaning and exam'
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    patientName: 'Robert Vance',
    dentistName: 'Dr. Michael Chen, DDS',
    clinicId: 'clinic-1',
    date: getTodayDateString(0),
    time: '11:00',
    duration: 90,
    status: 'Scheduled',
    type: 'Root Canal',
    notes: 'Tooth #14 root canal procedure'
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    patientName: 'Chloe Sinclair',
    dentistName: 'Dr. Michael Chen, DDS',
    hygienistName: 'Elena Rostova, RDH',
    clinicId: 'clinic-2',
    date: getTodayDateString(0),
    time: '10:30',
    duration: 45,
    status: 'Completed',
    type: 'Consultation',
    notes: 'Invisalign assessment'
  },
  {
    id: 'apt-4',
    patientId: 'pat-4',
    patientName: 'Ethan Hunt',
    dentistName: 'Dr. Michael Chen, DDS',
    clinicId: 'clinic-2',
    date: getTodayDateString(1),
    time: '14:00',
    duration: 45,
    status: 'Scheduled',
    type: 'Filling',
    notes: 'Two composite fillings on upper right premolars'
  },
  {
    id: 'apt-5',
    patientId: 'pat-5',
    patientName: 'Samantha Collins',
    dentistName: 'Dr. Michael Chen, DDS',
    hygienistName: 'Elena Rostova, RDH',
    clinicId: 'clinic-3',
    date: getTodayDateString(1),
    time: '09:30',
    duration: 60,
    status: 'Scheduled',
    type: 'Cleaning',
    notes: 'Perio maintenance visit'
  },
  {
    id: 'apt-6',
    patientId: 'pat-1',
    patientName: 'James Carter',
    dentistName: 'Dr. Michael Chen, DDS',
    clinicId: 'clinic-1',
    date: getTodayDateString(2),
    time: '10:00',
    duration: 45,
    status: 'Scheduled',
    type: 'Teeth Cleaning',
    notes: 'Routine hygiene checkup'
  },
  {
    id: 'apt-7',
    patientId: 'pat-2',
    patientName: 'Mary Watson',
    dentistName: 'Dr. Michael Chen, DDS',
    clinicId: 'clinic-1',
    date: getTodayDateString(3),
    time: '14:30',
    duration: 60,
    status: 'Scheduled',
    type: 'Crown Prep',
    notes: 'Preparations for tooth #19 restoration'
  }
];

export const useAppointmentStore = create((set) => ({
  appointments: INITIAL_APPOINTMENTS,
  addAppointment: (appt) =>
    set((state) => {
      const newId = `apt-${state.appointments.length + 1}`;
      const newAppointment = {
        ...appt,
        id: newId
      };
      return { appointments: [...state.appointments, newAppointment] };
    }),
  updateAppointment: (id, updated) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updated } : a))
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id)
    }))
}));
