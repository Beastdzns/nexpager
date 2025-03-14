import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import useWeb3 from "../hooks/useWeb3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ReceivedMessages: React.FC = () => {
  const { account } = useWeb3();
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    if (!account) return alert("Connect your wallet!");
    if (!decryptionKey) return alert("Enter a decryption key!");

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0x857b8A32F02E19b9EaE302c1b25185C80a574448";
      const abi = [
        "function getMessages(string _key) external view returns (tuple(address sender, string message)[])"
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Convert the key properly if needed
      const keyToSend = ethers.toUtf8Bytes(decryptionKey);

      // Fetch messages from the smart contract
      const fetchedMessages = await contract.getMessages(decryptionKey);

      if (!fetchedMessages || fetchedMessages.length === 0) {
        alert("No messages found or incorrect key.");
        setMessages([]);
        return;
      }

      const formattedMessages = fetchedMessages.map((msg: any) => ({
        sender: msg.sender,
        message: msg.message,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("Failed to fetch messages. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && decryptionKey) {
      fetchMessages();
    }
  }, [account, decryptionKey]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 border-4 border-black shadow-brutal text-center rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Received Messages</h2>
        
        {/* Decryption Key Input */}
        <input
          type="text"
          placeholder="Enter Decryption Key"
          className="block w-3/4 mx-auto p-3 border-2 border-black shadow-brutal rounded-md"
          value={decryptionKey}
          onChange={(e) => setDecryptionKey(e.target.value)}
        />
        
        <button 
          onClick={fetchMessages} 
          className={`mt-4 px-6 py-2 border-2 border-black shadow-brutal rounded-md
            ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Messages"}
        </button>

        {/* Messages Display */}
        <div className="mt-6">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <p key={index} className="bg-white p-2 border-2 border-black shadow-brutal my-2 rounded-md">
                <strong>From:</strong> {msg.sender} <br />
                <strong>Message:</strong> {msg.message}
              </p>
            ))
          ) : (
            <p className="text-gray-700">No messages found or incorrect key.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceivedMessages;
