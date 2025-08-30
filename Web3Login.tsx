import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface Web3LoginProps {
  onLogin: (address: string, balance: string) => void;
  onError: (error: string) => void;
}

export function Web3Login({ onLogin, onError }: Web3LoginProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    checkMetaMaskInstallation();
    checkExistingConnection();
  }, []);

  const checkMetaMaskInstallation = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true);
    }
  };

  const checkExistingConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await getBalance(accounts[0]);
          await getChainId();
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    }
  };

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
      setBalance(balanceInEth);
      return balanceInEth;
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  };

  const getChainId = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chainId);
      return chainId;
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      onError('MetaMask not detected. Please install MetaMask extension.');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        
        const balanceValue = await getBalance(address);
        await getChainId();
        
        onLogin(address, balanceValue);
      }
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      if (error.code === 4001) {
        onError('Connection rejected by user');
      } else {
        onError(`Connection failed: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }] // Mainnet
      });
      await getChainId();
    } catch (error) {
      console.error('Error switching to mainnet:', error);
    }
  };

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case '0x1': return 'Ethereum Mainnet';
      case '0x89': return 'Polygon';
      case '0xa86a': return 'Avalanche';
      case '0x38': return 'BSC';
      case '0x5': return 'Goerli Testnet';
      default: return 'Unknown Network';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <CardTitle>MetaMask Required</CardTitle>
          <CardDescription>
            Install MetaMask to connect your Web3 wallet and access premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is a browser extension that lets you interact with blockchain applications.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')} 
            className="w-full"
          >
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (account) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>
            Your Web3 wallet is successfully connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Address:</span>
              <Badge variant="secondary">{formatAddress(account)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <Badge variant="outline">{balance} ETH</Badge>
            </div>
            {chainId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network:</span>
                <Badge variant={chainId === '0x1' ? 'default' : 'destructive'}>
                  {getNetworkName(chainId)}
                </Badge>
              </div>
            )}
          </div>
          
          {chainId !== '0x1' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For best experience, please switch to Ethereum Mainnet
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            {chainId !== '0x1' && (
              <Button onClick={switchToMainnet} variant="outline" size="sm">
                Switch to Mainnet
              </Button>
            )}
            <Button 
              onClick={() => window.location.reload()} 
              variant="ghost" 
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <CardTitle>Connect Web3 Wallet</CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to access premium features and make donations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Secure connection via MetaMask</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>No personal data stored</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Support crypto donations</span>
          </div>
        </div>
        
        <Button 
          onClick={connectMetaMask} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect MetaMask
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Web3Login;