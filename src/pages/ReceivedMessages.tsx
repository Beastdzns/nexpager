import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { xorEncryptDecrypt } from "../utils/encryption";
import Navbar from "../components/Navbar";
import useWeb3 from "../hooks/useWeb3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ReceivedMessages: React.FC = () => {
  const { account } = useWeb3();
  const [messages, setMessages] = useState<{ sender: string; encryptedMessage: string }[]>([]);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState<string[]>([]);

  const fetchMessages = async () => {
    if (!window.ethereum || !account) return;
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractAddress = "0x0e68473512a23C58CaB3afB3e2815BC538c39b8b"; 
    const abi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bytes",
                    "name": "encryptedMessage",
                    "type": "bytes"
                }
            ],
            "name": "MessageSent",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "getMessages",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes",
                            "name": "encryptedMessage",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "xorKey",
                            "type": "bytes"
                        }
                    ],
                    "internalType": "struct NexPager.Message[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_receiver",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_message",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                }
            ],
            "name": "sendMessage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
      const messagesData = await contract.getMessages(account);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const decryptMessages = () => {
    if (!decryptionKey) return alert("Please enter a key!");

    const decrypted = messages.map(msg => xorEncryptDecrypt(msg.encryptedMessage, decryptionKey));
    setDecryptedMessages(decrypted);
  };

  useEffect(() => {
    if (account) {
      fetchMessages();
    }
  }, [account]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-blue-500 border-4 border-black shadow-brutal text-center">
        <h2 className="text-xl font-bold mb-4">Received Messages</h2>
        <input
          type="text"
          placeholder="Enter Decryption Key"
          className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal"
          value={decryptionKey}
          onChange={(e) => setDecryptionKey(e.target.value)}
        />
        <button onClick={decryptMessages} className="mt-4 px-6 py-2 bg-white border-2 border-black shadow-brutal">
          Decrypt Messages
        </button>
        <div className="mt-6">
          {decryptedMessages.length > 0 ? (
            decryptedMessages.map((msg, index) => (
              <p key={index} className="bg-white p-2 border-2 border-black shadow-brutal my-2">
                {msg}
              </p>
            ))
          ) : (
            <p className="text-white">No messages or incorrect key.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceivedMessages;
