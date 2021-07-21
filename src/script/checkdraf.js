const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');





async function main() {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create(provider);
  const unsub = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log("Block " + header.number + " Mined.");
  });

}


main().catch(console.error)





