import { useState, useMemo } from 'react';
import { Image, Upload, Plus, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useDentalAssistantStore } from '../../../store/dentalAssistantStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';

export function XrayUploadPage() {
  const { todayPatients, activePatientId, xrayUploads, uploadXray } = useDentalAssistantStore();
  const toast = useToast();

  const [xrayType, setXrayType] = useState('Bitewing');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const activePatient = useMemo(() => todayPatients.find((p) => p.id === activePatientId), [todayPatients, activePatientId]);

  // Filter X-rays by active patient
  const patientXrays = useMemo(() => {
    return xrayUploads.filter((x) => x.patientId === activePatientId);
  }, [xrayUploads, activePatientId]);

  // Handle mock file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Create a mock preview (since they are image files)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!activePatientId) {
      toast.error('Please select an active patient context first.');
      return;
    }
    if (!fileName) {
      toast.error('Please select a radiograph file to upload.');
      return;
    }

    uploadXray(activePatientId, {
      type: xrayType,
      name: fileName,
      notes
    });

    toast.success(`Successfully uploaded ${xrayType} radiograph for ${activePatient?.name || 'patient'}.`);
    
    // Reset form
    setFileName('');
    setNotes('');
    setFilePreview(null);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
          <Image className="h-6 w-6 text-primary" />
          Radiography & X-Ray Upload
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Capture chairside radiographs, tag X-ray scan classifications, and sync to Dentist diagnostic chart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Area */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground">Upload Scan</h3>
          
          {activePatient ? (
            <div className="p-3 bg-muted border border-border rounded-xl text-xs font-semibold leading-normal">
              Uploading for: <strong className="text-foreground">{activePatient.name}</strong>
              <div className="text-[10px] text-muted-foreground mt-0.5">Dentist: {activePatient.dentistName} · Procedure: {activePatient.treatmentType}</div>
            </div>
          ) : (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="h-4 w-4" /> Please select a patient header context.
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-semibold">
            {/* X-ray type selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">X-Ray Classification *</label>
              <select
                value={xrayType}
                onChange={(e) => setXrayType(e.target.value)}
                className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground"
              >
                {['Bitewing', 'Panoramic', 'Periapical', 'CBCT'].map((t) => (
                  <option key={t} value={t}>{t} scan</option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Simulated Dropzone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Select Radiograph File *</label>
              <div className="border border-dashed border-border hover:border-primary bg-muted/30 hover:bg-muted/60 rounded-xl p-6 text-center transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                
                {filePreview ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <img
                      src={filePreview}
                      alt="X-ray preview"
                      className="h-24 w-24 object-cover rounded-lg border border-border shadow-sm"
                    />
                    <p className="text-[10px] font-bold text-emerald-500 truncate max-w-xs">{fileName}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                    <p className="text-xs text-foreground font-bold">Drag files here or click to browse</p>
                    <p className="text-[9px] text-muted-foreground">Supports PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Note input */}
            <Input
              label="Diagnosis notes / Observations"
              placeholder="e.g. Clear bone levels, check distal caries on #14..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs font-medium"
            />

            <Button
              type="submit"
              className="w-full h-10 gap-1.5 font-bold cursor-pointer"
              disabled={!activePatientId || !fileName}
            >
              <Plus className="h-4 w-4" /> Save Radiograph
            </Button>
          </form>
        </div>

        {/* Scan Gallery Area */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-foreground">Radiographs Gallery</h3>
            {activePatient && (
              <span className="text-[9px] font-bold bg-muted border border-border px-2.5 py-0.5 rounded-full uppercase text-muted-foreground">
                {activePatient.name}
              </span>
            )}
          </div>

          {patientXrays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2 stroke-1" />
              <p className="text-xs font-bold">No radiographs loaded</p>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">Upload a scan for this patient to build history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patientXrays.map((x) => (
                <div key={x.id} className="border border-border/80 bg-muted/30 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center relative group">
                    {/* Simulated Radiograph Image */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300')` }} />
                    
                    {/* Diagnostic overlay */}
                    <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
                    
                    <div className="absolute top-2 left-2">
                      <span className="text-[8px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-md shadow-sm">
                        {x.type}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="text-[8px] font-semibold text-white bg-slate-900/80 px-2 py-0.5 rounded-md shadow-sm">
                        {x.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate max-w-[180px]">{x.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                      {x.notes || 'No notes added.'}
                    </p>
                    <div className="flex items-center gap-1 border-t border-border/40 pt-2 text-[9px] font-bold text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Synced to dentist chart</span>
                    </div>
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
export default XrayUploadPage;
