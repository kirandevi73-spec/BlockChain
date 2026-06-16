import { Layout } from '@/components/layout/Layout';
import { WalletGraph } from '@/components/graph/WalletGraph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Download,
  Layers,
  Target,
  GitBranch,
  Loader2,
  ArrowRight,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, type GraphNode, type GraphEdge } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const GraphExplorer = () => {
  const [depthLevel, setDepthLevel] = useState([2]);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  // Shortest path state
  const [showPathPanel, setShowPathPanel] = useState(false);
  const [pathSource, setPathSource] = useState('');
  const [pathTarget, setPathTarget] = useState('');
  const [pathLoading, setPathLoading] = useState(false);
  const [pathResult, setPathResult] = useState<{
    path: string[];
    path_edges: { source: string; target: string }[];
    hops: number;
  } | null>(null);
  const [highlightPath, setHighlightPath] = useState<string[]>([]);

  // Cluster state
  const [showClusterPanel, setShowClusterPanel] = useState(false);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [nodeClusters, setNodeClusters] = useState<{ [id: string]: number }>({});
  const [clustersList, setClustersList] = useState<any[]>([]);

  // Trace flow state
  const [showFlowPanel, setShowFlowPanel] = useState(false);
  const [flowAddress, setFlowAddress] = useState('');
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowResult, setFlowResult] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const result = await api.getLastResult();
        if (result.has_data) {
          setHasData(true);
          setNodes(result.graph?.nodes || []);
          setEdges(result.graph?.edges || []);
        } else {
          setHasData(false);
        }
      } catch (err: any) {
        toast({ title: 'Failed to load graph', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [toast]);

  const handleFindPath = async () => {
    if (!pathSource || !pathTarget) {
      toast({ title: 'Missing input', description: 'Please enter both source and target addresses.', variant: 'destructive' });
      return;
    }
    setPathLoading(true);
    setPathResult(null);
    setHighlightPath([]);
    // Clear other highlights
    setNodeClusters({});
    setFlowResult(null);
    try {
      const result = await api.shortestPath(pathSource.trim(), pathTarget.trim());
      setPathResult(result);
      setHighlightPath(result.path);
      toast({ title: `Path found! ${result.hops} hop${result.hops !== 1 ? 's' : ''}`, description: `${result.path.length} nodes in the path.` });
    } catch (err: any) {
      toast({ title: 'Path Not Found', description: err.message, variant: 'destructive' });
    } finally {
      setPathLoading(false);
    }
  };

  const handleDetectClusters = async () => {
    setClusterLoading(true);
    setNodeClusters({});
    setHighlightPath([]);
    setFlowResult(null);
    try {
      const result = await api.detectClusters();
      const clusterMap: { [id: string]: number } = {};
      result.clusters.forEach((c: any) => {
        c.nodes.forEach((nodeId: string) => {
          clusterMap[nodeId] = c.cluster_id;
        });
      });
      setNodeClusters(clusterMap);
      setClustersList(result.clusters);
      toast({ title: 'Clusters Detected', description: `Identified ${result.total_clusters} communities in the network.` });
    } catch (err: any) {
      toast({ title: 'Detection Failed', description: err.message, variant: 'destructive' });
    } finally {
      setClusterLoading(false);
    }
  };

  const handleTraceFlow = async () => {
    if (!flowAddress) {
      toast({ title: 'Missing Address', description: 'Please enter a wallet address to trace flow from.', variant: 'destructive' });
      return;
    }
    setFlowLoading(true);
    setFlowResult(null);
    setHighlightPath([]);
    setNodeClusters({});
    try {
      const result = await api.traceFlow(flowAddress.trim());
      setFlowResult(result);
      toast({ title: 'Flow Traced', description: `Funds flowed to ${result.downstream_wallets} downstream wallets.` });
    } catch (err: any) {
      toast({ title: 'Tracing Failed', description: err.message, variant: 'destructive' });
    } finally {
      setFlowLoading(false);
    }
  };

  const clearPath = () => {
    setPathResult(null);
    setHighlightPath([]);
    setPathSource('');
    setPathTarget('');
  };

  const clearClusters = () => {
    setNodeClusters({});
    setClustersList([]);
  };

  const clearFlow = () => {
    setFlowResult(null);
    setFlowAddress('');
  };

  const explorerStats = [
    { label: 'Total Nodes', value: nodes.length },
    { label: 'Connections', value: edges.length },
    { label: 'Clusters', value: clustersList.length || Math.ceil(nodes.length / 5) || 0 },
    { label: 'Depth', value: depthLevel[0] },
  ];

  const clusterColors = [
    'hsl(280, 80%, 60%)', // Purple
    'hsl(200, 80%, 60%)', // Blue
    'hsl(160, 80%, 60%)', // Teal
    'hsl(120, 80%, 60%)', // Green
    'hsl(60, 80%, 60%)',  // Yellow
    'hsl(30, 80%, 60%)',  // Orange
    'hsl(0, 80%, 60%)',   // Red
    'hsl(320, 80%, 60%)', // Pink
    'hsl(240, 80%, 60%)', // Indigo
    'hsl(40, 80%, 60%)',  // Gold
  ];

  return (
    <Layout
      title="Graph Explorer"
      subtitle="Neo4j-style visualization of blockchain connections"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Graph Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              {explorerStats.map((stat) => (
                <div key={stat.label} className="text-center p-2 rounded-lg bg-secondary">
                  <p className="text-xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Explorer Tools */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Explorer Tools</h4>
            <div className="space-y-2">
              <Button
                variant={showPathPanel ? 'glow' : 'outline'}
                className="w-full justify-start gap-2"
                onClick={() => { setShowPathPanel(!showPathPanel); setShowClusterPanel(false); setShowFlowPanel(false); }}
              >
                <Target className="h-4 w-4" /> Find Shortest Path
              </Button>
              <Button
                variant={showClusterPanel ? 'glow' : 'outline'}
                className="w-full justify-start gap-2"
                onClick={() => { setShowClusterPanel(!showClusterPanel); setShowPathPanel(false); setShowFlowPanel(false); }}
              >
                <Layers className="h-4 w-4" /> Detect Clusters
              </Button>
              <Button
                variant={showFlowPanel ? 'glow' : 'outline'}
                className="w-full justify-start gap-2"
                onClick={() => { setShowFlowPanel(!showFlowPanel); setShowPathPanel(false); setShowClusterPanel(false); }}
              >
                <GitBranch className="h-4 w-4" /> Trace Flow
              </Button>
            </div>
          </div>

          {/* Shortest Path Panel */}
          {showPathPanel && (
            <div className="glass-card p-4 border border-primary/30 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Find Shortest Path</h4>
                <button onClick={() => { setShowPathPanel(false); clearPath(); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Source wallet address..."
                  value={pathSource}
                  onChange={(e) => setPathSource(e.target.value)}
                  className="bg-secondary text-xs font-mono"
                />
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Target wallet address..."
                  value={pathTarget}
                  onChange={(e) => setPathTarget(e.target.value)}
                  className="bg-secondary text-xs font-mono"
                />
                <Button
                  variant="glow"
                  className="w-full gap-2"
                  onClick={handleFindPath}
                  disabled={pathLoading || !hasData}
                >
                  {pathLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                  {pathLoading ? 'Searching...' : 'Find Path'}
                </Button>
                {pathResult && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">Path Found!</span>
                      <Badge variant="outline" className="text-xs">{pathResult.hops} hop{pathResult.hops !== 1 ? 's' : ''}</Badge>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {pathResult.path.map((addr, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />}
                          <code className="text-xs text-foreground font-mono truncate">{addr}</code>
                        </div>
                      ))}
                    </div>
                    <button onClick={clearPath} className="text-xs text-muted-foreground hover:text-foreground mt-2 underline">
                      Clear path
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detect Clusters Panel */}
          {showClusterPanel && (
            <div className="glass-card p-4 border border-primary/30 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Detect Clusters</h4>
                <button onClick={() => { setShowClusterPanel(false); clearClusters(); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Analyze network topology to find wallet communities.
              </p>
              <Button
                variant="glow"
                className="w-full gap-2"
                onClick={handleDetectClusters}
                disabled={clusterLoading || !hasData}
              >
                {clusterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                {clusterLoading ? 'Analyzing...' : 'Run Detection'}
              </Button>
              {clustersList.length > 0 && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {clustersList.map((c, i) => (
                    <div key={i} className="p-2 rounded-md bg-secondary/50 text-[10px] flex items-center justify-between">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: clusterColors[i % clusterColors.length] }} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trace Flow Panel */}
          {showFlowPanel && (
            <div className="glass-card p-4 border border-primary/30 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Trace Fund Flow</h4>
                <button onClick={() => { setShowFlowPanel(false); clearFlow(); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Source wallet address..."
                  value={flowAddress}
                  onChange={(e) => setFlowAddress(e.target.value)}
                  className="bg-secondary text-xs font-mono"
                />
                <Button
                  variant="glow"
                  className="w-full gap-2"
                  onClick={handleTraceFlow}
                  disabled={flowLoading || !hasData}
                >
                  {flowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
                  {flowLoading ? 'Tracing...' : 'Trace Downstream'}
                </Button>
                {flowResult && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-2 animate-fade-in">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Wallets Reached:</span>
                      <span className="font-bold text-foreground">{flowResult.downstream_wallets}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Total Volume:</span>
                      <span className="font-bold text-primary">{flowResult.total_volume.toFixed(4)} BTC</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      Flow path highlighted on graph.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Node Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">High Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-muted-foreground">Suspicious</span>
              </div>
              {highlightPath.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Shortest Path</span>
                </div>
              )}
              {flowResult && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-600 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Trace Flow</span>
                </div>
              )}
              {Object.keys(nodeClusters).length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Clusters Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Graph */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6 h-[calc(100vh-200px)] min-h-[600px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !hasData ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Analysis Yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Run an analysis on the <strong>Wallet Visualization</strong> page first — then come back here to explore the graph.
                </p>
                <a href="/wallets">
                  <button className="mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                    Go to Wallet Visualization →
                  </button>
                </a>
              </div>
            ) : (
              <WalletGraph
                className="h-full border-0 p-0"
                nodes={nodes}
                edges={edges}
                highlightPath={highlightPath}
                highlightNodes={flowResult ? flowResult.flow_nodes : []}
                nodeClusters={nodeClusters}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GraphExplorer;
