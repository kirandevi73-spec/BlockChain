import { Bell, Search, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '@/components/auth/AuthContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchNotifications = async () => {
    try {
      const threshold = localStorage.getItem('forensic_threshold') || '85';
      const mode = localStorage.getItem('forensic_deep_analysis') !== 'false';
      
      const data = await api.getMLAnalysis(parseInt(threshold), mode);
      if (data && data.detections) {
        // Filter for high/critical alerts to show in the bell
        const highRisk = data.detections.filter((d: any) => 
          ['critical', 'high'].includes(d.severity)
        );
        setNotifications(highRisk);
      }
    } catch (err) {
      console.error("TopBar: Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handleSettingsUpdate = () => fetchNotifications();
    window.addEventListener('forensic_settings_updated', handleSettingsUpdate);
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('forensic_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Agent Info */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full mr-2">
          <Shield className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Agent: {user?.username || 'Guest'}
          </span>
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search wallets, transactions..."
            className="w-64 pl-10 bg-secondary border-border"
          />
        </div>

        {/* MetaMask Wallet Connect */}
        <WalletConnect />

        {/* Notifications */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <Badge
                variant="critical"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] animate-pulse"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 glass-card p-4 shadow-2xl animate-in fade-in zoom-in duration-200 z-50">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                <h3 className="font-semibold text-foreground">Forensic Alerts</h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {notifications.length} Critical
                </span>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground italic">No critical threats found.</p>
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <div 
                      key={n.id || i}
                      className="p-2 rounded-md hover:bg-primary/5 transition-colors cursor-pointer border-l-2 border-destructive"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/ml-analysis');
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-destructive uppercase tracking-tighter">
                          {n.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground truncate mb-1">
                        {n.wallet}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-destructive" 
                            style={{ width: `${n.confidence}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-foreground font-bold">{n.confidence}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <Button 
                  variant="link" 
                  className="w-full mt-4 text-xs text-primary h-auto p-0"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/ml-analysis');
                  }}
                >
                  View full ML report
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
          <Settings className="h-5 w-5" />
        </Button>

        {/* Logout */}
        <Button variant="ghost" size="icon" onClick={logout} className="text-destructive hover:bg-destructive/10">
          <LogOut className="h-5 w-5" />
        </Button>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </header>
  );
}