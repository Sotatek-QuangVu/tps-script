const { ApiPromise, WsProvider } = require('@polkadot/api');
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const blockTime = 6

async function main () {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create(provider);
  await api.rpc.chain.subscribeAllHeads(async (header) => {
    const blockHash = header.hash.toString()
    const signedBlock = await api.rpc.chain.getBlock(blockHash)
    console.log(`number of tx in block ${header.number}: ${signedBlock.block.extrinsics.length}`)
    console.log(`TPS - block ${header.number}: ${signedBlock.block.extrinsics.length / blockTime}`)
  })
}

main().catch(console.error)
