import { ethers } from "hardhat";


async function main() {
const [deployer] = await ethers.getSigners();
console.log("Deploying with", deployer.address);


const Token = await ethers.getContractFactory("RewardToken");
const token = await Token.deploy();
await token.deployed();
console.log("Token deployed", token.address);


const Dist = await ethers.getContractFactory("RewardDistributor");
const dist = await Dist.deploy(token.address);
await dist.deployed();
console.log("Distributor deployed", dist.address);


// optionally mint tokens to owner for funding later
await token.mint(deployer.address, ethers.parseUnits("1000000", 18));
console.log("Minted initial supply to deployer");
}


main().catch((e)=>{console.error(e); process.exit(1);});
