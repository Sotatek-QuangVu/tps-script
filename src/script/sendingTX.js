const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const BN = require('bn.js');

const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const blockTime = 6

async function main () {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create(provider);

  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  let { nonce: rawNonce } = await api.query.system.account(alice.address)
  let nonce = new BN(rawNonce.toString())

  let i = 0
  while(1) {
    console.log(`send tx: ${i}`)
    i++
    const transfer = api.tx.balances.transfer(BOB, 10);
    transfer.signAndSend(alice, { nonce });
    nonce = nonce.add(new BN(1));
  }
}
main().catch(console.error)
