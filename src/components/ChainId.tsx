import { useEffect, useState } from "react";

const ChainId = () => {
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchChainId = async () => {
    if (window.ethereum) {
      try {
        const chainHex = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(chainHex);
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("Please install MetaMask");
    }
  };

  useEffect(() => {
    fetchChainId();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Ethereum Chain ID</h1>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : chainId ? (
          <div>
            <p className="text-gray-700">
              <strong>Hexadecimal:</strong> {chainId}
            </p>
            <p className="text-gray-700">
              <strong>Decimal:</strong> {parseInt(chainId, 16)}
            </p>
          </div>
        ) : (
          <p>Loading Chain ID...</p>
        )}
      </div>
    </div>
  );
};

export default ChainId;
