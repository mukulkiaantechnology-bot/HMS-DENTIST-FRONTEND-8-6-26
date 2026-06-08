import { useState } from 'react';
import {
  FileText,
  Activity,
  Image as ImageIcon,
  Truck,
  Upload,
  Layers,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { usePatientStore } from '../../../store/patientStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';

// Mock X-Rays
const MOCK_XRAYS = [
  { id: 'xr-1', label: 'Panoramic Radiograph', date: '2026-05-14', url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=400' },
  { id: 'xr-2', label: 'Bitewing Right Posterior', date: '2026-05-14', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400' },
  { id: 'xr-3', label: 'Periapical Tooth #14', date: '2026-04-20', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400' }
];

// Mock Lab Cases
const INITIAL_LAB_CASES = [
  { id: 'lab-101', patientName: 'Alice Henderson', appliance: 'Crown Tooth #3 (Zirconia)', labName: 'Pacific Dental Lab', status: 'In Fabrication', dueDate: '2026-06-12' },
  { id: 'lab-102', patientName: 'Robert Vance', appliance: 'Night Guard Custom', labName: 'Elite Ortho Labs', status: 'Sent', dueDate: '2026-06-15' },
  { id: 'lab-103', patientName: 'Chloe Sinclair', appliance: 'Invisalign Aligners Set 1-10', labName: 'Align Technologies', status: 'Received', dueDate: '2026-06-08' }
];

export function ClinicalPage() {
  const user = useAuthStore((state) => state.user);
  const patients = usePatientStore((state) => state.patients);
  const toast = useToast();

  const [activeTab, setActiveTab] = useState(() => {
    if (user?.role === 'lab_coordinator') return 'lab';
    if (user?.role === 'assistant') return 'imaging';
    return 'notes';
  });

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [noteTemplate, setNoteTemplate] = useState('exam');
  const [clinicalNote, setClinicalNote] = useState('');
  
  // Perio Chart State (Teeth 1-32, buccal pocket depths)
  const [perioData, setPerioData] = useState(() => {
    const data = {};
    for (let i = 1; i <= 32; i++) {
      data[i] = [3, 2, 3]; // Default healthy pocket depths (mm)
    }
    return data;
  });

  // Treatment Plan checklist state
  const [treatmentPlans, setTreatmentPlans] = useState([
    { id: 'tp-1', description: 'Composite Filling Tooth #14', cost: 240, status: 'Planned' },
    { id: 'tp-2', description: 'Prophylaxis Adult Cleaning', cost: 110, status: 'Completed' },
    { id: 'tp-3', description: 'Crown Preparation Tooth #3', cost: 1200, status: 'In Progress' }
  ]);
  const [newPlanText, setNewPlanText] = useState('');
  const [newPlanCost, setNewPlanCost] = useState('150');

  // Lab Cases State
  const [labCases] = useState(INITIAL_LAB_CASES);

  // X-Ray upload state simulator
  const [xrays, setXrays] = useState(MOCK_XRAYS);

  // Templates text mappings
  const handleTemplateChange = (e) => {
    const type = e.target.value;
    setNoteTemplate(type);
    if (type === 'exam') {
      setClinicalNote(
        `COMPREHENSIVE EXAM:\n- Chief Complaint: General Checkup\n- Soft Tissue: WNL (Within Normal Limits)\n- Occlusion: Class I\n- Perio: Mild gingivitis, localized pocketing of 4mm on molars.\n- Plan: Recall 6 months.`
      );
    } else if (type === 'cleaning') {
      setClinicalNote(
        `PROPHYLAXIS / HYGIENE:\n- Plaque/Calculus: Light to Moderate\n- Scaling: Hand scaling completed.\n- Polishing: Prophy paste coarse mint.\n- Fluoride: Varnish applied.\n- Patient Ed: Re-instructed on flossing molar areas.`
      );
    } else if (type === 'endo') {
      setClinicalNote(
        `ENDODONTIC TREATMENT:\n- Diagnosis: Irreversible Pulpitis #14\n- Anesthesia: 1 carpule Lidocaine 2% with 1:100k epi.\n- Access: Obtained through occlusal.\n- Working Lengths: MB 19mm, DB 18.5mm, P 21mm.\n- Irrigation: NaOCl 2.5%.\n- Temporary: Cavit applied.`
      );
    }
  };

  // Save Notes Action
  const handleSaveNote = () => {
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;
    toast.success(`Clinical note successfully saved to ${patient.name}'s medical chart.`);
  };

  // Edit Tooth Pocket Depth
  const handlePerioChange = (toothNum, index, value) => {
    setPerioData((prev) => ({
      ...prev,
      [toothNum]: prev[toothNum].map((val, idx) => (idx === index ? Math.max(1, Math.min(9, value)) : val))
    }));
  };

  // Add Treatment Plan item
  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!newPlanText) return;
    setTreatmentPlans((prev) => [
      ...prev,
      {
        id: `tp-${Date.now()}`,
        description: newPlanText,
        cost: Number(newPlanCost) || 0,
        status: 'Planned'
      }
    ]);
    setNewPlanText('');
    toast.success('New treatment procedure added to patient plan.');
  };

  // Toggle treatment status
  const handleTogglePlanStatus = (id) => {
    setTreatmentPlans((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'Planned' ? 'In Progress' : item.status === 'In Progress' ? 'Completed' : 'Planned';
        return { ...item, status: nextStatus };
      })
    );
  };

  // Mock Upload X-Ray
  const handleXrayUpload = () => {
    const name = prompt('Enter X-Ray label/name:');
    if (!name) return;
    setXrays((prev) => [
      {
        id: `xr-${Date.now()}`,
        label: name,
        date: new Date().toISOString().split('T')[0],
        url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400'
      },
      ...prev
    ]);
    toast.success(`X-Ray Scan "${name}" uploaded successfully.`);
  };

  // Check tab permissions
  const tabs = [
    { id: 'notes', label: 'EHR Chart Notes', icon: FileText, allowedRoles: ['super_admin', 'clinic_owner', 'dentist', 'hygienist'] },
    { id: 'perio', label: 'Periodontic Chart', icon: Activity, allowedRoles: ['super_admin', 'clinic_owner', 'dentist', 'hygienist'] },
    { id: 'treatment', label: 'Treatment Plans', icon: Layers, allowedRoles: ['super_admin', 'clinic_owner', 'dentist'] },
    { id: 'imaging', label: 'Imaging & Scans', icon: ImageIcon, allowedRoles: ['super_admin', 'clinic_owner', 'dentist', 'hygienist', 'assistant'] },
    { id: 'lab', label: 'Lab Cases Tracker', icon: Truck, allowedRoles: ['super_admin', 'clinic_owner', 'dentist', 'lab_coordinator'] }
  ];

  const allowedTabs = tabs.filter((t) => t.allowedRoles.includes(user?.role || ''));

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Clinical Workspace</h1>
        <p className="text-sm text-muted-foreground font-semibold mt-1">
          Access diagnostic imaging panels, EHR notes, periodontal charts, and prosthetic lab orders.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-px overflow-x-auto select-none">
        {allowedTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm min-h-[50vh]">
        {/* Tab 1: EHR Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider mb-2">EHR Clinical Progress Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Active Patient File"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                options={patients.map((p) => ({ value: p.id, label: p.name }))}
              />
              <Select
                label="Clinical Template"
                value={noteTemplate}
                onChange={handleTemplateChange}
                options={[
                  { value: 'exam', label: 'Standard Hygiene Exam' },
                  { value: 'cleaning', label: 'Prophylaxis/Scaling Note' },
                  { value: 'endo', label: 'Endodontic Root Canal' }
                ]}
              />
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note Editor</label>
              <textarea
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                className="w-full h-64 bg-card border border-border rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all leading-relaxed"
                placeholder="Select a template or begin typing progress notes..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveNote} className="gap-2 select-none font-bold">
                <Save className="h-4 w-4" />
                Sign & Save Note
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Periodontal Charting */}
        {activeTab === 'perio' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-foreground uppercase tracking-wider mb-1">Periodontal Examination Chart</h3>
              <p className="text-xs text-muted-foreground font-semibold">Measure buccal pocket depth millimeters (normal range 1-3mm, edit measurements below).</p>
            </div>

            {/* Teeth Grid */}
            <div className="space-y-6">
              {/* Maxillary Arch (1-16) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Maxillary Arch (Upper Teeth 1-16)</span>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-2 border border-border/60 p-3 bg-muted/10 rounded-xl overflow-x-auto">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((tNum) => (
                    <div key={tNum} className="flex flex-col items-center gap-1.5 p-1 bg-card border border-border rounded-lg min-w-[36px]">
                      <span className="text-[10px] font-bold text-primary">#{tNum}</span>
                      <div className="flex flex-col gap-1">
                        {perioData[tNum].map((val, idx) => (
                          <input
                            key={idx}
                            type="number"
                            min="1"
                            max="9"
                            value={val}
                            onChange={(e) => handlePerioChange(tNum, idx, Number(e.target.value))}
                            className={`w-6 h-6 text-center text-xs font-bold border border-border rounded-md outline-none cursor-pointer focus:ring-1 focus:ring-ring ${
                              val >= 4 ? 'bg-destructive/10 text-destructive' : 'bg-success/5 text-success'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandibular Arch (17-32) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mandibular Arch (Lower Teeth 17-32)</span>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-2 border border-border/60 p-3 bg-muted/10 rounded-xl overflow-x-auto">
                  {Array.from({ length: 16 }, (_, i) => i + 17).map((tNum) => (
                    <div key={tNum} className="flex flex-col items-center gap-1.5 p-1 bg-card border border-border rounded-lg min-w-[36px]">
                      <span className="text-[10px] font-bold text-primary">#{tNum}</span>
                      <div className="flex flex-col gap-1">
                        {perioData[tNum].map((val, idx) => (
                          <input
                            key={idx}
                            type="number"
                            min="1"
                            max="9"
                            value={val}
                            onChange={(e) => handlePerioChange(tNum, idx, Number(e.target.value))}
                            className={`w-6 h-6 text-center text-xs font-bold border border-border rounded-md outline-none cursor-pointer focus:ring-1 focus:ring-ring ${
                              val >= 4 ? 'bg-destructive/10 text-destructive' : 'bg-success/5 text-success'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-border/60 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground font-semibold leading-relaxed">
                Pocket depths of 4mm or higher are automatically flagged in <span className="text-destructive font-bold">red</span> indicating clinical bone loss / perio pockets. Normal depth is under 4mm, highlighted in <span className="text-success font-bold">green</span>.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Treatment Plans */}
        {activeTab === 'treatment' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider mb-2">Patient Treatment Planner</h3>
            
            {/* Add item */}
            <form onSubmit={handleAddPlan} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <Input
                label="Procedure Description"
                placeholder="e.g. Resin Composite #12 Buccal"
                value={newPlanText}
                onChange={(e) => setNewPlanText(e.target.value)}
              />
              <Input
                label="Estimated Fee ($)"
                type="number"
                value={newPlanCost}
                onChange={(e) => setNewPlanCost(e.target.value)}
              />
              <Button type="submit" className="h-10 select-none">
                Add Procedure
              </Button>
            </form>

            {/* List */}
            <div className="space-y-3 mt-4">
              {treatmentPlans.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTogglePlanStatus(item.id)}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className={`h-5 w-5 transition-colors ${
                        item.status === 'Completed'
                          ? 'text-success fill-success/10'
                          : item.status === 'In Progress'
                          ? 'text-info fill-info/10'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{item.description}</h5>
                      <span className="text-[10px] text-muted-foreground font-semibold">Estimated cost: ${item.cost}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.status === 'Completed'
                        ? 'success'
                        : item.status === 'In Progress'
                        ? 'info'
                        : 'secondary'
                    }
                    className="text-[10px] font-semibold py-0.5 px-2"
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Imaging & Scans */}
        {activeTab === 'imaging' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground uppercase tracking-wider">Imaging Cabinet</h3>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">Upload dental radiographs, bitewings, or panoramic X-ray imagery.</p>
              </div>
              <Button onClick={handleXrayUpload} className="gap-2 select-none">
                <Upload className="h-4 w-4" />
                Upload Radiograph Scan
              </Button>
            </div>

            {/* X-Ray Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {xrays.map((xr) => (
                <div key={xr.id} className="border border-border rounded-xl bg-muted/10 overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-48 bg-black overflow-hidden flex items-center justify-center">
                    <img
                      src={xr.url}
                      alt={xr.label}
                      className="max-h-full max-w-full object-contain filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-xs font-bold text-white tracking-wide truncate">{xr.label}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-card flex justify-between items-center text-xs font-semibold text-muted-foreground border-t border-border">
                    <span>Uploaded: {xr.date}</span>
                    <Badge variant="secondary" className="text-[9px]">DICOM format</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Lab Cases */}
        {activeTab === 'lab' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider mb-2">Prosthetic Lab Order Tracking</h3>
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Case ID</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Appliance Details</th>
                    <th className="py-3 px-4 font-semibold">Target Laboratory</th>
                    <th className="py-3 px-4 font-semibold">Shipment Stage</th>
                    <th className="py-3 px-4 font-semibold">Est. Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {labCases.map((lc) => (
                    <tr key={lc.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-bold text-primary">{lc.id}</td>
                      <td className="py-3 px-4 font-bold">{lc.patientName}</td>
                      <td className="py-3 px-4 font-semibold">{lc.appliance}</td>
                      <td className="py-3 px-4 text-xs font-semibold text-muted-foreground">{lc.labName}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            lc.status === 'Received'
                              ? 'success'
                              : lc.status === 'In Fabrication'
                              ? 'info'
                              : 'warning'
                          }
                          className="text-[10px] font-semibold py-0.5 px-2"
                        >
                          {lc.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-muted-foreground">{lc.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ClinicalPage;
