// src/services/api.ts

export interface AnalysisRequest {
  blockchain: string;
  input: string;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  currency: string;
  timestamp: string;
  ip: string;
  walletLabel: string;
}

export interface SuspiciousNode {
  node: string;
  score: number;
  reason: string;
  ip: string;
  walletLabel: string;
}

export interface GraphNode {
  id: string;
  label: string;
  degree: number;
  ip: string;
  walletLabel: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  timestamp: string;
}

export interface AnalysisResponse {
  blockchain: string;
  input: string;
  transactions: Transaction[];
  suspicious_nodes: SuspiciousNode[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  error?: string;
}

class ApiService {
  async analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to analyze wallet');
    }

    return response.json();
  }

  async getLastResult(): Promise<{
    has_data: boolean;
    transactions: Transaction[];
    suspicious_nodes: SuspiciousNode[];
    graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  }> {
    const response = await fetch('/api/last_result');
    if (!response.ok) {
      throw new Error('Failed to fetch last result');
    }
    return response.json();
  }

  async shortestPath(source: string, target: string): Promise<{
    path: string[];
    path_edges: { source: string; target: string }[];
    hops: number;
  }> {
    const response = await fetch('/api/shortest_path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, target }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Shortest path request failed');
    return data;
  }

  async exportCSV(): Promise<void> {
    const response = await fetch('/api/export/csv', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to export CSV');
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suspicious_nodes.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportNeo4j(): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/export/neo4j', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to export to Neo4j');
    }

    return response.json();
  }

  async exportCypher(): Promise<void> {
    const response = await fetch('/api/export/cypher', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to export Cypher script');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neo4j_export.cypher';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportReport(): Promise<void> {
    const response = await fetch('/api/export/report', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to export report');
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forensic_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getMLAnalysis(threshold = 85, mode = true): Promise<any> {
    const response = await fetch(`/api/ml/analysis?threshold=${threshold}&mode=${mode}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch ML analysis');
    }
    return response.json();
  }

  async clearResult(): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/clear', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to clear results');
    return response.json();
  }

  async searchDarkWeb(address: string): Promise<any> {
    const response = await fetch('/api/darkweb/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    if (!response.ok) throw new Error('Failed to search dark web database');
    return response.json();
  }

  async getDarkWebIntelligence(): Promise<any> {
    const response = await fetch('/api/darkweb/intelligence');
    if (!response.ok) throw new Error('Failed to fetch dark web intelligence');
    return response.json();
  }

  async scanIP(ip: string): Promise<any> {
    const response = await fetch('/api/darkweb/ip_scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
    });
    if (!response.ok) throw new Error('Failed to scan IP address');
    return response.json();
  }

  async login(username: string, password: string): Promise<any> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }
    return response.json();
  }

  async detectClusters(): Promise<any> {
    const response = await fetch('/api/graph/clusters');
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to detect clusters');
    }
    return response.json();
  }

  async traceFlow(wallet: string): Promise<any> {
    const response = await fetch('/api/graph/trace_flow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to trace flow');
    }
    return response.json();
  }
}

export const api = new ApiService();
