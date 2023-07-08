require("dotenv").config();
const fs = require("fs");
const { Web3 } = require("web3");
// const Web3 = require("web3").default; // remove .default to run code properly
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
const INFURA_URL = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`;


const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

const abi = JSON.parse(fs.readFileSync("abi.json"));
const contractAddress = "0xf4d03aD906dF2E228dD6E3DD3d2AeBECC4B8F344";
const contract = new web3.eth.Contract(abi, contractAddress);
const apiAddress = "0x80C1bA3BF05CE2a6068762fe6f237DfF7b0dc860";
const privKey = process.env.PRIVATE_KEY;

const apiAddressPrivateKey = Buffer.from(privKey, "hex");

app.get("/", (req, res) => {
  web3.eth.getBalance(
    "0x1d290b19A5a44C225ac9a6C75E6635C559f13eA3",
    (err, wei) => {
      res.send(web3.utils.fromWei(wei, "ether"));
    }
  );
});

app.get("/totalSupply", (req, res) => {
  contract.methods.totalSupply().call((err, result) => {
    res.send(result);
  });
});

app.post("/mint", async (req, res) => {
  const mintAmount = req.body.energyConsumed / 1000;

  const data = contract.methods
    .mint(apiAddress, web3.utils.toWei(mintAmount.toString(), "ether"))
    .encodeABI();
  const txCount = await web3.eth.getTransactionCount(apiAddress);

  const txObject = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(80000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("1", "gwei")),
    from: "0x4938156553B3CC58a1885847CD252FA18d39CE48",
    to: apiAddress,
    data: data,
  };
 
  const tx = await web3.eth.accounts.signTransaction(
    txObject,
    process.env.PRIVATE_KEY
  );
 
  web3.eth.sendSignedTransaction(tx.rawTransaction , (err, txHash) => {
    console.log("err:", err, "txHash:", txHash);
    res.send({ txHash: txHash });
  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});