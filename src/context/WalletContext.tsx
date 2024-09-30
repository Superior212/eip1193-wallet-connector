import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

// Define the shape of the context
interface WalletContextType {
  account: string | null;
  balance: string | null;
  network: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  fetchBalance: (address: string) => Promise<void>;
}

// Create the context with a default undefined value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // State variables for wallet information
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if ethereum is available (e.g., MetaMask is installed)
    if (window.ethereum) {
      // Attempt to get already connected accounts
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

      // Set up event listeners for account and network changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Clean up event listeners when component unmounts
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  // Handle network changes
  const handleChainChanged = async (chainId: string) => {
    setNetwork(getNetworkName(chainId));
    if (account) {
      await fetchBalance(account);
    }
  };

  // Fetch the current network
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

  // Get network name from chain ID
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

  // Connect wallet function
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

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  };

  // Fetch balance for a given address
  const fetchBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (err: any) {
        console.error("Failed to fetch balance:", err);
        setError("Failed to fetch balance");
        setBalance(null);
      }
    } else {
      setError("Ethereum provider not found");
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }
  }, [account, network, fetchBalance]);

  // context value object
  const value = {
    account,
    balance,
    network,
    error,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  };

  // Provide the context value to children components
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
