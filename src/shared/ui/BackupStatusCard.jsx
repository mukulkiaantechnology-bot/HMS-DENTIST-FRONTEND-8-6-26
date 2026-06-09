import { useState } from 'react';
import { Database, CloudUpload, HardDriveDownload, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Button } from './Button';

export function BackupStatusCard() {
  const toast = useToast();
  const [backupTime, setBackupTime] = useState('2026-06-09 00:00');
  const [status, setStatus] = useState('Synced'); // 'Synced' | 'Pending' | 'Syncing'
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRunBackup = () => {
    setStatus('Syncing');
    toast.info('Starting full SaaS ledger database snapshot and encryption...', 'Backup Job Dispatched');
    
    setTimeout(() => {
      setStatus('Synced');
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      setBackupTime(now);
      toast.success('System database snapshots synced to cloud backup successfully.', 'Backup Completed');
    }, 2000);
  };

  const handleRestore = () => {
    setIsRestoring(true);
    toast.info('Validating cloud backup archive parity...', 'Restore Process Triggered');
    
    setTimeout(() => {
      setIsRestoring(false);
      toast.success('Database restored successfully to snapshot: ' + backupTime, 'Restore Parity Cleared');
    }, 2500);
  };

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/80 p-5 rounded-2xl shadow-sm space-y-4 text-left w-full max-w-full">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider">
          Backup & Disasters Recovery
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status Indicators */}
        <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center gap-3">
          {status === 'Synced' && (
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
          {status === 'Syncing' && (
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          )}
          <div className="space-y-0.5 text-xs font-semibold leading-normal">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Backup Server Status</span>
            <span className={`font-extrabold block ${
              status === 'Synced' ? 'text-emerald-500' : 'text-primary'
            }`}>
              {status === 'Synced' ? 'All Systems Backed Up' : 'Syncing Data Ledger...'}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium block">
              Last Backup: {backupTime}
            </span>
          </div>
        </div>

        {/* Database Stats */}
        <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between text-xs font-semibold leading-normal">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Storage Metrics</span>
            <span className="text-foreground font-extrabold block">Ledger Records: 2,450</span>
            <span className="text-[10px] text-muted-foreground font-medium block">Database Size: 18.4 MB</span>
          </div>
          <span className="text-[9px] uppercase font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
            SQLITE Encrypted
          </span>
        </div>
      </div>

      {/* Buttons actions */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border/40 pt-3">
        <Button
          size="xs"
          onClick={handleRunBackup}
          disabled={status === 'Syncing'}
          className="flex-1 font-bold text-xs gap-1.5 h-10 bg-primary hover:bg-primary/95 cursor-pointer shadow-xs justify-center"
        >
          <CloudUpload className="h-4 w-4" />
          {status === 'Syncing' ? 'Syncing...' : 'Backup System Now'}
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          onClick={handleRestore}
          disabled={isRestoring || status === 'Syncing'}
          className="flex-1 font-bold text-xs gap-1.5 h-10 border-border hover:bg-muted cursor-pointer justify-center"
        >
          {isRestoring ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Restoring...
            </>
          ) : (
            <>
              <HardDriveDownload className="h-4 w-4 text-primary" />
              Restore Last Backup
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default BackupStatusCard;
