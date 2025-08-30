import { useState } from 'react';
import { Wallet, Copy, CheckCircle, Bitcoin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CryptoDonationProps {
  onDonationComplete?: (amount: string, currency: string) => void;
}

export default function CryptoDonation({ onDonationComplete }: CryptoDonationProps) {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const donationAmounts = [
    { amount: '10', label: '$10' },
    { amount: '25', label: '$25' },
    { amount: '50', label: '$50' },
    { amount: '100', label: '$100' },
    { amount: '250', label: '$250' },
  ];

  const cryptoAddresses = {
    ethereum: '0x742e4C39DB7C8C89B4b83e5e5E5e6F7C8F9A1B2D',
    bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    litecoin: 'LTC123456789abcdefghijklmnopqrstuvwxyz',
    polygon: '0x742e4C39DB7C8C89B4b83e5e5E5e6F7C8F9A1B2D'
  };

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: "MetaMask wallet connected successfully"
        });
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to donate with cryptocurrency",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const copyAddress = (address: string, currency: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: `${currency} address copied to clipboard`
    });
  };

  const handleDonation = async () => {
    const amount = customAmount || selectedAmount;
    if (!amount) {
      toast({
        title: "Amount Required",
        description: "Please select or enter a donation amount",
        variant: "destructive"
      });
      return;
    }

    try {
      if (walletConnected && (window as any).ethereum) {
        // Convert USD to ETH (simplified - in production, use real exchange rates)
        const ethAmount = (parseFloat(amount) / 2000).toFixed(6); // Assuming 1 ETH = $2000
        
        const transactionParameters = {
          to: cryptoAddresses.ethereum,
          from: walletAddress,
          value: (parseFloat(ethAmount) * Math.pow(10, 18)).toString(16), // Convert to Wei
        };

        await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        toast({
          title: "Donation Sent",
          description: `Thank you for your $${amount} donation!`
        });

        onDonationComplete?.(amount, 'ETH');
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Donation transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Support Our Ministry</h2>
        <p className="text-muted-foreground">
          Help us continue providing prophetic insights and biblical guidance
        </p>
      </div>

      <Tabs defaultValue="metamask" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metamask">MetaMask Wallet</TabsTrigger>
          <TabsTrigger value="addresses">Direct Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="metamask" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Crypto Donation via MetaMask
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!walletConnected ? (
                <Button 
                  onClick={connectWallet} 
                  disabled={connecting}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {connecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Label>Select Donation Amount</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {donationAmounts.map((item) => (
                        <Button
                          key={item.amount}
                          variant={selectedAmount === item.amount ? 'default' : 'outline'}
                          onClick={() => {
                            setSelectedAmount(item.amount);
                            setCustomAmount('');
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-amount">Custom Amount (USD)</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount('');
                      }}
                    />
                  </div>

                  <Button 
                    onClick={handleDonation}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                    disabled={!selectedAmount && !customAmount}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Donate ${customAmount || selectedAmount}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(cryptoAddresses).map(([currency, address]) => (
              <Card key={currency}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4" />
                        <Badge variant="secondary" className="capitalize">
                          {currency}
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground break-all">
                        {address}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAddress(address, currency)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Send any amount to the addresses above</p>
            <p>All donations support our prophetic ministry</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Your donation helps us provide free prophetic insights to believers worldwide
        </p>
        <p className="text-xs text-muted-foreground">
          Tax-deductible receipts available • Ministry registration pending
        </p>
      </div>
    </div>
  );
}