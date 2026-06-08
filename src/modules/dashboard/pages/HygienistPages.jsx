import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  Clock,
  FileText,
  AlertTriangle,
  Brain,
  Check,
  Send,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Plus,
  Sparkles
} from 'lucide-react';
import { useHygienistStore } from '../../../store/hygienistStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { DataTable } from '../../../shared/ui/DataTable';

// ----------------------------------------------------
// 1. PATIENTS REGISTRY PAGE
// ----------------------------------------------------
export function HygienistPatientsPage() {
  const navigate = useNavigate();
  const { patients, riskProfiles, setActivePatientId } = useHygienistStore();

  const handleOpenChart = (id) => {
    setActivePatientId(id);
    navigate(`/hygienist/patients/${id}?tab=overview`);
  };

  const columns = [
    { key: 'id', header: 'ID', render: (p) => <span className="font-bold text-slate-500">#{p.id}</span> },
    { key: 'name', header: 'Patient Name', render: (p) => <span className="font-extrabold text-foreground">{p.name}</span> },
    { key: 'age', header: 'Age' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'risk',
      header: 'Gum Risk Class',
      render: (p) => {
        const risk = riskProfiles[p.id]?.classification || 'Low';
        const variant = risk === 'High' ? 'destructive' : risk === 'Medium' ? 'warning' : 'success';
        return <Badge variant={variant} className="font-bold">{risk}</Badge>;
      }
    },
    { key: 'status', header: 'Status', render: (p) => <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>{p.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <Button size="sm" onClick={() => handleOpenChart(p.id)} className="font-bold gap-1 text-[11px] h-8 cursor-pointer">
          Open Preventative Chart
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Preventive Patients Directory
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Select a patient profile to perform perio probing, gum disease assessment, and review hygiene schedule.</p>
      </div>

      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <DataTable columns={columns} data={patients} searchKey="name" searchPlaceholder="Search patient records by name..." pageSize={10} />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. PATIENT DETAIL CONTROLLER PAGE
// ----------------------------------------------------
export function HygienistPatientDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { patients, riskProfiles, setActivePatientId } = useHygienistStore();

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
        <Button onClick={() => navigate('/hygienist/patients')} className="mt-6">Back to Patients</Button>
      </div>
    );
  }

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const risk = riskProfiles[patient.id]?.classification || 'Low';
  const riskColor = risk === 'High' ? 'text-rose-500' : risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Users },
    { key: 'perio', label: 'Perio Charting', icon: Activity },
    { key: 'risk', label: 'Risk Analysis', icon: Sliders },
    { key: 'recall', label: 'Recall System', icon: Clock },
    { key: 'notes', label: 'Clinical Notes', icon: FileText }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in flex-1 flex flex-col h-full min-w-0 w-full">
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
            <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[9px] tracking-wider font-extrabold">Gum Risk Classification</span>
            <span className={`font-black uppercase text-xs ${riskColor}`}>{risk} Risk</span>
          </div>
          <div className="p-3 bg-muted/50 border border-border rounded-xl">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[9px] tracking-wider">Allergies</span>
            <span className={`font-extrabold ${patient.allergies === 'None' ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`}>
              {patient.allergies}
            </span>
          </div>
          <div className="p-3 bg-muted/50 border border-border rounded-xl">
            <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[9px] tracking-wider">Vitals</span>
            <span className="font-extrabold text-foreground">{patient.vitals}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border/80 overflow-x-auto no-scrollbar gap-2">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold transition-all border-b-2 outline-none whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 rounded-t-lg font-black'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <IconComp className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 bg-card border border-border p-6 rounded-3xl shadow-sm min-h-[450px] min-w-0 w-full overflow-hidden">
        {activeTab === 'overview' && <PatientOverviewTab patient={patient} risk={risk} />}
        {activeTab === 'perio' && <PerioChartingTab key={patient.id} patient={patient} />}
        {activeTab === 'risk' && <RiskAnalysisTab key={patient.id} patient={patient} />}
        {activeTab === 'recall' && <RecallSystemTab key={patient.id} patient={patient} />}
        {activeTab === 'notes' && <ClinicalNotesTab key={patient.id} patient={patient} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2A. TAB: OVERVIEW
// ----------------------------------------------------
function PatientOverviewTab({ patient, risk }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-lg font-extrabold text-foreground">Demographics & Clinical Summary</h3>
        <p className="text-[11px] text-muted-foreground font-semibold">General medical history summary and vitals logged by front desk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs leading-relaxed">
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary">Personal Details</h4>
          <div className="space-y-2">
            <div><span className="text-muted-foreground font-semibold">Full Name:</span> <span className="font-bold text-foreground">{patient.name}</span></div>
            <div><span className="text-muted-foreground font-semibold">Age:</span> <span className="font-bold text-foreground">{patient.age} years</span></div>
            <div><span className="text-muted-foreground font-semibold">Phone:</span> <span className="font-bold text-foreground">{patient.phone}</span></div>
            <div><span className="text-muted-foreground font-semibold">Email:</span> <span className="font-bold text-foreground">{patient.email}</span></div>
          </div>
        </div>

        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary">Systemic Risks</h4>
          <div className="space-y-2">
            <div><span className="text-muted-foreground font-semibold">Drug Allergies:</span> <span className={`font-bold ${patient.allergies === 'None' ? 'text-emerald-500' : 'text-rose-500'}`}>{patient.allergies}</span></div>
            <div><span className="text-muted-foreground font-semibold">Active Vitals:</span> <span className="font-bold text-foreground">{patient.vitals}</span></div>
            <div><span className="text-muted-foreground font-semibold">Clinical Note:</span> <span className="font-medium text-foreground">{patient.history}</span></div>
          </div>
        </div>

        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary">Preventive Health Status</h4>
          <div className="space-y-2">
            <div><span className="text-muted-foreground font-semibold">Gum Classification:</span> <span className="font-bold text-foreground">{risk} Risk</span></div>
            <div><span className="text-muted-foreground font-semibold">Hygiene Frequency:</span> <span className="font-bold text-foreground">{risk === 'High' ? '3 Months' : '6 Months'}</span></div>
            <div><span className="text-muted-foreground font-semibold">Compliance Status:</span> <span className="font-bold text-emerald-500">Compliant</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2B. TAB: PERIO CHARTING
// ----------------------------------------------------
function ToothProbingEditor({ patientId, toothNum, initialData, onSave, onSaveSuccess }) {
  const [pocketDepth, setPocketDepth] = useState(initialData.pocketDepth);
  const [bleeding, setBleeding] = useState(initialData.bleeding);
  const [mobility, setMobility] = useState(initialData.mobility);

  const handleSave = () => {
    onSave(patientId, toothNum, {
      pocketDepth: Number(pocketDepth),
      bleeding,
      mobility: Number(mobility)
    });
    onSaveSuccess();
  };

  return (
    <div className="bg-card border border-border p-5 rounded-2xl max-w-xl mx-auto shadow-sm space-y-4">
      <h4 className="font-black text-xs uppercase text-primary flex items-center gap-1.5">
        <Activity className="h-4 w-4" />
        Teeth Measurement Form: Tooth #{toothNum}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pocket Depth Slider */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Pocket Depth</label>
          <div className="flex items-center gap-3">
            <span className={`text-xl font-black ${pocketDepth >= 5 ? 'text-rose-500' : 'text-foreground'}`}>
              {pocketDepth} mm
            </span>
            <input
              type="range"
              min="1"
              max="9"
              value={pocketDepth}
              onChange={(e) => setPocketDepth(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Bleeding Indicator */}
        <div className="space-y-1.5 text-left flex flex-col justify-center">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Bleeding on Probing</label>
          <label className="flex items-center gap-2 cursor-pointer mt-1 select-none font-bold text-xs text-foreground">
            <input
              type="checkbox"
              checked={bleeding}
              onChange={(e) => setBleeding(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-border text-rose-500 focus:ring-rose-500 cursor-pointer"
            />
            <span className={bleeding ? 'text-rose-500' : ''}>Active Bleeding</span>
          </label>
        </div>

        {/* Mobility Rating */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Tooth Mobility</label>
          <select
            value={mobility}
            onChange={(e) => setMobility(Number(e.target.value))}
            className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2 focus:outline-none cursor-pointer text-foreground"
          >
            <option value="0">Class 0 (Normal)</option>
            <option value="1">Class 1 (Slight)</option>
            <option value="2">Class 2 (Moderate)</option>
            <option value="3">Class 3 (Severe)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
        <Button
          size="sm"
          onClick={handleSave}
          className="font-bold px-5 py-2 text-xs"
        >
          Save Tooth #{toothNum} Data &rarr;
        </Button>
      </div>
    </div>
  );
}

function PerioChartingTab({ patient }) {
  const { perioCharts, updateToothPerio } = useHygienistStore();

  const [selectedTooth, setSelectedTooth] = useState(1);
  const patientChart = perioCharts[patient.id] || {};

  // Divide 32 teeth into Upper row (1-16) and Lower row (32-17 matching molar alignment)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  const renderToothCell = (toothNum) => {
    const data = patientChart[toothNum] || { pocketDepth: 3, bleeding: false, mobility: 0 };
    const isSelected = selectedTooth === toothNum;
    const hasIssues = data.pocketDepth >= 5 || data.bleeding;

    return (
      <button
        key={toothNum}
        onClick={() => setSelectedTooth(toothNum)}
        className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[90px] w-full transition-all cursor-pointer ${
          isSelected
            ? 'ring-2 ring-primary border-primary bg-primary/5 scale-[1.03]'
            : hasIssues
            ? 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/20'
            : 'bg-muted/40 border-border hover:bg-muted/70'
        }`}
      >
        <span className="font-extrabold text-[10px] text-muted-foreground uppercase">#{toothNum}</span>
        <div className="flex flex-col items-center gap-0.5 my-1">
          <span className={`text-sm font-black ${data.pocketDepth >= 5 ? 'text-rose-500' : 'text-foreground'}`}>
            {data.pocketDepth}mm
          </span>
          {data.bleeding && (
            <span className="h-1.5 w-1.5 bg-rose-600 rounded-full animate-pulse" title="Bleeding on probing" />
          )}
        </div>
        <span className="text-[9px] font-bold text-muted-foreground">
          {data.mobility > 0 ? `Mob: ${data.mobility}` : 'Mob: 0'}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">Interactive Periodontal Chart</h3>
          <p className="text-[11px] text-muted-foreground font-semibold">Perform perio probing measurements. Pockets &ge; 5mm or bleeding sites are highlighted in red.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="font-bold text-[9px] uppercase">&gt;=5mm pockets</Badge>
          <Badge variant="warning" className="font-bold text-[9px] uppercase">bleeding</Badge>
        </div>
      </div>

      {/* Teeth Odontogram Visual Representation */}
      <div className="bg-muted/20 border border-border p-5 rounded-3xl space-y-4 overflow-x-auto">
        {/* Upper Arch */}
        <div>
          <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Upper Arch (Maxilla)</div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 min-w-[640px]">
            {upperTeeth.map(renderToothCell)}
          </div>
        </div>

        <div className="h-px bg-border/60 my-2" />

        {/* Lower Arch */}
        <div>
          <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Lower Arch (Mandible)</div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 min-w-[640px]">
            {lowerTeeth.map(renderToothCell)}
          </div>
        </div>
      </div>

      {/* Interactive Metric Probing Editor */}
      <ToothProbingEditor
        key={`${patient.id}-${selectedTooth}`}
        patientId={patient.id}
        toothNum={selectedTooth}
        initialData={patientChart[selectedTooth] || { pocketDepth: 3, bleeding: false, mobility: 0 }}
        onSave={updateToothPerio}
        onSaveSuccess={() => {
          if (selectedTooth < 32) {
            setSelectedTooth(selectedTooth + 1);
          }
        }}
      />
    </div>
  );
}

// ----------------------------------------------------
// 2C. TAB: RISK ANALYSIS
// ----------------------------------------------------
function RiskAnalysisTab({ patient }) {
  const { riskProfiles, updateRiskAssessed } = useHygienistStore();
  const toast = useToast();

  const profile = riskProfiles[patient.id] || { classification: 'Low', riskFactors: [], aiAdvice: '' };
  
  const [classification, setClassification] = useState(profile.classification);
  const [newFactor, setNewFactor] = useState('');
  const [factors, setFactors] = useState(profile.riskFactors || []);
  const [aiAdvice, setAiAdvice] = useState(profile.aiAdvice || '');

  const handleAddFactor = (e) => {
    e.preventDefault();
    if (newFactor.trim()) {
      setFactors((prev) => [...prev, newFactor.trim()]);
      setNewFactor('');
    }
  };

  const handleRemoveFactor = (index) => {
    setFactors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTriggerAI = () => {
    // Simulated AI gum health calculation based on factors and classification
    let suggestion;
    if (classification === 'High') {
      suggestion = `Recommend periodontal debridement scaling / root planing (SRP) at 3-month intervals. Daily rinse with Chlorhexidine for 2 weeks. Recommend power brush with pressure sensor to avoid abrasion. Refer immediately to periodontal specialist.`;
    } else if (classification === 'Medium') {
      suggestion = `Perform routine scaling and prophy polishing. Focus patient flossing in molar segments. Assess localized pockets during the next 6-month checkup. Apply fluoride varnish to protect vulnerable root areas.`;
    } else {
      suggestion = `Maintain standard 6-month routine prophylaxis. Confirm patient is using fluoridated dentifrice. Re-chart perio depths annually to confirm stable bone levels.`;
    }
    setAiAdvice(suggestion);
    toast.success('AI Gum Health assessment calculated successfully!', 'Engine Evaluated');
  };

  const handleSaveRiskProfile = () => {
    updateRiskAssessed(patient.id, classification, factors, aiAdvice);
    toast.success('Risk classification profile saved successfully!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-lg font-extrabold text-foreground">Gum Disease Risk Engine</h3>
        <p className="text-[11px] text-muted-foreground font-semibold">Classify periodontal tissue health and trigger AI custom patient care recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Assessment Parameters */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Classification Rating</label>
            <div className="flex gap-2.5">
              {['Low', 'Medium', 'High'].map((level) => {
                const isSelected = classification === level;
                const activeColors = level === 'High'
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : level === 'Medium'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-emerald-500 text-white border-emerald-500 shadow-sm';

                return (
                  <button
                    key={level}
                    onClick={() => setClassification(level)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected ? activeColors : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-foreground">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Clinical Risk Factors</label>
            
            <form onSubmit={handleAddFactor} className="flex gap-2">
              <Input
                placeholder="e.g. History of calculus, heavy staining..."
                value={newFactor}
                onChange={(e) => setNewFactor(e.target.value)}
                className="flex-1 h-9 font-medium text-xs text-foreground"
              />
              <Button type="submit" size="sm" className="h-9 font-bold">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {factors.length === 0 ? (
                <span className="text-[11px] text-muted-foreground font-semibold">No risk factors added yet.</span>
              ) : (
                factors.map((factor, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="gap-1 font-bold pl-2.5 pr-1.5 py-0.5 rounded-full"
                  >
                    {factor}
                    <button
                      type="button"
                      onClick={() => handleRemoveFactor(idx)}
                      className="text-[10px] hover:text-rose-500 focus:outline-none ml-1 cursor-pointer font-black"
                    >
                      &times;
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Suggestions Engine Panel */}
        <div className="bg-muted/30 border border-border p-5 rounded-2xl shadow-sm flex flex-col space-y-3 justify-between">
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
              <Brain className="h-4.5 w-4.5 text-primary animate-bounce" />
              AI Preventive Care Suggestions
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Auto-generates clinical advice based on gum risk parameters, former habits, and molar pocketing levels.
            </p>
          </div>

          <div className="p-4 bg-card border border-border/80 rounded-xl min-h-[120px] flex items-center justify-center text-xs leading-relaxed text-left">
            {aiAdvice ? (
              <span className="font-semibold text-muted-foreground">{aiAdvice}</span>
            ) : (
              <div className="text-center space-y-1.5">
                <Sparkles className="h-6 w-6 text-primary mx-auto opacity-75" />
                <span className="text-[11px] text-muted-foreground font-semibold block">Click evaluate below to run AI suggestion rules.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTriggerAI}
              className="w-full sm:flex-1 font-extrabold text-xs h-10"
            >
              Evaluate AI Rules
            </Button>
            <Button
              size="sm"
              onClick={handleSaveRiskProfile}
              className="w-full sm:flex-1 font-extrabold text-xs h-10"
            >
              Save Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2D. TAB: RECALL SYSTEM
// ----------------------------------------------------
function RecallSystemTab({ patient }) {
  const { recalls, triggerRecallReminder, autoScheduleRecall } = useHygienistStore();
  const toast = useToast();

  const recall = recalls.find((r) => r.patientId === patient.id);

  if (!recall) {
    return (
      <div className="p-6 text-center space-y-2">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-xs">No Recall Data Found</h4>
        <p className="text-[11px] text-muted-foreground">This patient is not enrolled in the automated recall program.</p>
      </div>
    );
  }

  const handleSendReminder = () => {
    triggerRecallReminder(recall.id);
    toast.success(`Automated recall reminder notification dispatched to ${patient.name}!`, 'Notification Dispatched');
  };

  const handleAutoSchedule = () => {
    // Auto calculate 6 months from today
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    const dateStr = date.toISOString().split('T')[0];
    autoScheduleRecall(recall.id, dateStr);
    toast.success(`Scheduled cleaning booked for ${dateStr}!`, 'Recall Booked');
  };

  const statusVariant = recall.status === 'Scheduled'
    ? 'success'
    : recall.status === 'Reminded'
    ? 'warning'
    : 'destructive';

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-lg font-extrabold text-foreground">Recall Campaign Operations</h3>
        <p className="text-[11px] text-muted-foreground font-semibold">Track hygiene compliance, check-up scheduling, and dispatch reminder campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* Campaign Metrics */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary">Recall Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground font-semibold">Program Frequency:</span> <strong className="text-foreground">{recall.frequency}</strong></div>
            <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground font-semibold">Last Prophy Hygiene:</span> <strong className="text-foreground">{recall.lastVisit}</strong></div>
            <div className="flex justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground font-semibold">Target Recall Date:</span> <strong className="text-foreground">{recall.dueBy}</strong></div>
            <div className="flex justify-between items-center pt-0.5"><span className="text-muted-foreground font-semibold">Campaign Status:</span> <Badge variant={statusVariant} className="font-bold text-[9px]">{recall.status}</Badge></div>
          </div>
        </div>

        {/* Campaign Triggers */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary mb-1">Campaign Triggers</h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              Auto-generate SMS or Email reminders to alert patient about check-up availability.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              disabled={recall.status === 'Scheduled'}
              onClick={handleSendReminder}
              className="w-full text-xs font-bold gap-1.5 h-10 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Send Reminder SMS/Email
            </Button>
            <Button
              size="sm"
              disabled={recall.status === 'Scheduled'}
              onClick={handleAutoSchedule}
              className="w-full text-xs font-bold gap-1.5 h-10 cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              Auto-Schedule Cleaning
            </Button>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-primary">Campaign History Log</h4>
          
          <div className="relative border-l border-border pl-4 space-y-3">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 bg-primary text-white p-0.5 rounded-full">
                <Check className="h-2 w-2" />
              </div>
              <p className="text-[10px] font-bold text-foreground">Completed Hygiene Visit</p>
              <p className="text-[9px] text-muted-foreground font-semibold">Calculus removal and scaling done on {recall.lastVisit}.</p>
            </div>
            
            {recall.status !== 'Due' && (
              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-amber-500 text-white p-0.5 rounded-full">
                  <Send className="h-2 w-2" />
                </div>
                <p className="text-[10px] font-bold text-foreground">Reminder Dispatch</p>
                <p className="text-[9px] text-muted-foreground font-semibold">Automated check-up text notification dispatched.</p>
              </div>
            )}

            {recall.status === 'Scheduled' && (
              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-emerald-500 text-white p-0.5 rounded-full">
                  <Calendar className="h-2 w-2" />
                </div>
                <p className="text-[10px] font-bold text-foreground">Check-up Booked</p>
                <p className="text-[9px] text-muted-foreground font-semibold">Scheduled for follow-up cleaning on {recall.dueBy}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2E. TAB: CLINICAL NOTES
// ----------------------------------------------------
function ClinicalNotesTab({ patient }) {
  const { notes, saveClinicalNote } = useHygienistStore();
  const toast = useToast();

  const [noteText, setNoteText] = useState(notes[patient.id] || '');
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving', 'Pending'
  const autoSaveTimerRef = useRef(null);

  const hygieneTemplates = [
    {
      name: '-- Choose Template --',
      text: ''
    },
    {
      name: 'Adult Prophylaxis Protocol',
      text: `Medical History: Reviewed. Vitals: Normal. Patient compliant.\nTreatment:\n- Pre-procedural 0.12% Chlorhexidine rinse.\n- Supra & subgingival scaling using ultrasonic scaler & hand scaling.\n- Stain removal using polishing paste.\n- Interdental flossing completed.\n- 5.0% Sodium Fluoride varnish applied.\nOral Hygiene Instructions: Daily flossing emphasized. Return in 6 months.`
    },
    {
      name: 'Periodontal Maintenance Cleaning',
      text: `Medical History: Reviewed. Vitals: Normal.\nTreatment:\n- Conducted complete 6-point perio charting.\n- Localized root scaling on pocketed posterior teeth.\n- Subgingival irrigation with Chlorhexidine rinse.\n- Selective rubber cup polishing.\n- Flossed.\nOral Hygiene Instructions: Electric toothbrush usage reviewed. Re-evaluate perio status in 3 months.`
    },
    {
      name: 'Scaling & Root Planing (SRP)',
      text: `Medical History: Reviewed. Vitals: Normal.\nTreatment:\n- Localized anesthesia administered (1 carpule 2% Lidocaine w/ 1:100k epi).\n- Scaling and root planing (SRP) completed in lower left quadrant.\n- Removal of heavy subgingival calculus deposits.\n- Post-op instructions given. Warned patient of minor sensitivity.\nOral Hygiene Instructions: Warm salt water rinse, soft brush for 48 hours.`
    }
  ];

  const handleApplyTemplate = (e) => {
    const templateText = e.target.value;
    if (templateText) {
      setNoteText(templateText);
      setSaveStatus('Pending');
      triggerAutoSave(templateText);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setNoteText(text);
    setSaveStatus('Pending');
    triggerAutoSave(text);
  };

  const triggerAutoSave = (text) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    setSaveStatus('Saving');
    autoSaveTimerRef.current = setTimeout(() => {
      saveClinicalNote(patient.id, text);
      setSaveStatus('Saved');
    }, 1200); // Simulated auto-save debounce delay of 1.2s
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleManualSave = () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    saveClinicalNote(patient.id, noteText);
    setSaveStatus('Saved');
    toast.success('Clinical hygiene visit note saved manually!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">Clinical Hygiene EHR Notes</h3>
          <p className="text-[11px] text-muted-foreground font-semibold">Write clean clinical notes for the hygiene visit. Form templates auto-fill documentation.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
          {saveStatus === 'Saved' && (
            <span className="text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              All changes saved
            </span>
          )}
          {saveStatus === 'Saving' && (
            <span className="text-primary animate-pulse">
              Saving changes...
            </span>
          )}
          {saveStatus === 'Pending' && (
            <span>
              Pending save
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor (3 columns on lg) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 text-left space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Templates Lookup</label>
              <select
                onChange={handleApplyTemplate}
                className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground"
              >
                {hygieneTemplates.map((t, index) => (
                  <option key={index} value={t.text}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                size="sm"
                onClick={handleManualSave}
                className="h-10 px-5 font-bold text-xs cursor-pointer w-full sm:w-auto"
              >
                Manual Commit Save
              </Button>
            </div>
          </div>

          <textarea
            value={noteText}
            onChange={handleTextChange}
            placeholder="Document hygiene session details, patient compliance, probing changes..."
            className="w-full min-h-[300px] p-4 text-xs font-medium text-foreground bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
        </div>

        {/* Template Tips */}
        <div className="bg-muted/30 border border-border p-4 rounded-2xl text-left space-y-3 h-fit">
          <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider text-primary">EHR Note Standards</h4>
          <ul className="space-y-2.5 text-[11px] text-muted-foreground font-semibold leading-relaxed">
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span>Review systemic medical history changes before procedures.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span>Perform full perio charting at least once per calendar year.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span>Document fluoride applications and patient refusal log.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span>Note home care compliance instructions clearly for dentist check.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. GLOBAL RECALL LIST PAGE
// ----------------------------------------------------
export function HygienistRecallPage() {
  const { recalls, triggerRecallReminder, autoScheduleRecall } = useHygienistStore();
  const toast = useToast();

  const handleSendReminder = (id, name) => {
    triggerRecallReminder(id);
    toast.success(`Recall reminder dispatched to ${name}!`);
  };

  const handleAutoSchedule = (id, name) => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    const dateStr = date.toISOString().split('T')[0];
    autoScheduleRecall(id, dateStr);
    toast.success(`Standard follow-up cleaning booked for ${name} on ${dateStr}!`);
  };

  const columns = [
    { key: 'patientName', header: 'Patient Name', render: (r) => <span className="font-extrabold text-foreground">{r.patientName}</span> },
    { key: 'phone', header: 'Phone' },
    { key: 'frequency', header: 'Frequency' },
    { key: 'lastVisit', header: 'Last Visit Date' },
    { key: 'dueBy', header: 'Due Date' },
    {
      key: 'status',
      header: 'Campaign Status',
      render: (r) => {
        const variant = r.status === 'Scheduled' ? 'success' : r.status === 'Reminded' ? 'warning' : 'destructive';
        return <Badge variant={variant} className="font-bold text-[9px]">{r.status}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Recall Actions',
      align: 'right',
      render: (r) => (
        <div className="flex flex-col sm:flex-row gap-2 justify-end w-full">
          <Button
            size="xs"
            variant="outline"
            disabled={r.status === 'Scheduled'}
            onClick={() => handleSendReminder(r.id, r.patientName)}
            className="font-extrabold text-[10px] h-9 sm:h-8 w-full sm:w-auto justify-center"
          >
            <Send className="h-3 w-3 mr-1" />
            Send Reminder
          </Button>
          <Button
            size="xs"
            disabled={r.status === 'Scheduled'}
            onClick={() => handleAutoSchedule(r.id, r.patientName)}
            className="font-extrabold text-[10px] h-9 sm:h-8 w-full sm:w-auto justify-center"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Auto-Book
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Preventive Recall Campaign Manager
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">Track hygiene compliance, check-up scheduling, and dispatch auto recall campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 columns on lg) */}
        <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-foreground uppercase tracking-wider text-primary">Patients Awaiting Recall Prophy</h3>
          <DataTable columns={columns} data={recalls} searchKey="patientName" searchPlaceholder="Search recall list..." pageSize={10} />
        </div>

        {/* Campaigns & Timeline view (1 column on lg) */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col space-y-5">
          <div>
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wider text-primary">Recall Campaign Performance</h3>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">Preventive care compliance tracking metrics.</p>
          </div>

          {/* Simple circular stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/40 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">Recall Rate</span>
              <span className="text-xl font-black text-primary">76.4%</span>
            </div>
            <div className="p-3 bg-muted/40 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">Compliance</span>
              <span className="text-xl font-black text-emerald-500">89.2%</span>
            </div>
          </div>

          <div className="h-px bg-border/60 my-2" />

          {/* Campaign Timeline log */}
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-foreground uppercase text-[10px] tracking-widest">Active Outreach Timeline</h4>
            <div className="relative border-l border-border pl-4 space-y-4">
              <div className="relative">
                <div className="absolute -left-[20px] top-1 bg-emerald-500 text-white p-0.5 rounded-full">
                  <Check className="h-2.5 w-2.5" />
                </div>
                <div className="font-bold text-foreground">SMS Campaign Dispatched</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Sent to 12 patients with Due status on 2026-06-08.</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[20px] top-1 bg-primary text-white p-0.5 rounded-full">
                  <Users className="h-2.5 w-2.5" />
                </div>
                <div className="font-bold text-foreground">Interactive Callbacks Completed</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Alex Johnson confirmed and auto-booked follow-up visit.</div>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[20px] top-1 bg-slate-300 text-slate-500 p-0.5 rounded-full">
                  <Clock className="h-2.5 w-2.5" />
                </div>
                <div className="font-bold text-foreground">Automated Email Campaign Scheduled</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Next email digest targets pending list on 2026-06-15.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
