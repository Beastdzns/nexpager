// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NexPager {
    struct Message {
        address sender;
        address receiver;
        bytes encryptedMessage;
        bytes xorKey;
    }

    mapping(address => Message[]) private messages;

    event MessageSent(address indexed sender, address indexed receiver, bytes encryptedMessage);

    function sendMessage(address _receiver, string memory _message, string memory _key) external {
        require(bytes(_message).length == bytes(_key).length, "Key must be same length as message");

        bytes memory encryptedMessage = xorEncryptDecrypt(bytes(_message), bytes(_key));

        messages[_receiver].push(Message({
            sender: msg.sender,
            receiver: _receiver,
            encryptedMessage: encryptedMessage,
            xorKey: bytes(_key)
        }));

        emit MessageSent(msg.sender, _receiver, encryptedMessage);
    }

    function getMessages() external view returns (Message[] memory) {
        return messages[msg.sender];
    }

    function xorEncryptDecrypt(bytes memory _data, bytes memory _key) internal pure returns (bytes memory) {
        bytes memory result = new bytes(_data.length);
        for (uint256 i = 0; i < _data.length; i++) {
            result[i] = _data[i] ^ _key[i];
        }
        return result;
    }
}
