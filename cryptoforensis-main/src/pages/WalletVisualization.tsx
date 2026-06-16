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
import { Search, Loader2, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, type AnalysisResponse, type Transaction, type SuspiciousNode } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { useMetaMask } from '@/hooks/useMetaMask';

const WalletVisualization = () => {
  const [blockchain, setBlockchain] = useState(() => localStorage.getItem('last_blockchain') || 'Solana');
  const [inputVal, setInputVal] = useState(() => localStorage.getItem('last_wallet_address') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { account: mmAccount, formatAddress } = useMetaMask();

  useEffect(() => {
    // Save to localStorage whenever these change
    localStorage.setItem('last_blockchain', blockchain);
    localStorage.setItem('last_wallet_address', inputVal);
  }, [blockchain, inputVal]);

  // Listen for real-time MetaMask account change events
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ account: string }>;
      setInputVal(custom.detail.account);
      setBlockchain('Ethereum');
      toast({ title: 'MetaMask account detected', description: `Address auto-filled: ${formatAddress(custom.detail.account)}` });
    };
    window.addEventListener('mm_account_changed', handler);
    return () => window.removeEventListener('mm_account_changed', handler);
  }, [formatAddress, toast]);

  // Reset all local state when "Clear All Data" is clicked
  useEffect(() => {
    const handleClear = () => {
      setInputVal('');
      setBlockchain('Solana');
      setResult(null);
    };
    window.addEventListener('forensic_data_cleared', handleClear);
    return () => window.removeEventListener('forensic_data_cleared', handleClear);
  }, []);

  useEffect(() => {
    const address = searchParams.get('address');
    const chain = searchParams.get('blockchain');
    
    if (chain) setBlockchain(chain);
    
    if (address) {
      setInputVal(address);
      handleAnalyzeWithParams(address, chain || blockchain);
    } else if (inputVal) {
      // If no URL params but we have a stored address, load it
      handleAnalyzeWithParams(inputVal, blockchain);
    }
  }, [searchParams]);

  const handleAnalyzeWithParams = async (addr: string, chain: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.analyze({ blockchain: chain, input: addr });
      setResult(data);
      if (data.error) {
        toast({ title: 'Analysis Error', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Analysis Complete', description: `Found ${data.transactions.length} transactions.` });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => handleAnalyzeWithParams(inputVal, blockchain);

  return (
    <Layout
      title="Wallet Visualization"
      subtitle="Interactive exploration of wallet linkages and connections"
    >
      {/* Search Input Controls */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={blockchain} onValueChange={setBlockchain}>
            <SelectTrigger className="w-40 bg-secondary">
              <SelectValue placeholder="Blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solana">Solana</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
              <SelectItem value="Bitcoin">Bitcoin</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter Wallet Address or Hash..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="pl-10 bg-secondary"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>

          <Button variant="glow" onClick={handleAnalyze} disabled={loading || !inputVal} className="min-w-[120px]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Analyze
          </Button>

          {/* MetaMask Auto-fill button */}
          {mmAccount && (
            <Button
              id="use-metamask-wallet-btn"
              variant="outline"
              size="sm"
              className="gap-2 border-primary/40 bg-primary/10 hover:bg-primary/20 whitespace-nowrap"
              onClick={() => {
                setInputVal(mmAccount);
                setBlockchain('Ethereum');
                toast({ title: 'MetaMask wallet loaded', description: `Address: ${formatAddress(mmAccount)}` });
              }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-4 w-4" />
              <Wallet className="h-4 w-4" />
              Use Connected Wallet
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Suspicious Nodes */}
          {result.suspicious_nodes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-destructive">
                  Suspicious Nodes Detected ({result.suspicious_nodes.length})
                </h3>
              </div>
              <div className="glass-card overflow-hidden border-destructive/30">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Node</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP / Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.suspicious_nodes.map((node, i) => (
                        <tr key={i} className="hover:bg-secondary/50">
                          <td className="px-4 py-4 text-sm font-mono">{node.node}</td>
                          <td className="px-4 py-4"><Badge variant="danger">{node.score}</Badge></td>
                          <td className="px-4 py-4 text-sm">{node.ip} / {node.walletLabel}</td>
                          <td className="px-4 py-4 text-sm text-warning">{node.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Transactions List
              </h3>
              <span className="text-sm text-muted-foreground">
                {result.transactions.length} records found
              </span>
            </div>
            
            {result.transactions.length === 0 ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                No transactions found for this address.
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">From</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">To</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP / Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-secondary/50">
                          <td className="px-4 py-3 text-xs font-mono">{tx.from}</td>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{tx.to}</td>
                          <td className="px-4 py-3 text-sm font-medium">{tx.amount.toFixed(6)} {tx.currency}</td>
                          <td className="px-4 py-3 text-xs">{tx.ip} / {tx.walletLabel}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{tx.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WalletVisualization;
