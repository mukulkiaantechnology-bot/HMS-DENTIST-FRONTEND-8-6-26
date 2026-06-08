import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDentalAssistantStore } from '../../../store/dentalAssistantStore';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';

export function TodayPatientsPage() {
  const navigate = useNavigate();
  const { todayPatients, setActivePatientId, updatePatientStatus } = useDentalAssistantStore();
  const [filter, setFilter] = useState('All');

  const filteredPatients = todayPatients.filter((p) => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  const handleOpenWorkspace = (id) => {
    setActivePatientId(id);
    navigate('/assistant/chairside');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Waiting':
        return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[10px]">Waiting (Pending)</Badge>;
      case 'In Treatment':
        return <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold text-[10px] animate-pulse">In Treatment</Badge>;
      case 'Completed':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[10px]">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header section */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <Users className="h-6 w-6 text-primary" />
            Today's Assigned Patients
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Track, update visit status, and launch chairside assistance workspaces.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex p-0.5 bg-muted rounded-xl border border-border w-fit">
          {['All', 'Waiting', 'In Treatment', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                filter === s
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Grid */}
      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3 stroke-1" />
          <h3 className="text-sm font-bold text-foreground">No patients found</h3>
          <p className="text-xs text-muted-foreground font-semibold mt-1">There are no patients matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-primary/30 relative overflow-hidden group text-left"
            >
              {/* Glassmorphism top tint for active patient */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Patient ID: #{p.id} · Age {p.age}
                    </span>
                  </div>
                  {getStatusBadge(p.status)}
                </div>

                <div className="h-px bg-border/60" />

                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Dentist:</span>
                    <span className="text-foreground">{p.dentistName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Procedure type:</span>
                    <span className="text-primary font-bold">{p.treatmentType}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2">
                {p.status === 'Waiting' && (
                  <Button
                    size="xs"
                    variant="outline"
                    className="font-extrabold text-[10px] h-8 gap-1 text-blue-500 border-blue-500/20 hover:bg-blue-500/10 cursor-pointer"
                    onClick={() => updatePatientStatus(p.id, 'In Treatment')}
                  >
                    <Play className="h-3 w-3" /> Start Care
                  </Button>
                )}
                {p.status === 'In Treatment' && (
                  <Button
                    size="xs"
                    variant="outline"
                    className="font-extrabold text-[10px] h-8 gap-1 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 cursor-pointer"
                    onClick={() => updatePatientStatus(p.id, 'Completed')}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </Button>
                )}

                <Button
                  size="xs"
                  className="font-extrabold text-[10px] h-8 gap-1 ml-auto cursor-pointer"
                  onClick={() => handleOpenWorkspace(p.id)}
                >
                  Workspace
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TodayPatientsPage;
