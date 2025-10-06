# Talent Protocol — Builder Rewards


Automated system to reward builders (contributors) using a Merkle-distribution on-chain claim pattern.


## Quick start (local dev)
1. Install dependencies: `npm install`
2. Compile contracts: `npx hardhat compile`
3. Run local node: `npx hardhat node`
4. Deploy: `npx hardhat run scripts/deploy.ts --network localhost`
5. Start backend (build merkle files): `cd backend && npm install && npm run start`
6. Start frontend: `cd web && npm install && npm run dev`


## Operator flow
- Run the indexer `backend/src/indexer.ts` to compute contributions for an epoch.
- Run `scripts/generate-merkle.ts --epoch <YYYY-MM-DD>` to produce merkle-data and proofs.
- Call the deployed `RewardDistributor.registerEpoch(epochId, root, totalAmount)` and fund the contract with `RewardToken`.
- Contributors claim using the frontend or direct contract calls.
