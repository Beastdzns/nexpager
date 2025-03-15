import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import Home from "./pages/Home";
import Self from "./pages/Self";
import ReceivedMessages from "./pages/ReceivedMessages";
import { Web3Provider } from "./context/Web3Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'nexpager',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});


const App = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={new QueryClient()}>
      <Web3Provider>
        <Router>
        <Routes>
          <Route path="/" element={<Self />} />
          <Route path="/home" element={<Home />} />
          <Route path="/received" element={<ReceivedMessages />} />
        </Routes>
        </Router>
      </Web3Provider>
      </QueryClientProvider>
      {children}
    </WagmiProvider>
  );
};

export default App;
