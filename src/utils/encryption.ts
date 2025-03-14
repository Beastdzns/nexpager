export const xorEncryptDecrypt = (message: string, key: string): string => {
    return message.split("").map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i))
    ).join("");
  };
  