require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const ethers = require("ethers");
const connectDB = require('./db/connect')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
const abi = JSON.parse(fs.readFileSync("abi.json"));
const contractAddress = "0xf4d03aD906dF2E228dD6E3DD3d2AeBECC4B8F344";
const provider = new ethers.providers.InfuraProvider(
  "sepolia",
  process.env.INFURA_API_KEY
);
const Admin= require('./model/admin')

const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);
const wcContract = new ethers.Contract(contractAddress, abi, signer);

const apiAddress = "0x4938156553B3CC58a1885847CD252FA18d39CE48";
const privKey = process.env.PRIVATE_KEY;

const apiAddressPrivateKey = Buffer.from(privKey, "hex");

// connecting to database
connectDB()

app.get("/", (req, res) => {
      res.send("ok")
});

app.get("/totalSupply", (req, res) => {
  res.send("ok")
});

app.post("/mint", async (req, res) => {
  const mintAmount = req.body.energyConsumed;
  await wcContract.mint(apiAddress, mintAmount);
  res.send("ok");
});

// add minter function
app.post('/addMinter',async(req,res)=>{
  try {
    const minAddress= req.body.minterAddress;
    await wcContract.addMinter(minAddress);
    const existingMinter = await Admin.findOne({ contractAddress:minAddress })
    if (existingMinter) {
      res.send("Minter existing")
   }
   const minter = await Admin.create({
    contractAddress:minAddress,
    isAdmin:false,
    isMinter:true
 })
 res.status(200).json({msg:'Minter Added',minter})
  } catch (error) {
    console.log(error);
  }
})

// removeMinter
app.post('/removeMinter',async(req,res)=>{
  try {
    const minAddress= req.body.minterAddress;
    if(minAddress==='0x4938156553B3CC58a1885847CD252FA18d39CE48'){
      res.send('Cant remove deployer as minter')
    }
    await wcContract.removeMinter(minAddress);
    const existingMinter = await Admin.findOne({ contractAddress:minAddress,isMinter:true})
    if (!existingMinter) {
      res.send("No minter with this address")
   }
   const minter= await Admin.findOneAndDelete({contractAddress:minAddress}) 
   res.status(200).json({msg:'Minter Deleted',minter})
  } catch (error) {
    console.log(error);
  }
})

// addAdmin
app.post('/addAdmin',async(req,res)=>{
  try {
    const adminAddress= req.body.adminAddress;
    await wcContract.addAdmin(adminAddress);
    const existingAdmin = await Admin.findOne({ contractAddress:adminAddress })
    if(!existingAdmin){
    const admin = await Admin.create({
    contractAddress:adminAddress,
    isAdmin:true,
    isMinter:true
 })
      res.status(200).json({msg:'Admin Added',admin})
    }
    else if (existingAdmin.isAdmin===true) {
      res.send("Admin existing")
   }
   else if(existingAdmin.isAdmin===false){
    const admin = await Admin.findOneAndUpdate({contractAddress:adminAddress},{isAdmin:true});
    res.status(200).json({msg:'Admin Added',admin})
   }
  } catch (error) {
    console.log(error) 
  }
})

// removeAdmin
app.post('/removeAdmin',async(req,res)=>{
  try {
    const adminAddress= req.body.adminAddress;
    if(adminAddress==='0x4938156553B3CC58a1885847CD252FA18d39CE48'){
      res.send('Cant remove deployer as admin')
    }
    await wcContract.removeAdmin(adminAddress);
    const existingAdmin = await Admin.findOne({ contractAddress:adminAddress })
    if(!existingAdmin){
      res.send('No admin with this address')
    }
    const admin= await Admin.findOneAndDelete({contractAddress:adminAddress}) 
    res.status(200).json({msg:'Admin Deleted',admin})
  } catch (error) {
    console.log(error);
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});