import { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Play, Pause, RotateCcw, ShieldCheck, CheckSquare, Clipboard } from 'lucide-react';
import { useDentalAssistantStore } from '../../../store/dentalAssistantStore';
import { Button } from '../../../shared/ui/Button';

export function ChairsideToolsPage() {
  const { todayPatients, activePatientId, chairsideTasks, toggleTaskStatus } = useDentalAssistantStore();

  const activePatient = useMemo(() => todayPatients.find((p) => p.id === activePatientId), [todayPatients, activePatientId]);

  const patientTasks = useMemo(() => {
    return chairsideTasks[activePatientId] || [];
  }, [chairsideTasks, activePatientId]);

  // Group tasks by category
  const sterilizationTasks = useMemo(() => patientTasks.filter(t => t.category === 'Sterilization'), [patientTasks]);
  const instrumentTasks = useMemo(() => patientTasks.filter(t => t.category === 'Instrument'), [patientTasks]);
  const stageTasks = useMemo(() => patientTasks.filter(t => t.category === 'Stage'), [patientTasks]);

  // Procedure stage selector state
  const [activeStage, setActiveStage] = useState('Prep'); // 'Intake', 'Prep', 'Assist', 'Post-Op'

  // Procedure Timer State
  const [time, setTime] = useState(0); // in seconds
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTime(0);
    setTimerOn(false);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
          <Activity className="h-6 w-6 text-primary" />
          Chairside Assisting Workspace
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Access real-time checklists, track instrument preparation, stage procedure progression, and monitor times.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Checklists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sterilization Checklist */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Sanitization & Sterilization Checklist
            </h3>

            {sterilizationTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">Select a patient context to load sterilization checklist.</p>
            ) : (
              <div className="space-y-3">
                {sterilizationTasks.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-start gap-3 p-3 bg-muted/20 hover:bg-muted/40 border border-border/60 hover:border-border rounded-xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTaskStatus(activePatientId, t.id)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className={`text-xs font-semibold ${t.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {t.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Instrument Tracking */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              Instrument Setup & Trays Tracking
            </h3>

            {instrumentTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">Select a patient context to load instrument checklist.</p>
            ) : (
              <div className="space-y-3">
                {instrumentTasks.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-start gap-3 p-3 bg-muted/20 hover:bg-muted/40 border border-border/60 hover:border-border rounded-xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTaskStatus(activePatientId, t.id)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className={`text-xs font-semibold ${t.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {t.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status & Timer */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Patient & Stage */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-foreground">Active Visit Stage</h3>

            {activePatient ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Patient Name</span><span className="font-extrabold text-foreground">{activePatient.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Assigned Dentist</span><span className="font-extrabold text-foreground">{activePatient.dentistName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Treatment Stage</span><span className="font-extrabold text-primary">{activePatient.treatmentType}</span></div>
                </div>

                {/* Procedure stage progression buttons */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Set Current Stage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Intake', 'Prep', 'Assist', 'Post-Op'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setActiveStage(stage)}
                        className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                          activeStage === stage
                            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                            : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Local stage checklist checklist */}
                <div className="space-y-2 border-t border-border/60 pt-3">
                  {stageTasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 py-1 text-xs">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTaskStatus(activePatientId, t.id)}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className={`font-semibold ${t.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {t.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-500 font-bold">Please select active patient context.</p>
            )}
          </div>

          {/* Procedure Timer Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
              <Clipboard className="h-4 w-4 text-primary" />
              Assisting Session Timer
            </h3>

            <div className="flex flex-col items-center justify-center py-4 bg-muted/30 border border-border rounded-xl space-y-4">
              <div className="text-4xl font-black font-mono tracking-widest text-foreground select-none">
                {formatTime(time)}
              </div>

              <div className="flex gap-2">
                {timerOn ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTimerOn(false)}
                    className="font-bold text-xs gap-1 border-amber-500/20 text-amber-500 hover:bg-amber-500/10 cursor-pointer h-9 px-4"
                  >
                    <Pause className="h-4 w-4" /> Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setTimerOn(true)}
                    className="font-bold text-xs gap-1 cursor-pointer h-9 px-4"
                  >
                    <Play className="h-4 w-4" /> Start
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetTimer}
                  className="font-bold text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer h-9 px-3"
                  disabled={time === 0}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChairsideToolsPage;
