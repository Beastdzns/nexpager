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

      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 border-4 border-black shadow-brutal text-center">
        <h2 className="text-xl font-bold mb-4">Send a Message</h2>
        <input
          type="text"
          placeholder="Receiver Address"
          className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <textarea
          placeholder="Message"
          className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal mt-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="mt-4 px-6 py-2 bg-white border-2 border-black shadow-brutal">
          Send
        </button>
      </div>
    </>
  );
};

export default Home;
