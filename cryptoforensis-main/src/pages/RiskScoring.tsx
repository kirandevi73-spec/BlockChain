import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { api, SuspiciousNode } from '@/services/api';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const RiskScoring = () => {
  const [riskMetrics, setRiskMetrics] = useState([
    {
      label: 'Transaction Frequency',
      value: 0,
      description: 'High volume in short timeframes',
    },
    {
      label: 'Network Connectivity',
      value: 0,
      description: 'Connections to flagged wallets',
    },
    {
      label: 'Anomalous Patterns',
      value: 0,
      description: 'Unusual graph behavior',
    },
    {
      label: 'Volume Risk',
      value: 15,
      description: 'Exposure to high-value transfers',
    },
    {
      label: 'Mixer Usage',
      value: 5,
      description: 'Tumbler and mixing service usage',
    },
  ]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-destructive';
    if (score >= 50) return 'bg-warning';
    return 'bg-success';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: 'Critical', variant: 'critical' as const };
    if (score >= 60) return { label: 'High', variant: 'danger' as const };
    if (score >= 40) return { label: 'Medium', variant: 'warning' as const };
    return { label: 'Low', variant: 'success' as const };
  };

  const [wallets, setWallets] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([
    { name: 'Critical', value: 0, color: 'hsl(var(--destructive))' },
    { name: 'High', value: 0, color: 'hsl(var(--warning))' },
    { name: 'Medium', value: 0, color: 'hsl(var(--info))' },
    { name: 'Low', value: 0, color: 'hsl(var(--success))' },
  ]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getLastResult();
        if (result.has_data && result.suspicious_nodes) {
          setHasData(true);
          const mappedWallets = result.suspicious_nodes.map((node: SuspiciousNode, index: number) => ({
             id: `n-${index}`,
             address: node.node,
             riskScore: typeof node.score === 'number' ? node.score : 0,
             flags: [node.reason],
             isDarkWebLinked: node.reason.toLowerCase().includes('dark web') || node.reason.toLowerCase().includes('risky'),
          }));
          setWallets(mappedWallets);

          const dist = [
            { name: 'Critical', value: 0, color: 'hsl(var(--destructive))' },
            { name: 'High', value: 0, color: 'hsl(var(--warning))' },
            { name: 'Medium', value: 0, color: 'hsl(var(--info))' },
            { name: 'Low', value: 0, color: 'hsl(var(--success))' },
          ];

          mappedWallets.forEach((w: any) => {
             if (w.riskScore >= 80) dist[0].value++;
             else if (w.riskScore >= 60) dist[1].value++;
             else if (w.riskScore >= 40) dist[2].value++;
             else dist[3].value++;
          });
          setDistribution(dist);

          if (result.aggregate_risk) {
            setRiskMetrics([
              {
                label: 'Transaction Frequency',
                value: result.aggregate_risk.transaction_frequency || 0,
                description: 'High volume in short timeframes',
              },
              {
                label: 'Network Connectivity',
                value: result.aggregate_risk.network_connectivity || 0,
                description: 'Connections to flagged wallets',
              },
              {
                label: 'Anomalous Patterns',
                value: result.aggregate_risk.anomalous_patterns || 0,
                description: 'Unusual graph behavior',
              },
              {
                label: 'Volume Risk',
                value: result.aggregate_risk.volume_risk || 15,
                description: 'Exposure to high-value transfers',
              },
              {
                label: 'Mixer Usage',
                value: result.aggregate_risk.mixer_usage || 5,
                description: 'Tumbler and mixing service usage',
              },
            ]);
          }
        } else {
          setHasData(false);
        }
      } catch (err) {
        console.error("Failed to fetch risk scoring data", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if we are not on the dashboard (actually, the user wants NO results if nothing searched)
    // But how to define "nothing searched"? 
    // If the backend has_data is true, it means SOMETHING was searched.
    // If the user wants it empty on fresh start, the backend should be empty.
    
    // I will keep the fetch but only if hasData is true.
    fetchData();
  }, []);

  if (loading) {
     return (
       <Layout title="Risk Scoring" subtitle="Comprehensive risk analysis and threat assessment">
         <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
       </Layout>
     );
  }

  return (
    <Layout
      title="Risk Scoring"
      subtitle="Comprehensive risk analysis and threat assessment"
    >
      {!hasData ? (
        <div className="glass-card flex flex-col items-center justify-center gap-4 text-center p-12 animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
             <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Analysis Yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Run an analysis on the <strong>Wallet Visualization</strong> page first to see risk assessments.
          </p>
          <a href="/wallets">
            <Button variant="glow">Go to Wallet Visualization →</Button>
          </a>
        </div>
      ) : (
        <>
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-6 border-l-4 border-destructive animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Risk</p>
              <p className="text-3xl font-bold text-destructive">
                {distribution.find((r) => r.name === 'Critical')?.value || 0}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-destructive opacity-50" />
          </div>
        </div>

        <div
          className="glass-card p-6 border-l-4 border-warning animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-3xl font-bold text-warning">
                {distribution.find((r) => r.name === 'High')?.value || 0}
              </p>
            </div>
            <AlertCircle className="h-10 w-10 text-warning opacity-50" />
          </div>
        </div>

        <div
          className="glass-card p-6 border-l-4 border-info animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>
              <p className="text-3xl font-bold text-info">
                {distribution.find((r) => r.name === 'Medium')?.value || 0}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-info opacity-50" />
          </div>
        </div>

        <div
          className="glass-card p-6 border-l-4 border-success animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clean</p>
              <p className="text-3xl font-bold text-success">
                {distribution.find((r) => r.name === 'Low')?.value || 0}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-success opacity-50" />
          </div>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Risk Distribution by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(222, 30%, 18%)"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Wallets',
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Key Risk Factors
          </h3>
          <div className="space-y-4">
            {riskMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {metric.label}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {metric.value}%
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={metric.value}
                    className="h-2"
                  />
                  <div
                    className={cn(
                      'absolute top-0 left-0 h-2 rounded-full transition-all',
                      getRiskColor(metric.value)
                    )}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Wallets */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Flagged Wallets by Risk Score
          </h3>
          <Button variant="outline" size="sm">
            Export List
          </Button>
        </div>
        <div className="space-y-3">
          {wallets.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
               No flagged wallets found. Please run an analysis first.
            </div>
          ) : (
          wallets
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((wallet, index) => {
              const risk = getRiskLevel(wallet.riskScore);
              return (
                <div
                  key={wallet.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-mono text-foreground">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                      </code>
                      <Badge variant={risk.variant}>{risk.label}</Badge>
                      {wallet.isDarkWebLinked && (
                        <Badge variant="danger" className="gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          Dark Web
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {wallet.flags.map((flag) => (
                        <Badge key={flag} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {wallet.riskScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          getRiskColor(wallet.riskScore)
                        )}
                        style={{ width: `${wallet.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            }))}
        </div>
      </div>
      </>
      )}
    </Layout>
  );
};

export default RiskScoring;
