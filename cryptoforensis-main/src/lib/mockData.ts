// Mock data for the blockchain forensics dashboard

export interface Wallet {
  id: string;
  address: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  connectionCount: number;
  totalVolume: number;
  lastActivity: string;
  isDarkWebLinked: boolean;
  flags: string[];
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  riskScore: number;
  isFlagged: boolean;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  walletAddress?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  value: number;
}

// Generate random wallet address
const generateAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// Mock wallets
export const mockWallets: Wallet[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8b2d1',
    riskScore: 92,
    riskLevel: 'critical',
    connectionCount: 47,
    totalVolume: 15420000,
    lastActivity: '2024-01-15T14:30:00Z',
    isDarkWebLinked: true,
    flags: ['Dark Web Mixer', 'High Volume', 'Multiple Jurisdictions'],
  },
  {
    id: '2',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    riskScore: 78,
    riskLevel: 'high',
    connectionCount: 23,
    totalVolume: 8750000,
    lastActivity: '2024-01-14T09:15:00Z',
    isDarkWebLinked: true,
    flags: ['Ransomware Associated', 'Layered Transactions'],
  },
  {
    id: '3',
    address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    riskScore: 45,
    riskLevel: 'medium',
    connectionCount: 12,
    totalVolume: 2340000,
    lastActivity: '2024-01-13T18:45:00Z',
    isDarkWebLinked: false,
    flags: ['Under Review', 'New Wallet'],
  },
  {
    id: '4',
    address: '0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D',
    riskScore: 15,
    riskLevel: 'low',
    connectionCount: 5,
    totalVolume: 125000,
    lastActivity: '2024-01-12T11:20:00Z',
    isDarkWebLinked: false,
    flags: [],
  },
  {
    id: '5',
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    riskScore: 88,
    riskLevel: 'critical',
    connectionCount: 89,
    totalVolume: 45000000,
    lastActivity: '2024-01-15T16:00:00Z',
    isDarkWebLinked: true,
    flags: ['Money Laundering', 'Exchange Hop', 'Dark Web Forum'],
  },
  {
    id: '6',
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    riskScore: 62,
    riskLevel: 'high',
    connectionCount: 34,
    totalVolume: 5600000,
    lastActivity: '2024-01-14T22:10:00Z',
    isDarkWebLinked: false,
    flags: ['Suspicious Pattern', 'High Frequency'],
  },
];

// Mock transactions
export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
  id: `tx-${i + 1}`,
  from: generateAddress(),
  to: generateAddress(),
  amount: Math.random() * 100000,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  riskScore: Math.floor(Math.random() * 100),
  isFlagged: Math.random() > 0.7,
}));

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Dark Web Transaction Detected',
    message: 'Wallet 0x742d...b2d1 received funds from known dark web mixer',
    timestamp: '2024-01-15T14:35:00Z',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8b2d1',
  },
  {
    id: '2',
    type: 'critical',
    title: 'ML Anomaly Detection',
    message: 'Unusual transaction pattern detected: 15 rapid transfers in 2 minutes',
    timestamp: '2024-01-15T13:22:00Z',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  },
  {
    id: '3',
    type: 'warning',
    title: 'High-Risk Connection',
    message: 'New connection to previously flagged wallet cluster',
    timestamp: '2024-01-15T12:10:00Z',
    walletAddress: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Volume Threshold Exceeded',
    message: 'Daily transaction volume exceeded $1M threshold',
    timestamp: '2024-01-15T10:45:00Z',
  },
  {
    id: '5',
    type: 'info',
    title: 'New Wallet Cluster Identified',
    message: 'Graph analysis revealed new cluster of 12 connected wallets',
    timestamp: '2024-01-15T09:30:00Z',
  },
];

// Mock graph data for visualization
export const mockGraphNodes: GraphNode[] = [
  { id: 'w1', label: '0x742d...b2d1', riskLevel: 'critical', x: 400, y: 300 },
  { id: 'w2', label: '0x8Ba1...BA72', riskLevel: 'high', x: 250, y: 200 },
  { id: 'w3', label: '0x1CBd...C9Ec', riskLevel: 'medium', x: 550, y: 200 },
  { id: 'w4', label: '0x9A8f...b04D', riskLevel: 'low', x: 300, y: 450 },
  { id: 'w5', label: '0xdD2F...44C0', riskLevel: 'critical', x: 500, y: 450 },
  { id: 'w6', label: '0x2546...Ec30', riskLevel: 'high', x: 150, y: 350 },
  { id: 'w7', label: '0xf39F...2266', riskLevel: 'medium', x: 650, y: 350 },
  { id: 'w8', label: '0x70997...0C2E', riskLevel: 'low', x: 400, y: 150 },
];

export const mockGraphEdges: GraphEdge[] = [
  { source: 'w1', target: 'w2', value: 25000 },
  { source: 'w1', target: 'w3', value: 15000 },
  { source: 'w1', target: 'w5', value: 100000 },
  { source: 'w2', target: 'w6', value: 8000 },
  { source: 'w2', target: 'w8', value: 5000 },
  { source: 'w3', target: 'w7', value: 12000 },
  { source: 'w4', target: 'w1', value: 3000 },
  { source: 'w5', target: 'w6', value: 45000 },
  { source: 'w5', target: 'w7', value: 22000 },
  { source: 'w6', target: 'w4', value: 7500 },
  { source: 'w7', target: 'w8', value: 9000 },
  { source: 'w8', target: 'w3', value: 4500 },
];

// Dashboard stats
export const dashboardStats = {
  totalWallets: 15847,
  flaggedWallets: 342,
  totalTransactions: 1245678,
  suspiciousTransactions: 8934,
  darkWebLinked: 127,
  mlAlerts: 56,
  averageRiskScore: 34,
  criticalAlerts: 12,
};

// Risk distribution data for charts
export const riskDistribution = [
  { name: 'Low', value: 12450, color: 'hsl(142, 76%, 45%)' },
  { name: 'Medium', value: 2156, color: 'hsl(38, 92%, 50%)' },
  { name: 'High', value: 899, color: 'hsl(25, 95%, 53%)' },
  { name: 'Critical', value: 342, color: 'hsl(0, 84%, 60%)' },
];

// Transaction volume over time
export const transactionVolume = [
  { date: 'Jan 1', volume: 245000, flagged: 12000 },
  { date: 'Jan 2', volume: 312000, flagged: 18000 },
  { date: 'Jan 3', volume: 287000, flagged: 15000 },
  { date: 'Jan 4', volume: 425000, flagged: 45000 },
  { date: 'Jan 5', volume: 389000, flagged: 28000 },
  { date: 'Jan 6', volume: 512000, flagged: 62000 },
  { date: 'Jan 7', volume: 478000, flagged: 35000 },
  { date: 'Jan 8', volume: 356000, flagged: 22000 },
  { date: 'Jan 9', volume: 445000, flagged: 38000 },
  { date: 'Jan 10', volume: 523000, flagged: 55000 },
  { date: 'Jan 11', volume: 489000, flagged: 42000 },
  { date: 'Jan 12', volume: 567000, flagged: 68000 },
  { date: 'Jan 13', volume: 612000, flagged: 85000 },
  { date: 'Jan 14', volume: 534000, flagged: 48000 },
  { date: 'Jan 15', volume: 598000, flagged: 72000 },
];

// ML prediction confidence data
export const mlPredictions = [
  { category: 'Normal Transaction', confidence: 94, count: 145000 },
  { category: 'Suspicious Pattern', confidence: 87, count: 5600 },
  { category: 'Money Laundering', confidence: 92, count: 890 },
  { category: 'Mixer Usage', confidence: 89, count: 1200 },
  { category: 'Exchange Hop', confidence: 78, count: 3400 },
  { category: 'Dark Web Link', confidence: 95, count: 127 },
];

// Dark web association data
export const darkWebData = {
  totalLinked: 127,
  activeToday: 23,
  newThisWeek: 45,
  sources: [
    { name: 'Mixers', count: 45, percentage: 35 },
    { name: 'Forums', count: 32, percentage: 25 },
    { name: 'Markets', count: 28, percentage: 22 },
    { name: 'Ransomware', count: 15, percentage: 12 },
    { name: 'Other', count: 7, percentage: 6 },
  ],
  timeline: [
    { date: 'Week 1', count: 12 },
    { date: 'Week 2', count: 18 },
    { date: 'Week 3', count: 25 },
    { date: 'Week 4', count: 32 },
    { date: 'Week 5', count: 28 },
    { date: 'Week 6', count: 45 },
  ],
};
