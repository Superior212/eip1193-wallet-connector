// React component
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UnlinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletConnect = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if wallet is installed and listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      toast({ description: "Ethereum wallet found" });

      // Listen for account changes (in case the user changes account)
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          // Handle account disconnection
          setAccount(null);
        }
      });
    } else {
      toast({ description: "Ethereum wallet not found" });
    }
  }, [toast]);

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        toast({ description: "Wallet connected successfully" });
      } catch (error: any) {
        if (error.code === 4001) {
          // Handle user rejection
          setError("User rejected the request");
        } else {
          setError(error.message);
        }
      }
    } else {
      setError("Please install MetaMask");
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    toast({ description: "Wallet disconnected" });
  };

  return (
    <div className="min-h-screen bg-[#092324] p-4 sm:p-0 flex items-center justify-center">
      <Card className="sm:w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Wallet Connect
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!account ? (
            <Button
              className="w-full bg-[#1E1E1E99] rounded-xl"
              onClick={connectWallet}>
              <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  Connected Account
                </p>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-900 break-all">
                  {account}
                </p>
              </div>
              <Button
                onClick={disconnectWallet}
                className="w-full bg-red-800 text-white hover:bg-red-800">
                <UnlinkIcon className="mr-2 h-4 w-4" /> Disconnect Wallet
              </Button>
            </div>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
