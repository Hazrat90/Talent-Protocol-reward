/**
* Usage: npx ts-node scripts/generate-merkle.ts --epoch 2025-10-06
* Produces merkle-data/epoch-<epoch>.json with root, total and proofs.
*/
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import yargs from 'yargs';
import { MerkleTree } from 'merkletreejs';


const argv = yargs(process.argv.slice(2)).option('epoch',{type:'string', demandOption:true}).argv as any;
const epoch = argv.epoch;
const input = path.join(process.cwd(), 'merkle-data', `epoch-${epoch}.input.json`);
const output = path.join(process.cwd(), 'merkle-data', `epoch-${epoch}.json`);


if(!fs.existsSync(input)){
console.error('Input not found:', input);
process.exit(1);
}


const raw = JSON.parse(fs.readFileSync(input,'utf8')) as Record<string,string>;
// raw: {address: amountInWei}
const leaves = Object.entries(raw).map(([addr, amt]) => {
return Buffer.from(ethersKeccak256(addr, amt).slice(2),'hex');
});


const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = '0x' + tree.getRoot().toString('hex');
const total = Object.values(raw).reduce((a,b)=> (BigInt(a) + BigInt(b)).toString(), '0');


const proofs: Record<string, any> = {};
Object.entries(raw).forEach(([addr, amt])=>{
const leaf = Buffer.from(ethersKeccak256(addr, amt).slice(2),'hex');
proofs[addr.toLowerCase()] = {
amount: amt,
proof: tree.getHexProof(leaf)
};
});


fs.writeFileSync(output, JSON.stringify({ epoch, root, total, proofs }, null, 2));
console.log('Wrote', output);


// helpers
function keccak256(x: Buffer) { return require('keccak256')(x); }
function ethersKeccak256(addr: string, amt: string){
// replicate keccak256(abi.encodePacked(addr, amount))
const normalized = addr.toLowerCase();
const addrBuf = Buffer.from(normalized.replace(/^0x/,''), 'hex');
const amtBuf = Buffer.from(BigInt(amt).toString(16).padStart(64,'0'),'hex');
return '0x' + require('keccak256')(Buffer.concat([addrBuf, amtBuf])).toString('hex');
}
