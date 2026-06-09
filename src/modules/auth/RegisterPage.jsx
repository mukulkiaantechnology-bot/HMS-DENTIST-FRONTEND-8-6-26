import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Building2, User, ArrowLeft, ShieldAlert, CheckCircle2, Users, ShieldCheck } from 'lucide-react';
import { useSuperAdminStore } from '../../store/superAdminStore';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { useToast } from '../../shared/hooks/useToast';

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { clinics, addClinic, addUser } = useSuperAdminStore();

  const [regType, setRegType] = useState('clinic'); // 'clinic' or 'patient'
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clinic admin fields
  const [clinicName, setClinicName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Patient fields
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientAllergies, setPatientAllergies] = useState('');
  const [patientInsurance, setPatientInsurance] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(clinics[0]?.id || 'clinic-1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (regType === 'clinic') {
      if (!clinicName || !location || !ownerName || !ownerEmail || !ownerPassword) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Generate a clinic ID
      const newClinicId = `clinic-${Date.now()}`;
      
      // Add the clinic with trial plan and Pending/Trialing status
      addClinic({
        id: newClinicId,
        name: clinicName,
        location,
        phone,
        plan: 'Trial',
        status: 'Trialing',
        patients: 0,
        revenue: 0,
        performanceScore: 80
      });

      // Add the Clinic Owner user as Pending Approval
      addUser({
        name: ownerName,
        email: ownerEmail,
        role: 'clinic_owner',
        clinicId: newClinicId,
        status: 'Pending Approval',
        password: ownerPassword
      });

      toast.success('Clinic Registration Request Submitted Successfully!');
      setIsSubmitted(true);
    } else {
      if (!patientName || !patientEmail || !patientPassword || !patientPhone) {
        toast.error('Please fill in all required fields (Name, Phone, Email, Password)');
        return;
      }

      // Patient registration simulation
      toast.success(`Successfully registered patient ${patientName}!`);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#090d16] px-4 py-10 transition-colors duration-300 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-25 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className={`relative w-full ${regType === 'patient' ? 'max-w-2xl' : 'max-w-lg'} transition-all duration-300 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-xl z-10 animate-fade-in text-center`}>
        {/* Back Arrow */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Landing Page
        </button>

        {/* Brand */}
        <div className="flex justify-center mb-6 mt-8 sm:mt-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-md">
            <Activity className="h-7 w-7" />
          </div>
        </div>

        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Account</h1>
            <p className="text-xs text-muted-foreground mt-2 font-semibold">
              Select account type to register in the sandboxed network.
            </p>

            {/* Registration Type Toggles */}
            <div className="flex flex-col sm:flex-row bg-muted p-1 rounded-xl mt-6 mb-6 gap-1">
              <button
                type="button"
                onClick={() => setRegType('clinic')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  regType === 'clinic'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="h-4 w-4" />
                Clinic Admin / Owner
              </button>
              <button
                type="button"
                onClick={() => setRegType('patient')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  regType === 'patient'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="h-4 w-4" />
                Patient Registration
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {regType === 'clinic' ? (
                <>
                  <div className="border-b border-border pb-2 mb-3">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">1. Practice & Location</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Clinic Name"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      required
                      placeholder="e.g. Apex Dental Center"
                    />
                    <Input
                      label="Clinic Address"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="e.g. Dallas, TX"
                    />
                  </div>
                  <Input
                    label="Phone Contact"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (214) 555-0182"
                  />

                  <div className="border-b border-border pb-2 pt-2 mb-3">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">2. Clinic Owner Account</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Owner Full Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Arthur Miller"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      required
                      placeholder="e.g. owner@apexdental.com"
                    />
                  </div>
                  <Input
                    label="Owner Password"
                    type="password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    required
                    placeholder="Create login password"
                  />

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-start gap-2.5 mt-4">
                    <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div className="text-[10px] font-semibold leading-relaxed">
                      SaaS registrations require review. Your dashboard account will remain **Pending Approval** until approved in the Super Admin HQ control panel.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-border pb-2 flex items-center gap-1">
                    <Users className="h-4.5 w-4.5" />
                    1. Demographics & Contact details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Patient Full Name *"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Robert Pattinson"
                      required
                      className="text-xs text-foreground font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Age"
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="e.g. 30"
                        className="text-xs text-foreground font-medium"
                      />
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Gender</label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Contact Phone Number *"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="e.g. (312) 555-0144"
                      required
                      className="text-xs text-foreground font-medium"
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="e.g. rob@gmail.com"
                      required
                      className="text-xs text-foreground font-medium"
                    />
                    <Input
                      label="Account Password *"
                      type="password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder="Create login password"
                      required
                      className="text-xs text-foreground font-medium"
                    />
                  </div>

                  <Input
                    label="Residential Address"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="e.g. Country Lane, Cottington, UK"
                    className="text-xs text-foreground font-medium"
                  />

                  <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-border pb-2 pt-4 flex items-center gap-1">
                    <ShieldCheck className="h-4.5 w-4.5" />
                    2. Medical Summary & Insurance Eligibility
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Known Allergies (comma separated)"
                      value={patientAllergies}
                      onChange={(e) => setPatientAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Latex"
                      className="text-xs text-foreground font-medium"
                    />
                    <Input
                      label="Insurance Provider Name"
                      value={patientInsurance}
                      onChange={(e) => setPatientInsurance(e.target.value)}
                      placeholder="e.g. Blue Cross Blue Shield"
                      className="text-xs text-foreground font-medium"
                    />
                  </div>

                  <div className="border-b border-border pb-2 pt-4 mb-3">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Preferred Clinic Location</span>
                  </div>
                  <Select
                    label="Select Preferred Clinic Location"
                    value={selectedClinic}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                    options={clinics.map((c) => ({ value: c.id, label: `${c.name} (${c.location})` }))}
                  />
                </>
              )}

              <Button type="submit" className="w-full h-11 font-bold select-none cursor-pointer mt-6">
                Submit Sandbox Registration
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-6 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>

            {regType === 'clinic' ? (
              <>
                <h2 className="text-xl font-bold text-foreground">Clinic Registration Submitted!</h2>
                <div className="text-xs text-muted-foreground font-semibold leading-relaxed max-w-sm mx-auto space-y-3">
                  <p>
                    Clinic **"{clinicName}"** and Owner account for **"{ownerName}"** have been successfully added to the sandbox registry.
                  </p>
                  <p className="p-3 bg-muted border border-border rounded-xl">
                    Your credentials: <br />
                    <span className="font-extrabold text-foreground block mt-1">Email: {ownerEmail}</span>
                    <span className="font-extrabold text-foreground block">Password: {ownerPassword}</span>
                  </p>
                  <p className="text-primary font-bold">
                    Go to the Super Admin Dashboard &rarr; Clinic Owner to Approve this clinic owner!
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground">Patient Registered Successfully!</h2>
                <p className="text-xs text-muted-foreground font-semibold max-w-sm mx-auto leading-relaxed">
                  Patient account for **"{patientName}"** has been simulated in the active databases for clinic location **"{clinics.find(c => c.id === selectedClinic)?.name}"**.
                </p>
              </>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="font-bold text-xs">
                Register Another
              </Button>
              <Button onClick={() => navigate('/login')} className="font-bold text-xs">
                Go to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default RegisterPage;
