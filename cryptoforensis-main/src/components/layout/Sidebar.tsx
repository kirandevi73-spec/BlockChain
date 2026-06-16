import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  AlertTriangle,
  Search,
  Brain,
  Globe,
  FileText,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/wallets', label: 'Wallet Visualization', icon: Network },
  { path: '/risk', label: 'Risk Scoring', icon: AlertTriangle },
  { path: '/explorer', label: 'Graph Explorer', icon: Search },
  { path: '/ml-analysis', label: 'ML Analysis', icon: Brain },
  { path: '/dark-web', label: 'Dark Web Links', icon: Globe },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/about', label: 'About', icon: Info },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 shrink-0">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-bold gradient-text">CryptoTransactionForensics</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 mx-auto">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-2 overflow-y-auto flex-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'nav-link',
                isActive && 'active',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-sidebar-border space-y-2 bg-sidebar/50 backdrop-blur-sm">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
            onClick={async () => {
              if (confirm('Clear all analysis data?')) {
                try {
                  await api.clearResult();
                } catch (_) { /* backend may be offline, clear locally anyway */ }
                // Clear all locally cached forensic data
                localStorage.removeItem('last_wallet_address');
                localStorage.removeItem('last_blockchain');
                localStorage.removeItem('forensic_result');
                // Notify all pages to reset their state
                window.dispatchEvent(new Event('forensic_data_cleared'));
                window.location.reload();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Blockchain Forensics v1.0
            </p>
            <p className="text-xs text-primary mt-1">Academic Research Tool</p>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-md z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
