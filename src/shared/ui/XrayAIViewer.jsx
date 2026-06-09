import { useState } from 'react';
import { Eye, EyeOff, Sparkles, RefreshCw, AlertCircle, FileText, Check } from 'lucide-react';
import { Button } from './Button';

export function XrayAIViewer({ patientName = 'Selected Patient', onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [showCaries, setShowCaries] = useState(true);
  const [showCrowns, setShowCrowns] = useState(true);
  const [showBoneLoss, setShowBoneLoss] = useState(true);
  
  // Custom mock file states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('bitewing_molar_audit.png');

  const handleRunAI = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      if (onScanComplete) {
        onScanComplete('AI Audit Generated: Radiolucency on distal sector #14. Bordering margins standard.');
      }
    }, 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile(reader.result);
        setHasScanned(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5 text-left w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div>
          <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
            AI Radiograph Analyzer
          </h4>
          <p className="text-[10px] text-muted-foreground font-semibold">
            Computed vision diagnostics for bone level, margins, and caries auditing.
          </p>
        </div>
        
        {/* Upload Button */}
        <label className="relative flex items-center justify-center h-8 px-3 rounded-lg border border-border bg-muted/50 hover:bg-muted text-[10px] font-bold text-foreground cursor-pointer transition-all self-start sm:self-auto">
          <span>Change Radiograph File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      {/* Main Grid: Viewer + Overlays Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Canvas displaying the radiograph */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-slate-950 rounded-xl aspect-video border border-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner select-none group">
            {/* Visual background radiograph representation */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 filter saturate-0 contrast-125 brightness-90 transition-opacity duration-300"
              style={{
                backgroundImage: uploadedFile 
                  ? `url('${uploadedFile}')`
                  : `url('https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600')`
              }}
            />

            {/* Neural scanning light line sweeper */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_10px_var(--color-primary)] z-25 animate-scanner pointer-events-none" />
            )}

            {/* Blue medical gradient lens overlay */}
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay pointer-events-none z-10" />

            {/* Dynamic CSS teeth templates with bounding highlights */}
            {hasScanned && (
              <div className="absolute inset-0 z-20 flex justify-center items-center gap-6 px-12">
                
                {/* Tooth #3 - Crown */}
                {showCrowns && (
                  <div
                    className="absolute w-12 h-14 border-2 border-emerald-500 bg-emerald-500/10 rounded-lg flex items-center justify-center transition-all animate-pulse"
                    style={{ left: '15%', top: '38%' }}
                    title="Tooth #3: Healthy PFM Crown"
                  >
                    <span className="text-[8px] bg-slate-950 text-emerald-400 font-extrabold px-1 py-0.5 rounded shadow-sm">#3 PFM</span>
                  </div>
                )}

                {/* Tooth #14 - Occlusal Caries */}
                {showCaries && (
                  <div
                    className="absolute w-14 h-14 border-2 border-rose-500 bg-rose-500/20 rounded-lg flex items-center justify-center transition-all animate-pulse-fast"
                    style={{ left: '46%', top: '35%' }}
                    title="Tooth #14: Occlusal Caries (96.8% Confidence)"
                  >
                    <span className="text-[8px] bg-slate-950 text-rose-400 font-extrabold px-1 py-0.5 rounded shadow-sm">#14 Caries</span>
                  </div>
                )}

                {/* Tooth #19 - Bone Loss */}
                {showBoneLoss && (
                  <div
                    className="absolute w-14 h-16 border-2 border-amber-500 bg-amber-500/10 rounded-lg flex flex-col items-center justify-end p-0.5 transition-all"
                    style={{ left: '72%', top: '48%' }}
                    title="Tooth #19: Alveolar Bone Loss (Mild)"
                  >
                    <span className="text-[8px] bg-slate-950 text-amber-400 font-extrabold px-1 py-0.5 rounded shadow-sm">#19 Bone Loss</span>
                  </div>
                )}
              </div>
            )}

            {/* Simulated radiograph grid annotations */}
            <div className="absolute top-3 left-3 z-10 text-[8px] font-mono text-slate-500 select-none">
              GRID: L-42  •  FLTR: NONE  •  MOLAR SECTOR
            </div>
            <div className="absolute bottom-3 right-3 z-10 text-[8px] font-mono text-slate-500 select-none">
              DPI: 600  •  EXPOSURE: 0.12s
            </div>

            {/* Placeholder state */}
            {!uploadedFile && !hasScanned && !isScanning && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-slate-400 z-15">
                <FileText className="h-8 w-8 text-slate-500 mb-2 stroke-1" />
                <span className="text-xs font-bold text-slate-300">Radiograph File: {fileName}</span>
                <span className="text-[9px] text-slate-500 mt-1">Ready for computed neural diagnostics scan.</span>
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              onClick={handleRunAI}
              disabled={isScanning}
              className="flex-1 font-bold text-xs gap-1.5 h-10 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] cursor-pointer shadow-md justify-center"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Neural Diagnostic Scan In Progress...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Run AI Dental Scan Diagnostics
                </>
              )}
            </Button>
            
            {hasScanned && (
              <Button
                variant="outline"
                onClick={() => setHasScanned(false)}
                className="font-bold text-xs h-10 border-border hover:bg-muted cursor-pointer justify-center"
              >
                Reset Canvas
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Reports & Interactive Overlays Switcher */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Overlays Visibility Panel */}
          <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-black block border-b border-border pb-1.5 select-none">
              Highlight Filters
            </span>
            
            <div className="space-y-2">
              <button
                disabled={!hasScanned}
                onClick={() => setShowCaries(!showCaries)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs font-bold ${
                  !hasScanned ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-card'
                } ${showCaries && hasScanned ? 'border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400' : 'border-border/60 bg-transparent text-muted-foreground'}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full bg-rose-500 ${showCaries && hasScanned ? 'animate-pulse' : ''}`} />
                  Caries Detection
                </span>
                {showCaries && hasScanned ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>

              <button
                disabled={!hasScanned}
                onClick={() => setShowCrowns(!showCrowns)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs font-bold ${
                  !hasScanned ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-card'
                } ${showCrowns && hasScanned ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' : 'border-border/60 bg-transparent text-muted-foreground'}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Crown / Restorations
                </span>
                {showCrowns && hasScanned ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>

              <button
                disabled={!hasScanned}
                onClick={() => setShowBoneLoss(!showBoneLoss)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs font-bold ${
                  !hasScanned ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-card'
                } ${showBoneLoss && hasScanned ? 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400' : 'border-border/60 bg-transparent text-muted-foreground'}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Alveolar Bone Levels
                </span>
                {showBoneLoss && hasScanned ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* AI Report Output */}
          <div className="p-4 bg-muted/40 border border-border rounded-xl flex-1 flex flex-col justify-between min-h-[160px] space-y-3">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-black block border-b border-border pb-1.5 select-none">
              Neural Diagnostic Feed
            </span>

            {isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2 text-xs font-semibold text-muted-foreground animate-pulse">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                <span>Running neural convolutional checks...</span>
              </div>
            ) : hasScanned ? (
              <div className="space-y-3 text-xs leading-normal font-semibold">
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg leading-relaxed text-[11px]">
                  <span className="font-extrabold text-[10px] uppercase block mb-1">Audit Findings Summary</span>
                  Detected distal caries lesion on **Tooth #14** approximating enamel-dentin junction. Minor alveolar bone loss noted on **Tooth #19**.
                  <span className="block text-[9px] text-muted-foreground font-bold mt-2">Confidence Level: 96.8%</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold">
                  <Check className="h-3.5 w-3.5" />
                  <span>Diagnostics Synced to Patient Records</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-xs font-bold text-muted-foreground/60 italic leading-relaxed">
                <AlertCircle className="h-6.5 w-6.5 mb-1.5 stroke-1" />
                <span>Trigger the AI audit model scan to analyze this dental radiograph.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default XrayAIViewer;
