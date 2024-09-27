import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UnlinkIcon } from "lucide-react";
declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  //check if wallet is installed
  useEffect(() => {
    if (window.ethereum) {
      setMessage("Ethereum wallet found");
    } else {
      setMessage("Ethereum wallet not found");
    }
  }, []);

  // function to Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    } else {
      setError("Please install Metamask");
    }
  };

  function disconnectWallet() {
    setAccount(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Wallet Connect
          </CardTitle>
        </CardHeader>
        <div className="p-3 max-w-[12rem] mx-auto mb-5 bg-gray-200 rounded-lg">
          <p className="text-sm font-semibold text-center text-gray-900">
            {message}
          </p>
        </div>
        <CardContent>
          {!account ? (
            <Button className="w-full" onClick={connectWallet}>
              <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  Connected Account
                </p>
                <p className="text-sm font-semibold text-gray-900 break-all">
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
          {error && <p>{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
