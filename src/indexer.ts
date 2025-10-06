/**
* Example indexer: fetches GitHub commit counts for a predefined list of repos and scores contributors.
* This is a minimal example — replace with your real indexing logic (The Graph, Git provider, onchain events...).
*/
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';


const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const ORG = 'your-org-or-user';
const REPOS = ['repo1','repo2'];


async function run(epochId: string){
const scores: Record<string, bigint> = {};


for(const repo of REPOS){
const url = `https://api.github.com/repos/${ORG}/${repo}/contributors`;
const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
const data = await res.json();
(data || []).forEach((c:any) => {
const addr = (c.email && emailToAddress(c.email)) || c.login; // placeholder mapping
const contribs = BigInt(c.contributions || 0);
scores[addr] = (scores[addr]||0n) + contribs;
});
}


// normalize score -> token amounts (example: 1 contribution = 1 token * 1e18)
const out: Record<string,string> = {};
for(const [who, s] of Object.entries(scores)){
const amount = (s * 1000000000000000000n).toString();
out[who] = amount;
}


const dir = path.join(process.cwd(),'..','merkle-data');
if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, `epoch-${epochId}.input.json`), JSON.stringify(out, null, 2));
console.log('Wrote input for epoch', epochId);
}


function emailToAddress(email: string){
// OPTIONAL: map contributor email to Ethereum address via onchain registry or manual mapping
return email; // placeholder
}


if(require.main === module){
const epoch = process.argv[2] || new Date().toISOString().slice(0,10);
run(epoch).catch(console.error);
}
