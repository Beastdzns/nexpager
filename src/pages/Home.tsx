import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";
import Navbar from "../components/Navbar";
import { useWeb3 } from "../context/Web3Context";

const Home: React.FC = () => {
  const { account, signer } = useWeb3();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  
  const switchToBaseSepolia = async () => {
    if (window.ethereum) {
      try {
        const baseSepoliaChainId = "84532"; 
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        
        if (currentChainId !== baseSepoliaChainId) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: baseSepoliaChainId }],
          });
          console.log("Switched to Base Sepolia Network!");
        } else {
          console.log("Already on Base Sepolia Network.");
        }
      } catch (error) {
        console.error("Error switching network:", error);
      }
    } else {
      alert("Please install MetaMask or another Web3 provider.");
    }
  };

  useEffect(() => {
    switchToBaseSepolia();
  }, [account]); 

  const sendMessage = async () => {

    if (!signer || !account) return alert("Connect your wallet first!");
    if (!receiver || !message) return alert("Receiver and message required!");

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.sendMessage(receiver, message);

      const receipt = await tx.wait();
      console.log(receipt);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">Send a Message</h2>
      
      <div className="space-y-5">
      <div>
      <label className="block text-gray-700 mb-2 text-sm font-medium">Recipient Address</label>
      <input
      type="text"
      placeholder="0x..."
      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      value={receiver}
      onChange={(e) => setReceiver(e.target.value)}
      />
      </div>
      
      <div>
      <label className="block text-gray-700 mb-2 text-sm font-medium">Your Message</label>
      <textarea
      placeholder="Type your message here..."
      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg h-32 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      />
      </div>
      
      <button 
      onClick={sendMessage} 
      className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium rounded-lg hover:from-purple-600 hover:to-purple-800 transform hover:-translate-y-1 transition duration-300 shadow-lg"
      >
      Send Message
      </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
