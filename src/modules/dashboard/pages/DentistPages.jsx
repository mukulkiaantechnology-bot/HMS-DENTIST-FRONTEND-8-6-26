import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Trash2,
  Activity,
  ClipboardList,
  Image as ImageIcon,
  Pill,
  FileText,
  Brain,
  Check,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useDentistStore } from '../../../store/dentistStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';
import { DataTable } from '../../../shared/ui/DataTable';

// ----------------------------------------------------
// 1. PATIENTS REGISTRY PAGE
// ----------------------------------------------------
export function DentistPatientsPage() {
  const navigate = useNavigate();
  const { patients, setActivePatientId } = useDentistStore();

  const handleOpenChart = (id) => {
    setActivePatientId(id);
    navigate(`/dentist/patients/${id}?tab=overview`);
  };

  const columns = [
    { key: 'id', header: 'ID', render: (p) => <span className="font-bold text-slate-500">#{p.id}</span> },
    { key: 'name', header: 'Patient Name', render: (p) => <span className="font-extrabold text-foreground">{p.name}</span> },
    { key: 'age', header: 'Age' },
    { key: 'phone', header: 'Phone' },
    { key: 'allergies', header: 'Allergies', render: (p) => (
      <Badge variant={p.allergies === 'None' ? 'success' : 'destructive'}>
        {p.allergies}
      </Badge>
    )},
    { key: 'status', header: 'Status', render: (p) => <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>{p.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <Button size="sm" onClick={() => handleOpenChart(p.id)} className="font-bold gap-1 text-[11px] h-8 cursor-pointer">
          Open Chart
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Clinical Patient Registry
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Select a patient profile to review diagnostic history, dental charts, and write treatments.</p>
      </div>

      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <DataTable columns={columns} data={patients} searchKey="name" searchPlaceholder="Search patient files by name..." pageSize={10} />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. PATIENT DETAIL CONTROLLER PAGE (TABS MAPPED)
// ----------------------------------------------------
export function PatientDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { patients, setActivePatientId } = useDentistStore();

  const activeTab = searchParams.get('tab') || 'overview';
  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    if (id) {
      setActivePatientId(id);
    }
  }, [id, setActivePatientId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive animate-bounce mb-4" />
        <h3 className="text-lg font-bold">Patient Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2">The requested patient record could not be located in this clinic.</p>
        <Button onClick={() => navigate('/dentist/patients')} className="mt-6">Back to Registry</Button>
      </div>
    );
  }

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Users },
    { key: 'chart', label: 'Dental Chart', icon: Activity },
    { key: 'treatment', label: 'Treatment Plan', icon: ClipboardList },
    { key: 'xrays', label: 'X-Rays', icon: ImageIcon },
    { key: 'prescription', label: 'Prescription', icon: Pill },
    { key: 'notes', label: 'Notes', icon: FileText }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in flex-1 flex flex-col h-full">
      {/* Patient Profile Card Header */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-foreground">{patient.name}</h2>
            <Badge variant="secondary" className="font-bold">ID: #{patient.id}</Badge>
            <Badge variant={patient.status === 'Active' ? 'success' : 'secondary'}>{patient.status}</Badge>
          </div>
          <p className="text-xs font-semibold text-muted-foreground leading-relaxed max-w-xl">
            {patient.history}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="p-3 bg-muted/50 border border-border rounded-xl">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[9px] tracking-wider">Allergic Warning</span>
            <span className={`font-extrabold ${patient.allergies === 'None' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {patient.allergies}
            </span>
          </div>
          <div className="p-3 bg-muted/50 border border-border rounded-xl">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[9px] tracking-wider">Active Vitals</span>
            <span className="font-extrabold text-foreground">{patient.vitals}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border/80 overflow-x-auto no-scrollbar gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'border-primary text-primary font-black'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body content */}
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        {activeTab === 'overview' && <OverviewTab patient={patient} />}
        {activeTab === 'chart' && <DentalChartTab patientId={patient.id} />}
        {activeTab === 'treatment' && <TreatmentPlanTab patientId={patient.id} />}
        {activeTab === 'xrays' && <XraysTab patientId={patient.id} />}
        {activeTab === 'prescription' && <PrescriptionTab patientId={patient.id} />}
        {activeTab === 'notes' && <NotesTab key={patient.id} patientId={patient.id} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB SUB-COMPONENTS
// ----------------------------------------------------

// 1. OVERVIEW TAB
function OverviewTab({ patient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-black text-sm uppercase text-primary tracking-wider">Clinical Demographics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-muted-foreground block">Email Address</span>
              <span className="text-foreground font-bold">{patient.email}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Mobile Phone</span>
              <span className="text-foreground font-bold">{patient.phone}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Age Profile</span>
              <span className="text-foreground font-bold">{patient.age} years old</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Patient Registry File</span>
              <Badge variant="secondary">Core Sandbox Patient</Badge>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-black text-sm uppercase text-primary tracking-wider">Past Dental Notes Summary</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            {patient.history} Patient details are pulled dynamically from local HMS sandboxed clinic settings. Standard dental checks occur bi-annually.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {patient.allergies !== 'None' && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4.5 w-4.5 animate-bounce" />
              Critical Allergy Flag
            </div>
            <p className="text-[11px] leading-relaxed font-semibold">
              Warning: Patient is allergic to <strong>{patient.allergies}</strong>. Avoid prescribing antibiotics or clinical products containing these matrices during surgical dental operations.
            </p>
          </div>
        )}

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-black text-xs uppercase text-primary tracking-wider">Operational Directives</h3>
          <ul className="space-y-2 text-xs font-semibold text-muted-foreground list-disc list-inside">
            <li>Review dental chart and update conditions.</li>
            <li>Consult treatment plans for procedures.</li>
            <li>Request DICOM radiography scan if outdated.</li>
            <li>Validate pharmacy scripts for allergies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 2. DENTAL CHART TAB (ODONTOGRAM)
function DentalChartTab({ patientId }) {
  const { odontograms, updateToothCondition } = useDentistStore();
  const toast = useToast();
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const patientChart = odontograms[patientId] || {};

  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
    setIsModalOpen(true);
  };

  const setCondition = (cond) => {
    if (!selectedTooth) return;
    updateToothCondition(patientId, selectedTooth, cond);
    toast.success(`Updated tooth #${selectedTooth} to "${cond}"`);
    setIsModalOpen(false);
  };

  const getToothColorClass = (cond) => {
    if (cond === 'Cavity') return 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600';
    if (cond === 'Crown') return 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600';
    if (cond === 'Implant') return 'bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600';
    if (cond === 'Missing') return 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-900';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
  };

  // Divide teeth into Maxillary (1-16) and Mandibular (17-32) rows
  const maxillaryTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const mandibularTeeth = Array.from({ length: 16 }, (_, i) => 32 - i); // Lower row arranged standard left-to-right from perspective

  return (
    <div className="space-y-6 py-4">
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center">
        <div className="border-b border-border pb-3 mb-5 text-left flex justify-between items-center">
          <div>
            <h3 className="font-black text-sm uppercase text-primary tracking-wider">Universal Odontogram (32 Teeth Chart)</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Click on any tooth to update diagnosis conditions.</p>
          </div>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Cavity</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Crown</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Implant</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" /> Missing</span>
          </div>
        </div>

        <div className="space-y-10 py-6 max-w-4xl mx-auto overflow-x-auto">
          {/* Maxillary Upper Row */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground block text-left">Maxillary Arch (Upper Row)</span>
            <div className="grid gap-1.5 min-w-[640px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              {maxillaryTeeth.map((num) => {
                const cond = patientChart[num] || 'Healthy';
                return (
                  <button
                    key={num}
                    onClick={() => handleToothClick(num)}
                    className={`h-14 border rounded-lg flex flex-col items-center justify-between py-2 text-xs font-black transition-all cursor-pointer hover:scale-105 shadow-sm ${getToothColorClass(cond)}`}
                    title={`Tooth #${num} (${cond})`}
                  >
                    <span>{num}</span>
                    <span className="text-[8px] tracking-tighter opacity-85">{cond[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mandibular Lower Row */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground block text-left">Mandibular Arch (Lower Row)</span>
            <div className="grid gap-1.5 min-w-[640px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              {mandibularTeeth.map((num) => {
                const cond = patientChart[num] || 'Healthy';
                return (
                  <button
                    key={num}
                    onClick={() => handleToothClick(num)}
                    className={`h-14 border rounded-lg flex flex-col items-center justify-between py-2 text-xs font-black transition-all cursor-pointer hover:scale-105 shadow-sm ${getToothColorClass(cond)}`}
                    title={`Tooth #${num} (${cond})`}
                  >
                    <span className="text-[8px] tracking-tighter opacity-85">{cond[0]}</span>
                    <span>{num}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Condition modal popover */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Diagnose Tooth #${selectedTooth}`}>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-semibold">
            Choose condition diagnostics for Tooth #{selectedTooth}. Current charted condition: <strong>{selectedTooth ? patientChart[selectedTooth] : 'Healthy'}</strong>
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={() => setCondition('Healthy')} className="bg-emerald-500 hover:bg-emerald-600 font-bold text-xs h-11">
              Healthy
            </Button>
            <Button onClick={() => setCondition('Cavity')} className="bg-rose-500 hover:bg-rose-600 font-bold text-xs h-11">
              Cavity
            </Button>
            <Button onClick={() => setCondition('Crown')} className="bg-amber-500 hover:bg-amber-600 font-bold text-xs h-11">
              Crown
            </Button>
            <Button onClick={() => setCondition('Implant')} className="bg-indigo-500 hover:bg-indigo-600 font-bold text-xs h-11">
              Implant
            </Button>
          </div>
          <Button onClick={() => setCondition('Missing')} variant="outline" className="w-full font-bold text-xs h-11 border-dashed mt-2">
            Missing / Extracted
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// 3. TREATMENT PLAN TAB
function TreatmentPlanTab({ patientId }) {
  const { treatmentPlans, addProcedure, updateProcedureStatus, deleteProcedure } = useDentistStore();
  const toast = useToast();

  const [tooth, setTooth] = useState('');
  const [procedureName, setProcedureName] = useState('Composite Restoration');
  const [cost, setCost] = useState('150');

  const plans = treatmentPlans[patientId] || [];

  const handleAddProc = (e) => {
    e.preventDefault();
    if (!tooth) {
      toast.error('Please enter a tooth number');
      return;
    }
    addProcedure(patientId, {
      tooth,
      procedure: procedureName,
      cost: Number(cost)
    });
    toast.success(`Proposed procedure on tooth #${tooth}`);
    setTooth('');
  };

  const handleToggleStatus = (procId, currentStatus) => {
    const nextStatus = currentStatus === 'Proposed' ? 'Accepted' : currentStatus === 'Accepted' ? 'Completed' : 'Proposed';
    updateProcedureStatus(patientId, procId, nextStatus);
    toast.success(`Procedure updated to status: ${nextStatus}`);
  };

  const handleDeleteProc = (procId) => {
    if (confirm('Delete this procedure suggestion?')) {
      deleteProcedure(patientId, procId);
      toast.warning('Procedure removed from plan.');
    }
  };

  const totalEstimate = plans.reduce((sum, item) => sum + item.cost, 0);

  const getStatusBadge = (status) => {
    if (status === 'Completed') return <Badge variant="success">Completed</Badge>;
    if (status === 'Accepted') return <Badge variant="info">Accepted</Badge>;
    return <Badge variant="secondary">Proposed</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
      {/* List / Estimates Panel */}
      <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-black text-sm uppercase text-primary tracking-wider">Planned Procedures</h3>
          <div className="text-xs font-bold text-foreground">
            Est. Total: <span className="text-primary font-black">${totalEstimate}</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {plans.length > 0 ? (
            plans.map((p) => (
              <div key={p.id} className="p-3.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between hover:bg-muted/70 transition-colors">
                <div className="space-y-0.5 text-xs text-left">
                  <div className="font-extrabold text-foreground flex items-center gap-1.5">
                    <span>Tooth #{p.tooth} &bull; {p.procedure}</span>
                    {getStatusBadge(p.status)}
                  </div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Est. Cost: ${p.cost}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="h-8 text-[10px] font-bold bg-muted hover:bg-muted/95 border border-border px-2 rounded-lg cursor-pointer"
                    title="Toggle Progress State"
                  >
                    Change State
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteProc(p.id)} className="h-8 w-8 text-destructive rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground text-xs font-semibold italic block py-6 text-center">No procedures planned yet. Add one in the form panel.</span>
          )}
        </div>
      </div>

      {/* Add form */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
        <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3 text-left">Add Procedure Option</h3>
        <form onSubmit={handleAddProc} className="space-y-4 text-left">
          <Input
            label="Tooth #"
            value={tooth}
            onChange={(e) => setTooth(e.target.value)}
            required
            placeholder="e.g. 14, 19, 3"
          />
          <Select
            label="Procedure Name"
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
            options={[
              { value: 'Composite Restoration', label: 'Composite Fillings ($150)' },
              { value: 'Porcelain PFM Crown', label: 'Porcelain Crown ($950)' },
              { value: 'Root Canal Therapy', label: 'Root Canal Treatment ($1100)' },
              { value: 'Dental Implant Restorations', label: 'Dental Implant Extraction ($1800)' },
              { value: 'Deep Hygiene Scaling', label: 'Periodontic Scaling ($250)' }
            ]}
          />
          <Input
            label="Estimated Cost ($)"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            placeholder="150"
          />
          <Button type="submit" className="w-full font-bold h-11 mt-4">
            Propose Procedure
          </Button>
        </form>
      </div>
    </div>
  );
}

// 4. X-RAYS TAB
function XraysTab({ patientId }) {
  const { xrays, addXray, updateXrayAIResult } = useDentistStore();
  const toast = useToast();

  const [fileInputName, setFileInputName] = useState('radiograph_audit.jpg');
  const [fileNotes, setFileNotes] = useState('Right molar view checkup.');
  const [scanningXrayId, setScanningXrayId] = useState(null);

  const list = xrays[patientId] || [];

  const handleUpload = (e) => {
    e.preventDefault();
    addXray(patientId, { name: fileInputName, notes: fileNotes });
    toast.success(`Simulated upload of: ${fileInputName}`);
    setFileInputName('radiograph_audit.jpg');
    setFileNotes('');
  };

  const handleAIScan = (xrayId) => {
    setScanningXrayId(xrayId);
    toast.info('Starting dental radiography neural-net diagnostics...', 'Clinical AI Scan Launched');
    
    setTimeout(() => {
      setScanningXrayId(null);
      updateXrayAIResult(
        patientId,
        xrayId,
        `AI Dental Audit Report: Detected radiolucency suspicious of occlusal caries on tooth #14. Bordering enamel index standard.`
      );
      toast.success('Clinical AI Scanner diagnostics generated successfully.');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
      {/* Upload Panel */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-left">
        <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3 mb-4">Simulate Image Upload</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Radiography File Name"
            value={fileInputName}
            onChange={(e) => setFileInputName(e.target.value)}
            required
          />
          <Input
            label="Practitioner Notes"
            value={fileNotes}
            onChange={(e) => setFileNotes(e.target.value)}
            placeholder="e.g. checkup right molar bitewing"
          />
          <Button type="submit" className="w-full font-bold h-11">
            Simulate File Upload
          </Button>
        </form>
      </div>

      {/* Radiograph list and AI checks */}
      <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm text-left space-y-4">
        <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3">Dental Radiographs</h3>

        <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-1">
          {list.length > 0 ? (
            list.map((xr) => {
              const isScanning = scanningXrayId === xr.id;
              return (
                <div key={xr.id} className="p-4 bg-muted/40 border border-border rounded-xl flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-foreground">{xr.name}</span>
                      <span className="text-muted-foreground font-semibold">({xr.date})</span>
                    </div>
                    <p className="text-[10px] font-semibold text-muted-foreground">{xr.notes}</p>
                    
                    {xr.aiReport && (
                      <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-semibold flex items-start gap-1.5 mt-2">
                        <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                        <span>{xr.aiReport}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end md:border-l md:border-border/60 md:pl-4">
                    {!xr.isScanned ? (
                      <Button
                        size="sm"
                        disabled={isScanning}
                        onClick={() => handleAIScan(xr.id)}
                        className="font-bold text-[10px] h-9 gap-1 bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                      >
                        {isScanning ? (
                          <>
                            <Clock className="h-3.5 w-3.5 animate-spin" />
                            Auditing...
                          </>
                        ) : (
                          <>
                            <Brain className="h-3.5 w-3.5" />
                            Run AI Diagnostics
                          </>
                        )}
                      </Button>
                    ) : (
                      <Badge variant="info" className="gap-1 font-bold">
                        <Check className="h-3 w-3" /> Scanned
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-muted-foreground text-xs font-semibold italic block py-8 text-center">No radiography files recorded for this patient.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. PRESCRIPTION TAB
function PrescriptionTab({ patientId }) {
  const { prescriptions, addPrescription, deletePrescription } = useDentistStore();
  const toast = useToast();

  const [drug, setDrug] = useState('Amoxicillin 500mg');
  const [dosage, setDosage] = useState('500mg (1 capsule)');
  const [frequency, setFrequency] = useState('Three times daily');
  const [duration, setDuration] = useState('7 days');

  const list = prescriptions[patientId] || [];

  const handleAddRx = (e) => {
    e.preventDefault();
    addPrescription(patientId, { drug, dosage, frequency, duration });
    toast.success(`Prescribed: ${drug}`);
  };

  const handleDeleteRx = (rxId) => {
    if (confirm('Delete this pharmacy prescription record?')) {
      deletePrescription(patientId, rxId);
      toast.warning('Prescription deleted.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
      {/* Pharmacy search and create form */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-left">
        <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3 mb-4">Write Pharmacy RX</h3>
        
        <form onSubmit={handleAddRx} className="space-y-4">
          <Select
            label="Search Pharmacy Drug"
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
            options={[
              { value: 'Amoxicillin 500mg', label: 'Amoxicillin 500mg (Antibiotic)' },
              { value: 'Clindamycin 300mg', label: 'Clindamycin 300mg (Penicillin Allergy Safe)' },
              { value: 'Ibuprofen 600mg', label: 'Ibuprofen 600mg (Pain / Anti-inflammatory)' },
              { value: 'Chlorhexidine 0.12% Rinse', label: 'Chlorhexidine 0.12% Oral Rinse (Germicidal)' },
              { value: 'Acetaminophen 500mg', label: 'Acetaminophen 500mg (Pain Relief)' }
            ]}
          />
          <Input
            label="Dosage Instruction"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            placeholder="e.g. 500mg (1 capsule)"
          />
          <Input
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            placeholder="e.g. Three times daily with food"
          />
          <Input
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            placeholder="e.g. 7 days"
          />
          <Button type="submit" className="w-full font-bold h-11 mt-4">
            Prescribe Medication
          </Button>
        </form>
      </div>

      {/* History panel */}
      <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm text-left space-y-4">
        <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3">Prescription History</h3>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {list.length > 0 ? (
            list.map((rx) => (
              <div key={rx.id} className="p-3.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between hover:bg-muted/70 transition-colors">
                <div className="space-y-0.5 text-xs text-left">
                  <span className="font-extrabold text-foreground block">{rx.drug} &bull; <span className="text-muted-foreground font-semibold">({rx.date})</span></span>
                  <span className="text-[10px] text-muted-foreground block font-bold">Instructions: {rx.dosage} &bull; {rx.frequency} &bull; {rx.duration}</span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteRx(rx.id)} className="h-8 w-8 text-destructive rounded-full">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground text-xs font-semibold italic block py-8 text-center">No written prescriptions found for this patient file.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. CLINICAL NOTES TAB (WITH AUTO-SAVE SIMULATOR)
function NotesTab({ patientId }) {
  const { notes, saveClinicalNote } = useDentistStore();
  const toast = useToast();

  const [editorText, setEditorText] = useState(notes[patientId] || '');
  const [saveState, setSaveState] = useState('Saved'); // 'Saving...', 'Saved', 'Unsaved'
  const saveTimeoutRef = useRef(null);

  // Note state is synchronized on change and template insertion

  const handleNotesChange = (e) => {
    const text = e.target.value;
    setEditorText(text);
    setSaveState('Unsaved');

    // Simulate autosave debounce logic
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveState('Saving...');
    saveTimeoutRef.current = setTimeout(() => {
      saveClinicalNote(patientId, text);
      setSaveState('Saved');
    }, 1200);
  };

  const handleTemplateSelect = (e) => {
    const val = e.target.value;
    if (!val) return;

    let textToAppend = '';
    if (val === 'comp_exam') {
      textToAppend = '\n\n[COMPREHENSIVE EXAM TEMPLATE]\nCC: Patient reports for routine exam.\nExtraloral: normal lymph nodes.\nIntraoral: soft tissues healthy.\nRadiographs checked: bone levels within limits.\nTx Plan: Hygiene prophy + regular recalls.';
    } else if (val === 'hygiene') {
      textToAppend = '\n\n[HYGIENE PROPHY EXAM TEMPLATE]\nCC: Periodic cleaning.\nCalculus index: mild to moderate.\nPeriodontic probe scores: all 2-3mm.\nTreatment: ultrasonic scaling completed. Fluoride treatment accepted.\nStatus: hygiene recalled.';
    } else if (val === 'rct_pulp') {
      textToAppend = '\n\n[ENDODONTIC DIAGNOSTIC TEMPLATE]\nCC: toothache reported in mandibular sector.\nDiagnosis: irreversible pulpitis on #19.\nTreatment: pulp access completed under lidocaine. Canal irrigated. Temporary CAVIT restoration placed.\nRecall: return for RCT canal completion in 7 days.';
    }

    const newText = editorText + textToAppend;
    setEditorText(newText);
    saveClinicalNote(patientId, newText);
    setSaveState('Saved');
    toast.success('Injected template into notes editor.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
      {/* Editor Main */}
      <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-black text-sm uppercase text-primary tracking-wider flex items-center gap-2">
            Clinical EHR Note Editor
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {saveState === 'Saving...' && (
              <span className="text-amber-500 flex items-center gap-1">
                <Clock className="h-3 w-3 animate-spin" />
                Autosaving to cloud...
              </span>
            )}
            {saveState === 'Saved' && (
              <span className="text-emerald-500 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Saved to EHR
              </span>
            )}
          </div>
        </div>

        <textarea
          value={editorText}
          onChange={handleNotesChange}
          placeholder="Start typing clinical notes here... Auto-saves automatically."
          className="w-full flex-1 min-h-[280px] p-4 bg-muted/30 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed text-foreground"
        />
      </div>

      {/* Templates Selector */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-left space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase text-primary tracking-wider border-b border-border pb-3">Clinical Templates</h3>
          
          <Select
            label="Inject Clinical Templates"
            onChange={handleTemplateSelect}
            options={[
              { value: '', label: '-- Choose Template --' },
              { value: 'comp_exam', label: 'Comprehensive Exam template' },
              { value: 'hygiene', label: 'Hygiene Prophy template' },
              { value: 'rct_pulp', label: 'RCT Pulp Diagnostic template' }
            ]}
          />

          <div className="p-4 bg-muted/50 border border-border rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Autosave Engine</span>
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              Clinical changes are auto-saved in real time. De-bouncing prevents interruptions during surgical patient operations.
            </p>
          </div>
        </div>

        <Button onClick={() => toast.success('Notes signed and finalized successfully.')} className="w-full font-bold text-xs py-5 bg-emerald-500 hover:bg-emerald-600">
          Sign & Finalize Notes
        </Button>
      </div>
    </div>
  );
}
