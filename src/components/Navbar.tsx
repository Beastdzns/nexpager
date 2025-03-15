import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { WalletComponents } from "./Wallet";
const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <nav className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold tracking-wider text-white animate-pulse">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">NexPager</span>
      </h1>
      
      <div className="space-x-6">
        <Link to="/home" className="text-white hover:text-pink-200 font-medium transition-all duration-300 hover:scale-105 relative group">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link to="/received" className="text-white hover:text-pink-200 font-medium transition-all duration-300 hover:scale-105 relative group">
          Received Messages
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>
      
      <div className="animate-slideIn" style={{animationDelay: '200ms'}}>
        {account ? (
          <div className="flex items-center space-x-4">
            <span className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white border-opacity-20">{account.slice(0, 6)}...{account.slice(-4)}</span>
            <button onClick={disconnectWallet} className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-pink-500/30 hover:scale-105">Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet} className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-pink-500/30 hover:scale-105">Connect Wallet</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
