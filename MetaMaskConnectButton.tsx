import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMetaMask } from './MetaMaskProvider';
import { Wallet, WifiOff, CheckCircle } from 'lucide-react';

export const MetaMaskConnectButton: React.FC = () => {
  const { isConnected, account, connect, disconnect, switchNetwork } = useMetaMask();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      alert('Failed to connect to MetaMask. Please make sure it is installed and unlocked.');
    }
  };

  const handleSwitchToEthereum = async () => {
    try {
      await switchNetwork('0x1'); // Ethereum Mainnet
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const handleSwitchToPolygon = async () => {
    try {
      await switchNetwork('0x89'); // Polygon
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect MetaMask Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Connect your MetaMask wallet to enable prophecy betting and blockchain verification.
          </p>
          <Button 
            onClick={handleConnect} 
            className="w-full"
            size="lg"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-2">
            {formatAddress(account!)}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your wallet is connected and ready for blockchain features.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Network Switch:</h4>
          <div className="flex gap-2">
            <Button 
              onClick={handleSwitchToEthereum}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Ethereum
            </Button>
            <Button 
              onClick={handleSwitchToPolygon}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Polygon
            </Button>
          </div>
        </div>

        <Button 
          onClick={disconnect} 
          variant="destructive" 
          className="w-full"
          size="sm"
        >
          <WifiOff className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
};