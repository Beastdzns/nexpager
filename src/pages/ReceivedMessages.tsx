import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import { useWeb3 } from "../context/Web3Context";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

const ReceivedMessages: React.FC = () => {
  const { account } = useWeb3();
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!window.ethereum || !account) {
      setError("Connect your wallet to fetch messages.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Fetch messages for the connected wallet
      const fetchedMessages = await contract.getMessages();
      
      if (!fetchedMessages || fetchedMessages.length === 0) {
        setError("No messages found.");
      } else {
        setMessages(fetchedMessages.map((msg: any) => ({
          sender: msg.sender,
          message: msg.message
        })));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (account) {
      fetchMessages();
    }
  }, [account]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 border-4 border-black shadow-brutal text-center">
        <h2 className="text-xl font-bold mb-4">Received Messages</h2>

        {/* Fetch Button with Click Effect */}
        <button
          onClick={fetchMessages}
          className={`mt-4 px-6 py-2 bg-white border-2 border-black shadow-brutal transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Messages"}
        </button>

        {/* Error Handling */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Messages Display */}
        <div className="mt-6">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <p key={index} className="bg-white p-2 border-2 border-black shadow-brutal my-2">
                <strong>From:</strong> {msg.sender} <br />
                <strong>Message:</strong> {msg.message}
              </p>
            ))
          ) : (
            !loading && <p className="text-gray-600">No messages available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceivedMessages;
