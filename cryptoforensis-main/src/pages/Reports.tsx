import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  Database,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingNeo4j, setExportingNeo4j] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);
  const { toast } = useToast();

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      await api.exportCSV();
      toast({ title: 'Export Successful', description: 'CSV file downloaded.' });
    } catch (err: any) {
      toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportCypher = async () => {
    setExportingNeo4j(true);
    try {
      await api.exportCypher();
      toast({ title: 'Export Successful', description: 'Cypher script downloaded. You can now import this into Neo4j Browser.' });
    } catch (err: any) {
      toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
    } finally {
      setExportingNeo4j(false);
    }
  };

  const handleExportReport = async () => {
    setExportingReport(true);
    try {
      await api.exportReport();
      toast({ title: 'Export Successful', description: 'Text report downloaded.' });
    } catch (err: any) {
      toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
    } finally {
      setExportingReport(false);
    }
  };

  const savedReports = [
    {
      id: 1,
      name: 'Latest Analysis CSV Export',
      type: 'Raw Nodes Data',
      date: new Date().toLocaleDateString(),
      status: 'Ready',
      size: '—',
      action: handleExportCSV,
      loading: exportingCSV,
      icon: Download
    },
    {
      id: 2,
      name: 'Download Cypher Script (Neo4j)',
      type: 'Database Export Script',
      date: new Date().toLocaleDateString(),
      status: 'Ready',
      size: '—',
      action: handleExportCypher,
      loading: exportingNeo4j,
      icon: Database
    },
    {
      id: 3,
      name: 'Detailed Forensic Report (TXT)',
      type: 'Executive Summary & Tx Data',
      date: new Date().toLocaleDateString(),
      status: 'Ready',
      size: '—',
      action: handleExportReport,
      loading: exportingReport,
      icon: FileText
    }
  ];

  return (
    <Layout
      title="Reports & Exports"
      subtitle="Export forensic investigation data to CSV or Neo4j"
    >
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Generate Quick Export
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="glow" onClick={handleExportCSV} disabled={exportingCSV} className="gap-2">
            {exportingCSV ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Suspicious Nodes CSV
          </Button>
          <Button variant="outline" onClick={handleExportCypher} disabled={exportingNeo4j} className="gap-2 border-primary text-primary hover:bg-primary/10">
            {exportingNeo4j ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Download Cypher Script
          </Button>
        </div>
      </div>

      {/* Saved Reports */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Available Export Formats
          </h3>
        </div>
        <div className="space-y-3">
          {savedReports.map((report, index) => (
            <div
              key={report.id}
              className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors animate-fade-in gap-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Badge variant="success">{report.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={report.action}
                  disabled={report.loading}
                >
                  {report.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <report.icon className="h-4 w-4" />}
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
