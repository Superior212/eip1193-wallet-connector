import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  WalletIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const WalletConnectV2 = () => {
  const { account, balance, network, error, connectWallet, disconnectWallet } =
    useWallet();

  const [addressInput, setAddressInput] = useState<string>("");
  const [checkedAddress, setCheckedAddress] = useState<string | null>(null);
  const [inputAddressBalance, setInputAddressBalance] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
  };

  const handleCheckBalance = async () => {
    if (!addressInput) {
      toast({
        title: "Error",
        description: "Please enter an Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    setCheckedAddress(addressInput);
    setIsLoading(true);

    try {
      if (!window.ethereum) throw new Error("No Ethereum provider found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(addressInput);
      setInputAddressBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching balance:", err);
      setInputAddressBalance(null);
      toast({
        title: "Error",
        description:
          "Failed to fetch balance. Please check the address and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "The wallet address has been copied to your clipboard.",
        duration: 2000,
      });
    }
  };

  return (
    <div className="container h-full flex flex-col justify-center mx-auto p-4 max-w-5xl">
      <div className="sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Card for Wallet Connection */}
        <Card className="sm:h-full sm:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl">Wallet Connection</CardTitle>
          </CardHeader>
          <CardContent>
            {account ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Connected Address:</p>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" asChild>
                      <a
                        href={`https://etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
                  {account}
                </p>
                <div className="bg-primary/10 p-4 rounded-md">
                  <p className="text-sm text-primary mb-1">Wallet Balance:</p>
                  <p className="text-2xl font-bold text-primary">
                    {balance ? `${balance} ETH` : "Loading..."}
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-md">
                  <p className="text-sm text-primary mb-1">Network:</p>
                  <p className="text-2xl font-bold text-primary">
                    {network || "Fetching..."}
                  </p>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="destructive"
                  className="w-full">
                  Disconnect Wallet
                </Button>
              </motion.div>
            ) : (
              <Button onClick={connectWallet} className="w-full">
                <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Card for Wallet Dashboard */}
        <Card className="sm:h-full sm:w-1/2 ">
          <CardHeader className="my-1">
            <CardTitle className="text-2xl">Wallet Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-10 mt-10">
              <Input
                type="text"
                placeholder="Enter Ethereum address"
                value={addressInput}
                onChange={handleAddressChange}
              />
              <Button
                onClick={handleCheckBalance}
                className="w-full"
                disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Check Balance
              </Button>

              {checkedAddress && (
                <motion.div
                  className="text-center mt-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}>
                  <p className="text-sm text-gray-500">Checked Address:</p>
                  <p className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
                    {checkedAddress}
                  </p>
                  <p className="text-2xl font-bold">
                    {inputAddressBalance ? `${inputAddressBalance} ETH` : "N/A"}
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WalletConnectV2;
