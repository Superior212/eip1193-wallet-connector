import { Toaster } from "./components/ui/toaster";
import WalletConnectV3 from "./components/WalletConnectV3";

function App() {
  return (
    <div className="h-screen sm:max-h-[100vh] bg-[#092324]">
      <Toaster />
      <WalletConnectV3 />
    </div>
  );
}

export default App;
