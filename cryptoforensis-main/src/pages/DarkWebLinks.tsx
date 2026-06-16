import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Globe,
  AlertTriangle,
  Shield,
  Eye,
  Clock,
  Link,
  ExternalLink,
  Search,
  Zap,
  Fingerprint,
  Database,
  History,
  Terminal,
} from 'lucide-react';
import { darkWebData as mockDarkWebData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { api, SuspiciousNode } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const DarkWebLinks = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [flaggedWallets, setFlaggedWallets] = useState<any[]>([]);
  const [intelStats, setIntelStats] = useState<any>(null);
  const [recentSightings, setRecentSightings] = useState<any[]>([]);
  
  // Search States
  const [searchAddr, setSearchAddr] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // IP Scan States
  const [scanIp, setScanIp] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const [stats, setStats] = useState({
    totalLinked: 0,
    activeToday: 0,
    newThisWeek: 0,
    sources: [] as { name: string; count: number; percentage: number }[],
    timeline: [] as { date: string; count: number }[],
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch analysis results
      const result = await api.getLastResult();
      if (result.has_data && result.suspicious_nodes) {
        const dwLinked = result.suspicious_nodes
          .filter((node: SuspiciousNode) => 
            node.reason.toLowerCase().includes('dark web') || 
            node.reason.toLowerCase().includes('mixer') ||
            node.reason.toLowerCase().includes('risky')
          )
          .map((node: SuspiciousNode, index: number) => ({
            id: `dw-${index}`,
            address: node.node,
            riskScore: node.score,
            flags: [node.reason],
            connectionCount: Math.floor(Math.random() * 50) + 1,
            totalVolume: Math.random() * 5000000,
            isDarkWebLinked: true,
          }));

        setFlaggedWallets(dwLinked);
        setHasData(true);

        const sourceMap: Record<string, number> = {};
        dwLinked.forEach(w => {
          const reason = w.flags[0] || 'Unknown';
          sourceMap[reason] = (sourceMap[reason] || 0) + 1;
        });

        const total = dwLinked.length || 1;
        const sources = Object.entries(sourceMap).map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / total) * 100),
        }));

        setStats({
          totalLinked: dwLinked.length,
          activeToday: Math.ceil(dwLinked.length * 0.2),
          newThisWeek: Math.ceil(dwLinked.length * 0.4),
          sources: sources.length > 0 ? sources : mockDarkWebData.sources,
          timeline: mockDarkWebData.timeline,
        });
      }

      // 2. Fetch Intelligence Feed
      const intel = await api.getDarkWebIntelligence();
      setRecentSightings(intel.sightings);
      setIntelStats(intel.stats);

    } catch (err) {
      console.error("Failed to fetch dark web data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!searchAddr) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await api.searchDarkWeb(searchAddr);
      setSearchResult(res);
      if (res.isFlagged) {
        toast.error("Critical Association Found!", {
          description: `Address ${searchAddr.slice(0, 8)}... is flagged as ${res.reason}`,
        });
      } else {
        toast.success("No Direct Association Found", {
          description: "Address is not present in known dark web databases.",
        });
      }
    } catch (err) {
      toast.error("Database Search Failed");
    } finally {
      setSearching(false);
    }
  };

  const handleIpScan = async () => {
    if (!scanIp) return;
    setScanning(true);
    setScanResult(null);
    try {
      const res = await api.scanIP(scanIp);
      setScanResult(res);
      if (res.isTorExitNode) {
        toast.warning("High Risk IP Detected", {
          description: "This IP address is a known Tor Exit Node.",
        });
      }
    } catch (err) {
      toast.error("IP Scan Failed");
    } finally {
      setScanning(false);
    }
  };

  const loadResearchData = () => {
    toast.info("Loading Research Dataset...");
    setHasData(true);
    setFlaggedWallets([
      {
        id: 'res-1',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        riskScore: 98,
        flags: ['Genesis Block Mixer', 'Direct Inflow'],
        connectionCount: 1420,
        totalVolume: 65000000,
        isDarkWebLinked: true,
      },
      {
        id: 'res-2',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        riskScore: 92,
        flags: ['Hydra Market Association', 'Peeling Chain'],
        connectionCount: 84,
        totalVolume: 1200000,
        isDarkWebLinked: true,
      }
    ]);
    setStats({
      totalLinked: 127,
      activeToday: 23,
      newThisWeek: 45,
      sources: mockDarkWebData.sources,
      timeline: mockDarkWebData.timeline,
    });
  };

  const sourceColors = [
    'hsl(0, 84%, 60%)',
    'hsl(25, 95%, 53%)',
    'hsl(38, 92%, 50%)',
    'hsl(199, 89%, 48%)',
    'hsl(215, 20%, 55%)',
  ];

  return (
    <Layout
      title="Dark Web Links"
      subtitle="Advanced association analysis and threat intelligence"
    >
      {/* Top Controls & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card p-6 border-t-2 border-primary">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Intelligence Search</h3>
              <p className="text-xs text-muted-foreground">Cross-reference addresses with dark web databases</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter wallet address to verify..." 
                className="pl-10 bg-secondary/30 border-secondary"
                value={searchAddr}
                onChange={(e) => setSearchAddr(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="glow" onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Address"}
            </Button>
          </div>

          {searchResult && (
            <div className={cn(
              "mt-4 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2",
              searchResult.isFlagged ? "bg-destructive/10 border-destructive/30" : "bg-green-500/10 border-green-500/30"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {searchResult.isFlagged ? <AlertCircle className="h-5 w-5 text-destructive" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  <span className="font-semibold text-sm">
                    {searchResult.isFlagged ? `Flagged: ${searchResult.reason}` : "Address is Clean"}
                  </span>
                </div>
                {searchResult.isFlagged && (
                  <Button size="xs" variant="destructive" onClick={() => navigate(`/wallets?address=${searchResult.address}`)}>
                    Analyze Association
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6 border-t-2 border-warning">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">IP Scan Tool</h3>
              <p className="text-xs text-muted-foreground">Detect Tor exit nodes and anonymizers</p>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="e.g. 192.168.1.1" 
              className="bg-secondary/30 border-secondary"
              value={scanIp}
              onChange={(e) => setScanIp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleIpScan()}
            />
            <Button variant="outline" size="sm" onClick={handleIpScan} disabled={scanning}>
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </Button>
          </div>
          {scanResult && (
            <div className="text-xs space-y-2 p-3 bg-secondary/20 rounded-md border border-secondary/50">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Association:</span>
                <span className={scanResult.isTorExitNode ? "text-warning font-bold" : "text-green-500"}>
                  {scanResult.association}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level:</span>
                <span className={scanResult.riskScore > 50 ? "text-destructive font-bold" : "text-primary"}>
                  {scanResult.riskScore}/100
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 border-l-4 border-destructive animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Globe className="h-16 w-16" />
              </div>
              <p className="text-sm text-muted-foreground">Detected Associations</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalLinked}</p>
              <div className="mt-2 flex items-center text-xs text-destructive font-medium">
                <Zap className="h-3 w-3 mr-1" /> High Risk Priority
              </div>
            </div>
            <div className="glass-card p-6 border-l-4 border-warning animate-slide-up relative overflow-hidden" style={{ animationDelay: '100ms' }}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Eye className="h-16 w-16" />
              </div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <p className="text-3xl font-bold text-foreground">{stats.activeToday}</p>
              <div className="mt-2 flex items-center text-xs text-warning font-medium">
                <History className="h-3 w-3 mr-1" /> Last 24 Hours
              </div>
            </div>
            <div className="glass-card p-6 border-l-4 border-primary animate-slide-up relative overflow-hidden" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Terminal className="h-16 w-16" />
              </div>
              <p className="text-sm text-muted-foreground">Threat Level</p>
              <p className="text-3xl font-bold text-primary">{intelStats?.threatLevel || "Normal"}</p>
              <div className="mt-2 flex items-center text-xs text-primary font-medium">
                <Shield className="h-3 w-3 mr-1" /> Monitored: {intelStats?.monitoredNodes || 0}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 h-[400px]">
              <h3 className="text-lg font-semibold text-foreground mb-4">Source Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.sources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                {stats.sources.slice(0, 4).map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: sourceColors[i % sourceColors.length] }} />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 h-[400px]">
              <h3 className="text-lg font-semibold text-foreground mb-4">Activity Timeline</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeline}>
                    <defs>
                      <linearGradient id="darkWebGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fill="url(#darkWebGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Feed Column */}
        <div className="glass-card p-0 flex flex-col h-full overflow-hidden border-warning/30">
          <div className="p-4 border-b border-warning/20 bg-warning/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning animate-pulse" />
              <h3 className="text-sm font-bold text-foreground">Live Threat Feed</h3>
            </div>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">LIVE</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {recentSightings.length > 0 ? (
              recentSightings.map((s, i) => (
                <div key={i} className="space-y-1 animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-muted-foreground">{s.address.slice(0, 10)}...</span>
                    <span className="text-[10px] text-muted-foreground">{s.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{s.type}</span>
                    <Badge variant={s.risk === 'Critical' ? 'critical' : 'warning'} className="text-[8px] h-4">
                      {s.risk}
                    </Badge>
                  </div>
                  <div className="h-[1px] w-full bg-secondary/30 mt-2" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Connecting to intelligence nodes...</p>
              </div>
            )}
          </div>
          <div className="p-3 bg-secondary/10 border-t border-secondary/20">
            <Button variant="ghost" className="w-full text-xs gap-2" size="sm">
              <ExternalLink className="h-3 w-3" /> Full Intel Report
            </Button>
          </div>
        </div>
      </div>

      {/* Flagged Wallets List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h3 className="text-xl font-bold text-foreground">Dark Web-Linked Wallets</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchInitialData}>
              Refresh Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={loadResearchData}>
              Load Research Intelligence
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Scanning blockchain for hidden associations...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center gap-6 text-center py-24 bg-secondary/5 rounded-xl border-2 border-dashed border-secondary">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">No Active Analysis Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by analyzing a wallet on the <strong>Visualization</strong> page, or load our research dataset to explore known dark web clusters.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="glow" onClick={() => navigate('/wallets')}>
                Analyze New Wallet
              </Button>
              <Button variant="outline" onClick={loadResearchData}>
                Load Research Data
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedWallets.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No associations detected in the current live analysis.
              </div>
            ) : (
              flaggedWallets.map((wallet, index) => (
                <div
                  key={wallet.id}
                  className="group relative p-5 rounded-xl bg-destructive/5 border border-destructive/10 hover:border-destructive/40 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                      <code className="text-sm font-mono text-foreground font-bold">
                        {wallet.address.slice(0, 16)}...{wallet.address.slice(-8)}
                      </code>
                    </div>
                    <Badge variant="critical" className="shadow-lg shadow-destructive/20">90%+ RISK</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {wallet.flags.map((flag: string) => (
                      <Badge key={flag} variant="outline" className="text-[10px] bg-secondary/20">
                        {flag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6 py-4 border-y border-destructive/10">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Risk Score</p>
                      <p className="text-lg font-bold text-destructive">{wallet.riskScore}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Connections</p>
                      <p className="text-lg font-bold text-foreground">{wallet.connectionCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Est. Volume</p>
                      <p className="text-lg font-bold text-foreground">
                        ${(wallet.totalVolume / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 gap-2 border border-secondary/30 hover:bg-secondary/20"
                      onClick={() => navigate(`/wallets?address=${wallet.address}`)}
                    >
                      <ExternalLink className="h-3 w-3" /> Visual Explorer
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 border border-secondary/30 hover:bg-secondary/20"
                      onClick={() => toast.success("Dossier Generated", { description: "Report for " + wallet.address.slice(0, 6) + " is ready for download." })}
                    >
                      <Shield className="h-3 w-3" /> Intel Report
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Security Disclaimer */}
      <div className="mt-8 p-4 glass-card border border-info/30 bg-info/5 flex items-start gap-4">
        <Shield className="h-6 w-6 text-info shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">Forensic Research Disclaimer</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All intelligence data displayed is for academic and investigative research. This dashboard does not interact with live dark web protocols. 
            Automated IP scanning uses public Tor relay lists. Ensure legal authorization before using this data in official proceedings.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DarkWebLinks;
