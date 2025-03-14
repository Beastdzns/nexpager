import React, { useState } from "react";
import { ethers } from "ethers";
import { xorEncryptDecrypt } from "../utils/encryption";

const Hero: React.FC = () => {
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");

  const sendMessage = async () => {
    if (!window.ethereum) return alert("MetaMask required!");
    if (message.length !== key.length) return alert("Key must match message length!");

    const encryptedMessage = xorEncryptDecrypt(message, key);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
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
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const tx = await contract.sendMessage(receiver, encryptedMessage, key);
      await tx.wait();
      alert("Message sent successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-red-500 border-4 border-black shadow-brutal text-center">
      <h2 className="text-xl font-bold mb-4">Send an Encrypted Message</h2>
      <input type="text" placeholder="Receiver's Address" className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
      <input type="text" placeholder="Message" className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal mt-2" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input type="text" placeholder="Key" className="block w-3/4 mx-auto p-2 border-2 border-black shadow-brutal mt-2" value={key} onChange={(e) => setKey(e.target.value)} />
      <button onClick={sendMessage} className="mt-4 px-6 py-2 bg-white border-2 border-black shadow-brutal">
        Send
      </button>
    </div>
  );
};

export default Hero;
