import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import type { Wallet } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface WalletTableProps {
  wallets: Wallet[];
  limit?: number;
}

export function WalletTable({ wallets, limit }: WalletTableProps) {
  const displayWallets = limit ? wallets.slice(0, limit) : wallets;

  const riskBadgeVariants = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'critical',
  } as const;

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume}`;
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Connections
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Volume
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Flags
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayWallets.map((wallet, index) => (
              <tr
                key={wallet.id}
                className="hover:bg-secondary/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {wallet.isDarkWebLinked && (
                      <div className="h-2 w-2 rounded-full bg-destructive pulse-dot" />
                    )}
                    <code className="text-sm font-mono text-foreground">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </code>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={riskBadgeVariants[wallet.riskLevel]}>
                    {wallet.riskLevel.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          wallet.riskScore >= 80 && 'bg-destructive',
                          wallet.riskScore >= 50 && wallet.riskScore < 80 && 'bg-warning',
                          wallet.riskScore < 50 && 'bg-success'
                        )}
                        style={{ width: `${wallet.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{wallet.riskScore}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {wallet.connectionCount}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {formatVolume(wallet.totalVolume)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {wallet.flags.slice(0, 2).map((flag) => (
                      <Badge key={flag} variant="outline" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                    {wallet.flags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{wallet.flags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
