import { Toaster } from "./components/ui/toaster";
import WalletConnectV2 from "./conponents/WalletConnectV2";

function App() {
  return (
    <div className="h-screen sm:max-h-[100vh] bg-[#092324]">
      <Toaster />
      <WalletConnectV2 />
    </div>
  );
}

export default App;
