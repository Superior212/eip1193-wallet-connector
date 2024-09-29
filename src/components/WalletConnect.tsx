import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, UnlinkIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

const WalletConnect = () => {
  const {
    account,
    balance,
    error,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  } = useWallet();
  const [addressInput, setAddressInput] = useState<string>("");
  const [checkedAddress, setCheckedAddress] = useState<string | null>(null); // State to store the input address after checking

  // Handle input field changes for address input
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
  };

  // Handle check balance click event
  const handleCheckBalance = () => {
    if (!addressInput) {
      console.log("No address input provided.");
      return;
    }

    console.log(`Checking balance for address: ${addressInput}`);
    setCheckedAddress(addressInput);
    fetchBalance(addressInput);
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
          {/* Show wallet connection button or disconnect option based on account connection status */}
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

              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Balance</p>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-900 break-all">
                  {balance ? `${balance} ETH` : "N/A"}
                </p>
              </div>

              <Button
                onClick={disconnectWallet}
                className="w-full bg-red-800 text-white hover:bg-red-800">
                <UnlinkIcon className="mr-2 h-4 w-4" /> Disconnect Wallet
              </Button>
            </div>
          )}

          {/* Input for address and button to check balance */}
          <div className="mt-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter address"
              value={addressInput}
              onChange={handleAddressChange}
            />
            <Button
              className="w-full mt-2 bg-blue-600 text-white"
              onClick={handleCheckBalance}>
              Check Balance
            </Button>
          </div>

          {/* Display the inputted Ethereum address */}
          {checkedAddress && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">
                Checked Address
              </p>
              <p className="text-sm font-semibold text-gray-900 break-all">
                {checkedAddress}
              </p>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
