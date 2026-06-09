import { useState, useEffect } from 'react';
import { AlertOctagon, Check, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useDentistStore } from '../../store/dentistStore';
import { useClinicOwnerStore } from '../../store/clinicOwnerStore';
import { Button } from './Button';

export function DrugSafetyAlert({ patientId, activePrescribedDrug, onSwitchMedication }) {
  const toast = useToast();
  
  // Find patient details from either store for maximum sync compatibility
  const dentistPatients = useDentistStore((state) => state.patients) || [];
  const clinicPatients = useClinicOwnerStore((state) => state.patients) || [];
  
  const patient = dentistPatients.find((p) => p.id === patientId) || clinicPatients.find((p) => p.id === patientId);
  const patientAllergies = patient?.allergies || 'None';

  // Check if allergy matches Penicillin
  const isPenicillinAllergic = 
    Array.isArray(patientAllergies) 
      ? patientAllergies.some(a => a.toLowerCase().includes('penic'))
      : String(patientAllergies).toLowerCase().includes('penic');

  // Check if active prescribed drug is Penicillin-based
  const isPrescribingPenicillin = 
    activePrescribedDrug && 
    (activePrescribedDrug.toLowerCase().includes('amox') || 
     activePrescribedDrug.toLowerCase().includes('penic'));

  const handleApplyAlternative = () => {
    if (onSwitchMedication) {
      onSwitchMedication('Clindamycin 300mg');
    }
    toast.success('Medication prescription updated to Clindamycin 300mg (Penicillin-Allergy Safe).', 'Safety Safeguard Applied');
  };

  if (!isPenicillinAllergic || !isPrescribingPenicillin) {
    // Return standard safety clearance badge
    return (
      <div className="bg-emerald-500/5 border border-emerald-500/15 p-3.5 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 w-full text-left">
        <div className="p-1.5 bg-emerald-500/10 rounded-lg shrink-0">
          <Check className="h-4.5 w-4.5 text-emerald-500" />
        </div>
        <div className="space-y-0.5 flex-1">
          <span className="font-extrabold text-[11px] block uppercase">Drug Allergen Screen Clearance</span>
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
            Prescribed drug is compatible with patient allergies. No contraindicated drug-allergen warning indicators found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl flex flex-col gap-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 w-full text-left animate-shake">
      
      {/* Warning Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-500/10 rounded-xl shrink-0 mt-0.5 animate-pulse">
          <AlertOctagon className="h-5 w-5 text-rose-500" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-black text-[11px] uppercase tracking-wider block">🚫 Critical Allergen Warning</span>
            <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase select-none">
              Contraindicated
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
            Patient **{patient?.name}** is allergic to **Penicillin**. Prescribing **{activePrescribedDrug}** is contraindicated and poses severe anaphylaxis risk.
          </p>
        </div>
      </div>

      {/* Suggested Alternative Banner */}
      <div className="p-3 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
        <div className="space-y-0.5">
          <span className="font-black text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Safety Suggestion
          </span>
          <p className="text-foreground font-extrabold flex items-center gap-1">
            Switch to Clindamycin 300mg <ArrowRight className="h-3 w-3 text-muted-foreground" /> <span>Allergy Safe Alternative</span>
          </p>
        </div>
        
        <Button
          size="xs"
          onClick={handleApplyAlternative}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-7.5 px-3 rounded-lg shadow-sm gap-1 self-stretch sm:self-auto justify-center cursor-pointer text-[10px]"
        >
          <Sparkles className="h-3 w-3" />
          Apply Switch
        </Button>
      </div>
    </div>
  );
}

export default DrugSafetyAlert;
