// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract RewardDistributor is Ownable {
IERC20 public immutable token;


// epochId => merkle root
mapping(bytes32 => bytes32) public merkleRootOf;
// epochId => totalAllocated
mapping(bytes32 => uint256) public totalAllocated;
// epochId => claimant => claimed
mapping(bytes32 => mapping(address => bool)) public claimed;


event EpochRegistered(bytes32 indexed epochId, bytes32 merkleRoot, uint256 totalAmount);
event Claimed(bytes32 indexed epochId, address indexed claimant, uint256 amount);


constructor(IERC20 _token) {
token = _token;
}


function registerEpoch(bytes32 epochId, bytes32 merkleRoot, uint256 totalAmount) external onlyOwner {
require(merkleRootOf[epochId] == bytes32(0), "epoch exists");
merkleRootOf[epochId] = merkleRoot;
totalAllocated[epochId] = totalAmount;
emit EpochRegistered(epochId, merkleRoot, totalAmount);
}


function claim(bytes32 epochId, uint256 amount, bytes32[] calldata proof) external {
require(merkleRootOf[epochId] != bytes32(0), "epoch not registered");
require(!claimed[epochId][msg.sender], "already claimed");


// leaf is keccak256(abi.encodePacked(address, amount))
bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
bool ok = MerkleProof.verify(proof, merkleRootOf[epochId], leaf);
require(ok, "invalid proof");


claimed[epochId][msg.sender] = true;
require(token.transfer(msg.sender, amount), "transfer failed");


emit Claimed(epochId, msg.sender, amount);
}
}
