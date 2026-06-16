import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Alert } from '@/lib/mockData';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const icons = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    critical: 'border-destructive/50 bg-destructive/10',
    warning: 'border-warning/50 bg-warning/10',
    info: 'border-info/50 bg-info/10',
  };

  const iconStyles = {
    critical: 'text-destructive',
    warning: 'text-warning',
    info: 'text-info',
  };

  const Icon = icons[alert.type];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div
      className={cn(
        'glass-card p-4 border animate-fade-in',
        styles[alert.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5', iconStyles[alert.type])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {alert.title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(alert.timestamp)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
          {alert.walletAddress && (
            <code className="text-xs font-mono text-primary mt-2 block truncate">
              {alert.walletAddress}
            </code>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => onDismiss(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
