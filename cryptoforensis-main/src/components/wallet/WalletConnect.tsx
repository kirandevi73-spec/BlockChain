import { useMetaMask, CHAIN_NAMES } from '@/hooks/useMetaMask';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function WalletConnect() {
  const { account, chainId, balance, isConnecting, isMetaMaskInstalled, connectWallet, disconnectWallet, formatAddress } = useMetaMask();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const analyzeWallet = () => {
    if (account) {
      navigate(`/wallets?address=${account}&blockchain=Ethereum`);
    }
  };

  const chainName = chainId ? (CHAIN_NAMES[chainId] ?? `Chain ${parseInt(chainId, 16)}`) : null;

  // ── Not connected ────────────────────────────────────────────────────────────
  if (!account) {
    return (
      <Button
        id="metamask-connect-btn"
        onClick={connectWallet}
        disabled={isConnecting}
        variant="glow"
        size="sm"
        className="gap-2 relative overflow-hidden group"
      >
        {/* animated shimmer */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        {isMetaMaskInstalled ? (
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        {isConnecting ? 'Connecting…' : 'Connect MetaMask'}
      </Button>
    );
  }

  // ── Connected ────────────────────────────────────────────────────────────────
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="metamask-connected-btn"
          variant="outline"
          size="sm"
          className="gap-2 border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all"
        >
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-4 w-4" />
          <span className="font-mono text-sm">{formatAddress(account)}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-6" />
            <span className="font-semibold text-sm">MetaMask</span>
            <Badge variant="success" className="ml-auto text-[10px] py-0 h-4">Connected</Badge>
          </div>

          {/* Address */}
          <div className="font-mono text-xs text-muted-foreground bg-background/50 rounded px-2 py-1 break-all">
            {account}
          </div>

          {/* Chain + Balance */}
          <div className="flex items-center justify-between mt-2 text-xs">
            {chainName && (
              <span className="text-primary font-medium">{chainName}</span>
            )}
            {balance !== null && (
              <span className="text-foreground font-bold">{balance} ETH</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">
          Actions
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer mx-1 rounded">
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={analyzeWallet} className="gap-2 cursor-pointer mx-1 rounded">
          <ExternalLink className="h-4 w-4 text-primary" />
          Analyze This Wallet
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={disconnectWallet}
          className="gap-2 text-destructive cursor-pointer mx-1 mb-1 rounded hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
