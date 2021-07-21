const { ApiPromise, WsProvider } = require('@polkadot/api')

const wsProvider = new WsProvider('ws://127.0.0.1:9944')
const blockNumber = 3337

async function main() {
  const api = await ApiPromise.create({ provider: wsProvider })

  // ----------------------------------------------------------------------------
  // returns Hash
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
  console.log(`blockhash: ${blockHash.toString()}`)
  // get header of specific block
  const header = await api.derive.chain.getHeader(blockHash.toString());
  console.log(`#${header.number}: ${header.author}`);

  // returns SignedBlock
  const signedBlock = await api.rpc.chain.getBlock(blockHash);
  // the information for each of the contained extrinsics
  console.log(`tx info: `)
  signedBlock.block.extrinsics.forEach((ex, index) => {
    // the extrinsics are decoded by the API, human-like view
    console.log(index, ex.toHuman());

    const { isSigned, meta, method: { args, method, section } } = ex;

    // explicit display of name, args & documentation
    console.log(`${section}.${method}(${args.map((a) => a.toString()).join(', ')})`);
    // console.log(meta.documentation.map((d) => d.toString()).join('\n'));

    // signer/nonce info
    if (isSigned) {
      console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
    }
  });
}

main()



