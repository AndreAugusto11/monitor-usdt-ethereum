const ethers = require('ethers');
const dotenv = require("dotenv")
const usdt_abi = require("./usdt-abi.json")

dotenv.config()

const provider = new ethers.WebSocketProvider(process.env.WSSPROVIDER);

async function listenPendingTx() {
  let i = 0;
  provider.on("pending", (txHash) => {
      if (txHash) {
          // process.stdout.write(`[${(new Date).toLocaleTimeString()}] Scanning transactions: ${txHash} \r`);
          console.log(`[${(new Date).toLocaleTimeString()}] Scanning transactions: ${txHash}`);
      }
  });
};

async function getUSDTTransfers(){
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const contract = new ethers.Contract(usdtAddress, usdt_abi, provider);

  contract.on("Transfer", (from, to, value, event)=>{
      let transferEvent ={
          from: from,
          to: to,
          value: value.toString(),
          txHash: event.log.transactionHash,
          blockHash: event.log.blockHash,
          blockNumber: event.log.blockNumber,
          txIndex: event.log.transactionIndex,
      }
      console.log(transferEvent);
  });
}

listenPendingTx();
getUSDTTransfers();