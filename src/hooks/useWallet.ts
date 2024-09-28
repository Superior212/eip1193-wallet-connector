import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Declare global ethereum object for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}

export const useWallet = () => {
  // State variables to store wallet information
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to handle wallet events and initial setup
  useEffect(() => {
    if (window.ethereum) {
      // Event: accountsChanged
      // This event is fired when the user switches accounts in their wallet
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          // If no accounts are available, reset the state
          setAccount(null);
          setBalance(null);
        }
      });

      // Fetch the initial network when the component mounts
      fetchNetwork();

      // Event: chainChanged
      // This event is fired when the user switches networks in their wallet
      window.ethereum.on("chainChanged", (chainId: string) => {
        setNetwork(getNetworkName(chainId));
        if (account) {
          // Refetch balance when network changes
          fetchBalance(account);
        }
      });

      // Cleanup function to remove event listeners
      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
  }, [account]); // Dependency on 'account' to refetch balance when network changes

  // Function to fetch the current network name
  const fetchNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setNetwork(getNetworkName(chainId));
      } catch (error) {
        setError("Failed to fetch network");
      }
    }
  };

  // Helper function to map chain ID to human-readable network names
  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case "0x1":
        return "Mainnet";
      case "0x2105":
        return "Base";
      case "0xaa36a7":
        return "Sepolia";
      default:
        return "Unknown Network";
    }
  };

  // Function to connect the wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
        fetchNetwork();
      } catch (err: any) {
        setError(err.message || "Failed to connect wallet");
      }
    } else {
      setError("Please install MetaMask");
    }
  };

  // Function to disconnect the wallet (reset state)
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  };

  // Function to fetch the balance of a given address
  const fetchBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (err: any) {
        setError("Failed to fetch balance");
      }
    } else {
      setError("Ethereum provider not found");
    }
  };

  // Return the state and functions for use in components
  return {
    account,
    balance,
    network,
    error,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  };
};
