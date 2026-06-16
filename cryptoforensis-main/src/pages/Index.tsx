import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { WalletTable } from '@/components/dashboard/WalletTable';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { WalletGraph } from '@/components/graph/WalletGraph';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  AlertTriangle,
  Activity,
  Globe,
  Brain,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { dashboardStats as mockStats, mockAlerts, mockWallets } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, SuspiciousNode } from '@/services/api';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState({
    totalWallets: 0,
    flaggedWallets: 0,
    darkWebLinked: 0,
    mlAlerts: 0,
  });
  const [wallets, setWallets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [riskDistData, setRiskDistData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[], edges: any[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await api.getLastResult();
        if (result.has_data) {
          setHasData(true);
          const suspicious = result.suspicious_nodes || [];
          const txs = result.transactions || [];
          const graph = result.graph || { nodes: [], edges: [] };
          
          setGraphData(graph);
          
          const dwLinked = suspicious.filter((n: SuspiciousNode) => 
            n.reason.toLowerCase().includes('dark web') || 
            n.reason.toLowerCase().includes('mixer')
          );
          
          setStats({
            totalWallets: (result.graph?.nodes?.length || 0),
            flaggedWallets: suspicious.length,
            darkWebLinked: dwLinked.length,
            mlAlerts: suspicious.filter((n: SuspiciousNode) => n.score > 80).length,
          });

          // Calculate Risk Distribution
          const dist = [
            { name: 'Low', value: 0, color: 'hsl(142, 76%, 45%)' },
            { name: 'Medium', value: 0, color: 'hsl(38, 92%, 50%)' },
            { name: 'High', value: 0, color: 'hsl(25, 95%, 53%)' },
            { name: 'Critical', value: 0, color: 'hsl(0, 84%, 60%)' },
          ];
          suspicious.forEach((n: any) => {
            if (n.score >= 80) dist[3].value++;
            else if (n.score >= 60) dist[2].value++;
            else if (n.score >= 40) dist[1].value++;
            else dist[0].value++;
          });
          setRiskDistData(dist);

          // Calculate Volume (Simplified grouping by date/index)
          // Real volume chart: group by date, sum real amounts
          const volByDate: Record<string, { volume: number; flagged: number }> = {};
          txs.forEach((tx: any) => {
            const date = tx.timestamp ? tx.timestamp.split('T')[0] : 'Unknown';
            if (!volByDate[date]) volByDate[date] = { volume: 0, flagged: 0 };
            const usdVal = tx.amount * 50000; // BTC/ETH approx USD conversion
            volByDate[date].volume += usdVal;
            const isSuspect = suspicious.some((s: SuspiciousNode) => s.node === tx.from || s.node === tx.to);
            if (isSuspect) volByDate[date].flagged += usdVal;
          });
          const volume = Object.entries(volByDate).slice(0, 10).map(([date, vals]) => ({ date, ...vals }));
          setVolumeData(volume);

          // Build a real volume map from actual transactions
          const volumeMap: Record<string, number> = {};
          const connMap: Record<string, number> = {};
          txs.forEach((tx: any) => {
            const amt = tx.amount || 0;
            if (tx.from) { volumeMap[tx.from] = (volumeMap[tx.from] || 0) + amt; connMap[tx.from] = (connMap[tx.from] || 0) + 1; }
            if (tx.to) { volumeMap[tx.to] = (volumeMap[tx.to] || 0) + amt; }
          });

          setWallets(suspicious.map((n: SuspiciousNode, i: number) => ({
            id: `w-${i}`,
            address: n.node,
            riskScore: n.score,
            riskLevel: n.score > 80 ? 'critical' : n.score > 60 ? 'high' : 'medium',
            connectionCount: connMap[n.node] || graph.edges?.filter((e: any) => e.source === n.node || e.target === n.node).length || 1,
            totalVolume: volumeMap[n.node] || 0,
            lastActivity: new Date().toISOString(),
            isDarkWebLinked: dwLinked.includes(n),
            flags: [n.reason],
          })));

          setAlerts(suspicious.slice(0, 5).map((n: SuspiciousNode, i: number) => ({
            id: `a-${i}`,
            type: n.score > 80 ? 'critical' : 'warning',
            title: `Suspicious Activity Detected`,
            message: `${n.reason} identified for wallet ${n.node.slice(0, 10)}...`,
            timestamp: 'Just now',
            walletAddress: n.node,
          })));
        } else {
          setHasData(false);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <Layout
      title="Dashboard"
      subtitle="Real-time blockchain forensics overview"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Session Wallets"
          value={hasData ? stats.totalWallets : 0}
          change={hasData ? "From current analysis" : "No active analysis"}
          changeType={hasData ? "positive" : "neutral"}
          icon={Wallet}
          iconColor="primary"
          delay={0}
        />
        <StatCard
          title="Flagged Entities"
          value={hasData ? stats.flaggedWallets : 0}
          change={hasData ? `${stats.flaggedWallets} risks detected` : "Awaiting search"}
          changeType={hasData ? "negative" : "neutral"}
          icon={AlertTriangle}
          iconColor="destructive"
          delay={100}
        />
        <StatCard
          title="Dark Web Links"
          value={hasData ? stats.darkWebLinked : 0}
          change={hasData ? "Potential associations" : "0 identified"}
          changeType={hasData ? "negative" : "neutral"}
          icon={Globe}
          iconColor="warning"
          delay={200}
        />
        <StatCard
          title="ML Flags"
          value={hasData ? stats.mlAlerts : 0}
          change={hasData ? "Heuristic matches" : "Inactive"}
          changeType="neutral"
          icon={Brain}
          iconColor="primary"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <VolumeChart data={volumeData} />
        </div>
        <div className="lg:col-span-1">
          <RiskDistributionChart data={riskDistData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Live Alerts
              </h3>
              <span className="text-xs text-muted-foreground">
                {alerts.length} active
              </span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {hasData ? (
                alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={dismissAlert}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No active alerts.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <WalletGraph 
            interactive={false} 
            nodes={graphData.nodes} 
            edges={graphData.edges} 
          />
          <div className="flex justify-end mt-4">
            <Link to="/explorer">
              <Button variant="outline" className="gap-2">
                Open Full Graph Explorer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Wallet Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {hasData ? "High-Risk Entities in Session" : "Recent Detections"}
          </h3>
          <Link to="/wallets">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {hasData ? (
          <WalletTable wallets={wallets} limit={5} />
        ) : (
          <div className="glass-card p-12 text-center text-muted-foreground border-dashed">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No active investigation data to display.</p>
            <p className="text-sm">Enter a wallet address in the <Link to="/wallets" className="text-primary hover:underline">Analysis</Link> tab to begin.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/wallets" className="block">
            <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <Wallet className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-foreground">Analyze Wallet</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Deep dive into wallet connections
              </p>
            </div>
          </Link>
          <Link to="/risk" className="block">
            <div className="p-4 rounded-lg border border-border hover:border-warning/50 hover:bg-warning/5 transition-all group">
              <AlertTriangle className="h-8 w-8 text-warning mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-foreground">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Review flagged entities
              </p>
            </div>
          </Link>
          <Link to="/ml-analysis" className="block">
            <div className="p-4 rounded-lg border border-border hover:border-info/50 hover:bg-info/5 transition-all group">
              <Brain className="h-8 w-8 text-info mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-foreground">ML Insights</h4>
              <p className="text-sm text-muted-foreground mt-1">
                View AI-driven predictions
              </p>
            </div>
          </Link>
          <Link to="/reports" className="block">
            <div className="p-4 rounded-lg border border-border hover:border-success/50 hover:bg-success/5 transition-all group">
              <Shield className="h-8 w-8 text-success mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-foreground">Generate Report</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Export investigation data
              </p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
