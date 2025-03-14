import React, { useState } from "react";
import { ethers } from "ethers";

const Hero: React.FC = () => {
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!window.ethereum) return alert("MetaMask required!");
    if (!receiver || !message || !key) return alert("All fields are required!");
    if (message.length !== key.length) return alert("Key must match message length!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = "0x857b8A32F02E19b9EaE302c1b25185C80a574448"; 
    const abi = [
      "function sendMessage(address _receiver, string _message, string _key) external"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      setLoading(true);
      const tx = await contract.sendMessage(receiver, message, key);
      await tx.wait();
      alert("Message sent successfully!");
      setReceiver("");
      setMessage("");
      setKey("");
    } catch (error) {
      console.error(error);
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 border-4 border-black shadow-brutal text-center rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Send an Encrypted Message</h2>
      
      <input 
        type="text" 
        placeholder="Receiver's Address" 
        className="block w-3/4 mx-auto p-3 border-2 border-black shadow-brutal rounded-md" 
        value={receiver} 
        onChange={(e) => setReceiver(e.target.value)} 
      />

      <input 
        type="text" 
        placeholder="Message" 
        className="block w-3/4 mx-auto p-3 border-2 border-black shadow-brutal rounded-md mt-3" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />

      <input 
        type="text" 
        placeholder="Key" 
        className="block w-3/4 mx-auto p-3 border-2 border-black shadow-brutal rounded-md mt-3" 
        value={key} 
        onChange={(e) => setKey(e.target.value)} 
      />

      <button 
        onClick={sendMessage} 
        className={`mt-4 px-6 py-2 border-2 border-black shadow-brutal rounded-md 
          ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Hero;
