import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface MetaMaskContextType {
  account: string | null;
  chainId: string | null;
  balance: string | null;
  isConnecting: boolean;
  isMetaMaskInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (address: string) => string;
}

const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Ethereum Mainnet',
  '0x89': 'Polygon',
  '0x38': 'BSC',
  '0xa': 'Optimism',
  '0xa4b1': 'Arbitrum',
  '0x5': 'Goerli',
  '0xaa36a7': 'Sepolia',
};

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(() => localStorage.getItem('mm_account'));
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isMetaMaskInstalled = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const fetchBalance = useCallback(async (addr: string) => {
    if (!window.ethereum || !addr) return;
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      }) as string;
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = (balanceWei / 1e18).toFixed(4);
      setBalance(balanceEth);
    } catch {
      setBalance(null);
    }
  }, []);

  const fetchChain = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      const chain = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      setChainId(chain);
    } catch {
      setChainId(null);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    // Check if already connected on load
    const checkExisting = async () => {
      try {
        const accounts = await window.ethereum!.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem('mm_account', accounts[0]);
          await fetchChain();
          await fetchBalance(accounts[0]);
        } else {
          // Clear stale stored account if MetaMask was disconnected externally
          localStorage.removeItem('mm_account');
          setAccount(null);
        }
      } catch { /* ignore */ }
    };

    checkExisting();

    const handleAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[];
      if (list.length === 0) {
        setAccount(null);
        setBalance(null);
        localStorage.removeItem('mm_account');
        toast.info('MetaMask wallet disconnected');
      } else {
        setAccount(list[0]);
        localStorage.setItem('mm_account', list[0]);
        fetchBalance(list[0]);
        // Dispatch event so WalletVisualization can react
        window.dispatchEvent(new CustomEvent('mm_account_changed', { detail: { account: list[0] } }));
      }
    };

    const handleChainChanged = (chain: unknown) => {
      setChainId(chain as string);
      toast.info(`Network changed to ${CHAIN_NAMES[chain as string] ?? 'Unknown Network'}`);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [fetchBalance, fetchChain]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected', {
        description: 'Please install the MetaMask browser extension.',
        action: {
          label: 'Install',
          onClick: () => window.open('https://metamask.io/download/', '_blank'),
        },
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('mm_account', accounts[0]);
        await fetchChain();
        await fetchBalance(accounts[0]);
        toast.success('MetaMask Connected!', {
          description: `Wallet: ${formatAddress(accounts[0])}`,
        });
        window.dispatchEvent(new CustomEvent('mm_account_changed', { detail: { account: accounts[0] } }));
      }
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 4001) {
        toast.error('Connection rejected', { description: 'You rejected the connection request.' });
      } else {
        toast.error('Connection failed', { description: 'Could not connect to MetaMask.' });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    localStorage.removeItem('mm_account');
    toast.info('Wallet disconnected');
  };

  return (
    <MetaMaskContext.Provider
      value={{ account, chainId, balance, isConnecting, isMetaMaskInstalled, connectWallet, disconnectWallet, formatAddress }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const ctx = useContext(MetaMaskContext);
  if (!ctx) throw new Error('useMetaMask must be used within a MetaMaskProvider');
  return ctx;
};

export { CHAIN_NAMES };
