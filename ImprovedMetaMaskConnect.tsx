import React, { useState } from "react";
import { useMetaMask } from "./MetaMaskProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

const ImprovedMetaMaskConnect = () => {
  const { isConnected, account, connect, disconnect, switchNetwork } = useMetaMask();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connect();
    } catch (err: any) {
      console.error("MetaMask connection failed", err);
      if (err.code === 4001) {
        setError("Connection was rejected by user");
      } else if (err.message.includes("not installed")) {
        setError("MetaMask is not installed. Please install MetaMask browser extension.");
      } else {
        setError(err.message || "Failed to connect to MetaMask");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
  };

  const handleNetworkSwitch = async (chainId: string, networkName: string) => {
    try {
      await switchNetwork(chainId);
    } catch (err: any) {
      console.error(`Failed to switch to ${networkName}:`, err);
      setError(`Failed to switch to ${networkName}. Please try manually in MetaMask.`);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkFromAccount = () => {
    // This would typically come from checking the current network
    // For now, we'll show generic "Connected" status
    return "Connected";
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect MetaMask to access prophecy betting and blockchain verification features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </Button>
            
            {typeof window !== 'undefined' && !window.ethereum && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Don't have MetaMask installed?
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://metamask.io/download/', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Install MetaMask
                </Button>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Supported Networks:</p>
            <div className="flex justify-center gap-2 mt-1">
              <Badge variant="outline">Ethereum</Badge>
              <Badge variant="outline">Polygon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Wallet Connected
        </CardTitle>
        <CardDescription>
          Ready for prophecy betting and blockchain verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {formatAddress(account!)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getNetworkFromAccount()}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-center">Quick Network Switch:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleNetworkSwitch('0x1', 'Ethereum')}
                variant="outline"
                size="sm"
                className="h-10"
              >
                <div className="text-center">
                  <div className="font-medium">Ethereum</div>
                  <div className="text-xs text-muted-foreground">Mainnet</div>
                </div>
              </Button>
              <Button 
                onClick={() => handleNetworkSwitch('0x89', 'Polygon')}
                variant="outline"
                size="sm"
                className="h-10"
              >
                <div className="text-center">
                  <div className="font-medium">Polygon</div>
                  <div className="text-xs text-muted-foreground">MATIC</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Your wallet is securely connected to End Times Tracker</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedMetaMaskConnect;