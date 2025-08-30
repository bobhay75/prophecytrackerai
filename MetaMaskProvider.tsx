import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MetaMaskContextType {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  sendTransaction: (to: string, value: string) => Promise<string>;
}

const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

interface MetaMaskProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const MetaMaskProvider: React.FC<MetaMaskProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    setupEventListeners();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.log('MetaMask connection check failed:', error);
      }
    }
  };

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to connect to MetaMask:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const switchNetwork = async (chainId: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error: any) {
        // If the network hasn't been added to MetaMask, add it
        if (error.code === 4902) {
          const networks: Record<string, any> = {
            '0x1': {
              chainId: '0x1',
              chainName: 'Ethereum Mainnet',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.infura.io/v3/demo'],
              blockExplorerUrls: ['https://etherscan.io'],
            },
            '0x89': {
              chainId: '0x89',
              chainName: 'Polygon',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com'],
            },
            '0x13881': {
              chainId: '0x13881',
              chainName: 'Polygon Mumbai Testnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com'],
            },
          };

          if (networks[chainId]) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networks[chainId]],
            });
          }
        }
        throw error;
      }
    }
  };

  const sendTransaction = async (to: string, value: string): Promise<string> => {
    if (typeof window.ethereum !== 'undefined' && account) {
      try {
        const transactionHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: account,
            to,
            value: `0x${parseInt(value).toString(16)}`, // Convert to hex
          }],
        });
        return transactionHash;
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    }
    throw new Error('MetaMask not connected or account not available');
  };

  const contextValue: MetaMaskContextType = {
    isConnected,
    account,
    connect,
    disconnect,
    switchNetwork,
    sendTransaction,
  };

  return (
    <MetaMaskContext.Provider value={contextValue}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = (): MetaMaskContextType => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};