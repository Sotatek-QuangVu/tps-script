const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const BN = require('bn.js');

const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const blockTime = 6

async function main () {
  const provider = new WsProvider('ws://127.0.0.1:9955');
  const api = await ApiPromise.create({
    provider
  });

  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  let { nonce: rawNonce } = await api.query.system.account(alice.address)
  let nonce = new BN(rawNonce.toString())
  for (let i = 0; i < 15000; i++) {
    console.log(`send tx: ${i}`)
    const transfer = api.tx.balances.transfer(BOB, 1000);
    transfer.signAndSend(alice, { nonce });
    nonce = nonce.add(new BN(1));
  }

  await api.rpc.chain.subscribeNewHeads(async (header) => {
    const blockHash = header.hash.toString()
    const signedBlock = await api.rpc.chain.getBlock(blockHash)
    console.log(`number of tx in block ${header.number}: ${signedBlock.block.extrinsics.length}`)
    console.log(`TPS - block ${header.number}: ${signedBlock.block.extrinsics.length / blockTime}`)
  })
}

main().catch(console.error)