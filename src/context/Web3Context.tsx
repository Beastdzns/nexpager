import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";

interface Web3ContextType {
  account: string | null;
  signer: ethers.JsonRpcSigner | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    // Check if the wallet is already connected on page load
    if (localStorage.getItem("account")) {
      const savedAccount = localStorage.getItem("account");
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const fetchSigner = async () => {
        const signer = await provider.getSigner();
        setSigner(signer);
      };
      fetchSigner();
    }
  }, [account]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); 
        const signer = await provider.getSigner();
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        localStorage.setItem("account", userAccount); // Save the account to localStorage for persistence
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another Web3 provider.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    localStorage.removeItem("account"); 
  };

  return (
    <Web3Context.Provider value={{ account, signer, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = React.useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
