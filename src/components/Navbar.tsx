import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { WalletComponents } from "./Wallet";
const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center border-b-4 border-black">
      <h1 className="text-xl font-bold">NexPager</h1>
      <div className="space-x-4">
        <Link to="/" className="px-4 py-2 bg-white text-black border-2 border-black shadow-brutal">Home</Link>
        <Link to="/received" className="px-4 py-2 bg-white text-black border-2 border-black shadow-brutal">Received Messages</Link>
      </div>
      <div>
        {account ? (
          <div className="flex items-center space-x-4">
            <span className="bg-white text-black px-3 py-1 border border-black shadow-brutal">{account.slice(0, 6)}...{account.slice(-4)}</span>
            <button onClick={disconnectWallet} className="px-4 py-2 bg-red-500 border-2 border-black shadow-brutal">Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet} className="px-4 py-2 bg-green-500 border-2 border-black shadow-brutal">Connect Wallet</button>
        )}
      </div>
      <WalletComponents />
    </nav>
  );
};

export default Navbar;
