import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Cpu, 
  Database, 
  Bell, 
  FileText,
  Save,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Load initial values from localStorage or defaults

  const [deepAnalysis, setDeepAnalysis] = useState(() => {
    return localStorage.getItem('forensic_deep_analysis') !== 'false';
  });
  const [autoReport, setAutoReport] = useState(() => {
    return localStorage.getItem('forensic_auto_report') === 'true';
  });

  const handleSave = () => {

    localStorage.setItem('forensic_deep_analysis', deepAnalysis.toString());
    localStorage.setItem('forensic_auto_report', autoReport.toString());
    onClose();
    // Trigger a refresh event for components to update
    window.dispatchEvent(new Event('forensic_settings_updated'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Forensic Settings</h2>
              <p className="text-xs text-muted-foreground italic">v2.4.0 - Professional Edition</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Engine Config */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Analysis Engine</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Deep ML Analysis</label>
                    <p className="text-[10px] text-muted-foreground">Enable XGBoost 1000-estimator pass</p>
                  </div>
                  <Switch checked={deepAnalysis} onCheckedChange={setDeepAnalysis} />
                </div>


              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Alerts & Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Real-time Push Alerts</label>
                    <p className="text-[10px] text-muted-foreground">Notify on critical threat detection</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Auto-Generate Reports</label>
                    <p className="text-[10px] text-muted-foreground">Export PDF for every critical hit</p>
                  </div>
                  <Switch checked={autoReport} onCheckedChange={setAutoReport} />
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="p-6 bg-secondary/20 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
