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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { mlPredictions as mockPredictions } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

const MLAnalysis = () => {
  const [modelMetrics, setModelMetrics] = useState<any[]>([
    { subject: 'Accuracy', value: 94, fullMark: 100 },
    { subject: 'Precision', value: 89, fullMark: 100 },
    { subject: 'Recall', value: 87, fullMark: 100 },
    { subject: 'F1 Score', value: 88, fullMark: 100 },
    { subject: 'AUC-ROC', value: 92, fullMark: 100 },
  ]);

  const [anomalyTrend, setAnomalyTrend] = useState<any[]>([
    { time: '00:00', score: 15 },
    { time: '04:00', score: 22 },
    { time: '08:00', score: 45 },
    { time: '12:00', score: 78 },
    { time: '16:00', score: 62 },
    { time: '20:00', score: 35 },
    { time: '24:00', score: 28 },
  ]);

  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>(mockPredictions);
  const [stats, setStats] = useState({
    status: 'Active',
    speed: '1.2K tx/sec',
    alerts: 56,
    accuracy: 94.2
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const fetchData = async () => {
    try {
      const threshold = localStorage.getItem('forensic_threshold') || '85';
      const mode = localStorage.getItem('forensic_deep_analysis') !== 'false';
      
      const data = await api.getMLAnalysis(parseInt(threshold), mode);

      // Show the dashboard as long as the API responded (even if 0 threats found)
      if (data && !data.error) {
        setRecentDetections(data.detections || []);
        setAnomalyTrend(data.trend || []);
        setPredictions(data.categories || []);
        setModelMetrics(data.metrics || []);
        setStats({
          status: data.status || 'Active',
          speed: data.processing_speed || '0 tx/sec',
          alerts: data.alerts_today || 0,
          accuracy: data.accuracy || 94.2
        });
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (err) {
      console.error("Failed to fetch ML analysis", err);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleSettingsUpdate = () => fetchData();
    window.addEventListener('forensic_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('forensic_settings_updated', handleSettingsUpdate);
  }, []);

  const severityColors = {
    critical: 'text-destructive',
    high: 'text-orange-500',
    medium: 'text-warning',
    low: 'text-success',
  };

  if (loading) {
    return (
      <Layout title="ML Analysis" subtitle="AI-driven transaction risk predictions and anomaly detection">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="ML Analysis"
      subtitle="AI-driven transaction risk predictions and anomaly detection"
    >
      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-20 glass-card animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Brain className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Analysis Data Found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            The ML Engine is ready but hasn't analyzed any data yet. 
            Please navigate to the home page and enter a wallet address to start the forensic analysis.
          </p>
          <Button asChild>
            <a href="/">Go to Dashboard</a>
          </Button>
        </div>
      ) : (
        <>
          {/* Model Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4 flex items-center gap-4 animate-slide-up">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model Status</p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-lg font-semibold text-foreground">{stats.status}</span>
                </div>
              </div>
            </div>

            <div
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="h-12 w-12 rounded-lg bg-info/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing Speed</p>
                <p className="text-lg font-semibold text-foreground">{stats.speed}</p>
              </div>
            </div>

            <div
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="h-12 w-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alerts Today</p>
                <p className="text-lg font-semibold text-foreground">{stats.alerts}</p>
              </div>
            </div>

            <div
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-lg font-semibold text-foreground">{stats.accuracy}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Prediction Categories */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Prediction Categories
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(222, 30%, 18%)"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 10%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        'Confidence',
                      ]}
                    />
                    <Bar dataKey="confidence" fill="hsl(183, 100%, 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Performance Radar */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Model Performance Metrics
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={modelMetrics}>
                    <PolarGrid stroke="hsl(222, 30%, 18%)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="hsl(183, 100%, 50%)"
                      fill="hsl(183, 100%, 50%)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anomaly Score Timeline */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Anomaly Score Timeline
                </h3>
                <Button variant="outline" size="sm" className="gap-2" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anomalyTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(222, 30%, 18%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 10%)',
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(183, 100%, 50%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(183, 100%, 50%)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-success rounded" />
                  <span className="text-xs text-muted-foreground">Normal (0-30)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-warning rounded" />
                  <span className="text-xs text-muted-foreground">Elevated (30-60)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 bg-destructive rounded" />
                  <span className="text-xs text-muted-foreground">Critical (60+)</span>
                </div>
              </div>
            </div>

            {/* Recent Detections */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Detections
                </h3>
                <Badge variant="glow" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Live
                </Badge>
              </div>
              <div className="space-y-3">
                {recentDetections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <p className="text-sm font-medium text-success">No Threats Detected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All analyzed wallets appear clean above the current threshold.
                    </p>
                  </div>
                ) : (
                  recentDetections.map((detection, index) => (
                  <div
                    key={detection.id}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {detection.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {detection.time}
                      </span>
                    </div>
                    <code className="text-xs font-mono text-primary">
                      {detection.wallet}
                    </code>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Progress value={detection.confidence} className="w-16 h-1.5" />
                        <span className="text-xs text-muted-foreground">
                          {detection.confidence}%
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium capitalize',
                          severityColors[detection.severity as keyof typeof severityColors]
                        )}
                      >
                        {detection.severity}
                      </span>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default MLAnalysis;
