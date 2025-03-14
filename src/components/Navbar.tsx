import React from "react";
import useWeb3 from "../hooks/useWeb3";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="flex justify-between items-center p-4 bg-yellow-400 border-4 border-black shadow-brutal">
      <h1 className="text-2xl font-bold">NexPager</h1>
      <div className="flex gap-4">
        <Link to="/received" className="px-4 py-2 bg-white border-2 border-black shadow-brutal">
          Received Messages
        </Link>
        <button onClick={connectWallet} className="px-4 py-2 bg-white border-2 border-black shadow-brutal">
          {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
