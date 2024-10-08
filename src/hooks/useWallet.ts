import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Declare global ethereum object for TypeScript
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

  useEffect(() => {
    if (window.ethereum) {
      // Fetch the already connected accounts on component mount
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchBalance(accounts[0]);
            fetchNetwork();
          }
        })
        .catch(() => {
          setError("Failed to fetch accounts");
        });

      // Listen for account and network changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Cleanup listeners on unmount
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [account]);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setNetwork(getNetworkName(chainId));
    if (account) {
      fetchBalance(account);
    }
  };

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

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  };

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
