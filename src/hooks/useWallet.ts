import { useEffect, useState } from "react";
import { ethers } from "ethers";
declare global {
  interface Window {
    ethereum: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle account change and fetch network
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance(null);
        }
      });

      fetchNetwork(); // Fetch network when the component mounts

      // Listen for network changes
      window.ethereum.on("chainChanged", (chainId: string) => {
        setNetwork(getNetworkName(chainId));
        if (account) {
          fetchBalance(account); // Refetch balance when network changes
        }
      });

      return () => {
        // Cleanup event listeners
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
  }, [account]); // Depend on `account` to refetch balance when network changes

  // Function to fetch network name
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

  // Helper function to map chain ID to network names
  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case "0x1":
        return "Mainnet";
      case "0x5":
        return "Goerli";
      case "0xaa36a7":
        return "Sepolia";
      default:
        return "Unknown Network";
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
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

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null); 
  };

  // Function to fetch balance
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
