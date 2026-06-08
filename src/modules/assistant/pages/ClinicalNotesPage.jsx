import { useState, useMemo } from 'react';
import { FileText, Save, AlertCircle, CheckCircle2, Clipboard } from 'lucide-react';
import { useDentalAssistantStore } from '../../../store/dentalAssistantStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';

const NOTE_TEMPLATES = {
  cleaning: {
    label: 'Cleaning Support Template',
    text: 'Pre-procedural chlorhexidine rinse administered. Conducted intake and vitals audit. Assisted dentist during scaling and fine paste prophy polishing. Flossed. Pt advised on interproximal cleaning.'
  },
  surgery: {
    label: 'Surgery Assistance Template',
    text: 'Assisted in local anesthesia administration (Lidocaine block). Maintained high-volume suction and tongue/cheek retraction during extraction. Monitored vital signs. Placed sterile gauze post-op.'
  },
  xray: {
    label: 'X-Ray Observation Template',
    text: 'Conducted panoramic and right bitewing scan series. Scans uploaded to patient record. Noted slight bone recession on posterior molar region, flagged for dentist diagnostic review.'
  }
};

export function ClinicalNotesPage() {
  const { todayPatients, activePatientId, clinicalNotes, saveAssistantNote } = useDentalAssistantStore();
  const toast = useToast();

  const activePatient = useMemo(() => todayPatients.find((p) => p.id === activePatientId), [todayPatients, activePatientId]);

  const patientNotesHistory = useMemo(() => {
    return clinicalNotes[activePatientId] || [];
  }, [clinicalNotes, activePatientId]);

  // Form State
  const [dentistName, setDentistName] = useState('Dr. Michael Chen');
  const [procedureType, setProcedureType] = useState(() => activePatient?.treatmentType || 'General Dental');
  const [observations, setObservations] = useState('');
  
  // Actions Checkboxes
  const [actions, setActions] = useState({
    sterilization: true,
    instruments: true,
    suction: false,
    briefing: false
  });

  const handleApplyTemplate = (type) => {
    const template = NOTE_TEMPLATES[type];
    if (template) {
      setObservations(template.text);
      toast.info(`Applied: ${template.label}`);
    }
  };

  const handleToggleAction = (key) => {
    setActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!activePatientId) {
      toast.error('Select a patient context first.');
      return;
    }
    if (!observations.trim()) {
      toast.error('Observations note text cannot be empty.');
      return;
    }

    const selectedActions = [];
    if (actions.sterilization) selectedActions.push('Sterilization completed');
    if (actions.instruments) selectedActions.push('Instruments prepped');
    if (actions.suction) selectedActions.push('Suction maintained');
    if (actions.briefing) selectedActions.push('Patient post-op briefing');

    saveAssistantNote(activePatientId, {
      dentistName,
      procedureType: activePatient?.treatmentType || procedureType,
      observations,
      actions: selectedActions
    });

    toast.success(`Chairside clinical note synced to dentist chart for ${activePatient?.name || 'patient'}.`);
    
    // Clear observations input
    setObservations('');
    setActions({
      sterilization: true,
      instruments: true,
      suction: false,
      briefing: false
    });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
          <FileText className="h-6 w-6 text-primary" />
          Chairside Clinical Notes
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Document assistant visit observations, apply pre-made templates, and sync notes to the main Dentist record.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground">New Clinical Entry</h3>

          {activePatient ? (
            <div className="p-3 bg-muted border border-border rounded-xl text-xs font-semibold">
              Recording observations for: <strong className="text-foreground">{activePatient.name}</strong>
              <div className="text-[10px] text-muted-foreground mt-0.5">Dentist: {activePatient.dentistName} · Procedure: {activePatient.treatmentType}</div>
            </div>
          ) : (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="h-4 w-4" /> Select a patient context first.
            </div>
          )}

          {/* Quick Templates Panel */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleApplyTemplate('cleaning')} className="px-3 py-1.5 bg-muted hover:bg-muted/80 border border-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer transition-colors">
                🧼 Hygiene / Cleaning
              </button>
              <button type="button" onClick={() => handleApplyTemplate('surgery')} className="px-3 py-1.5 bg-muted hover:bg-muted/80 border border-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer transition-colors">
                🦷 Surgical Assist
              </button>
              <button type="button" onClick={() => handleApplyTemplate('xray')} className="px-3 py-1.5 bg-muted hover:bg-muted/80 border border-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer transition-colors">
                🩻 Radiograph Obs
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveNote} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Dentist Provider" value={dentistName} onChange={(e) => setDentistName(e.target.value)} className="text-xs font-medium" />
              <Input label="Procedure category" value={activePatient?.treatmentType || procedureType} onChange={(e) => setProcedureType(e.target.value)} disabled={!!activePatient} className="text-xs font-medium" />
            </div>

            {/* Observations text area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Clinical Observations & notes *</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Enter chairside clinical observations..."
                rows={5}
                className="w-full text-xs font-medium bg-muted border border-border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                required
              />
            </div>

            {/* Assistant Actions Checklist */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Assistant Actions Undertaken</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'sterilization', label: 'Sterilization completed' },
                  { key: 'instruments', label: 'Instruments prepped' },
                  { key: 'suction', label: 'Suction maintained' },
                  { key: 'briefing', label: 'Patient post-op briefing' }
                ].map((act) => (
                  <label key={act.key} className="flex items-center gap-2.5 p-2.5 bg-muted/30 border border-border/60 hover:border-border rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={actions[act.key]}
                      onChange={() => handleToggleAction(act.key)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-foreground">{act.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Sync button */}
            <Button
              type="submit"
              className="w-full h-10 gap-1.5 font-bold cursor-pointer"
              disabled={!activePatientId || !observations.trim()}
            >
              <Save className="h-4 w-4" /> Save & Sync to dentist EHR Chart
            </Button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
            <Clipboard className="h-4 w-4 text-primary" />
            Assistant Notes History
          </h3>

          {patientNotesHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2 stroke-1" />
              <p className="text-xs font-bold">No chairside entries</p>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">Submit note above to sync to patient records.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {patientNotesHistory.map((note) => (
                <div key={note.id} className="p-3 bg-muted/40 border border-border rounded-xl space-y-2 text-[11px] text-left">
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground font-bold border-b border-border/40 pb-1.5">
                    <span>{note.date}</span>
                    <span className="text-primary font-black uppercase">{note.procedureType}</span>
                  </div>
                  <p className="font-semibold text-foreground leading-normal">{note.observations}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/40">
                    {note.actions.map(act => (
                      <span key={act} className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {act.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 pt-1 text-[8px] font-black text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Synced to main dentist file</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ClinicalNotesPage;
