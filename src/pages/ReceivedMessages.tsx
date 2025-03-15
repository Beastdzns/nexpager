import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import { useWeb3 } from "../context/Web3Context";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

const ReceivedMessages: React.FC = () => {
  const { account, signer } = useWeb3();
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!signer || !account) {
      console.log(signer);
      console.log(account);
      setError("Connect your wallet to fetch messages.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const fetchedMessages = await contract.getMessages();

      if (!fetchedMessages || fetchedMessages.length === 0) {
        setError("No messages found.");
      } else {
        const newMessages = fetchedMessages.map((msg: any) => ({
          sender: msg.sender,
          message: msg.message,
        }));

        // Update the state with the new messages
        setMessages(newMessages);

        // Send the latest message to the ESP32
        sendMessageToESP32(newMessages[0].message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages. Please try again.");
    }

    setLoading(false);
  };

  const sendMessageToESP32 = async (message: string) => {
    try {
      const response = await fetch("http://localhost:4000/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to ESP32.");
      }

      console.log("Message sent to ESP32:", message);
    } catch (error) {
      console.error("Error sending message to ESP32:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchMessages();
    }
  }, [account]);

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gradient-to-br from-purple-50 to-green-50 rounded-xl shadow-lg max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">Received Messages</h2>

        <button
          onClick={fetchMessages}
          className={`mx-auto block mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-green-500 text-white font-medium rounded-lg shadow-md transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg transform hover:-translate-y-1"
            }`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Messages"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="mt-8 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                <p className="text-sm text-purple-700 mb-1">From: <span className="font-semibold">{msg.sender}</span></p>
                <p className="text-green-800 bg-green-50 p-3 rounded-md mt-2">{msg.message}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-500 text-center italic">No messages available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceivedMessages;
