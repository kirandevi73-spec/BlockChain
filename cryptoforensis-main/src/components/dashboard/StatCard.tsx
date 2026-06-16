import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'warning' | 'destructive';
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'primary',
  delay = 0,
}: StatCardProps) {
  const iconColors = {
    primary: 'text-primary bg-primary/20',
    success: 'text-success bg-success/20',
    warning: 'text-warning bg-warning/20',
    destructive: 'text-destructive bg-destructive/20',
  };

  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <div
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          {change && (
            <p className={cn('text-sm mt-2', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconColors[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
