require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const ethers = require("ethers");
const bodyParser = require('body-parser')
const connectDB = require('./db/connect')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors())
const port = 5000;
const abi = JSON.parse(fs.readFileSync("abi.json"));
const contractAddress = "0xf4d03aD906dF2E228dD6E3DD3d2AeBECC4B8F344";
const provider = new ethers.providers.InfuraProvider(
  "sepolia",
  process.env.INFURA_API_KEY
);
const Admin = require('./model/admin')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);
const wcContract = new ethers.Contract(contractAddress, abi, signer);

// const apiAddress = "0x4938156553B3CC58a1885847CD252FA18d39CE48";
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

// burn amount

app.post('/burnToken',async (req,res)=>{
  const amount=req.body.burnAmount;
  await wcContract.burnToken(ethers.utils.parseEther(amount))
  res.send("okay")
})


app.post("/mint", async (req, res) => {
  
  try {
     
  const time=req.body.time;
  const apiAddress=req.body.apiAddress;
  const avgTime=8;//in hours
  const avgEnergyPerDay=13.4;//in kWh
  const amountToBeMinted=(((avgEnergyPerDay/avgTime)*time)/1000).toString();
  const mintAmount = ethers.utils.parseUnits(amountToBeMinted, 18);

  // await wcContract.mint(apiAddress, ethers.utils.parseEther(mintAmount));
  const tx=await wcContract.mint(apiAddress, mintAmount);
  await tx.wait(); // Wait for the transaction to be mined and confirmed
  console.log("Tokens minted successfully!");
  res.status(200).json({msg:"okay"})
    
  } catch (error) {
    console.log(error)
    res.status(400).json({msg:error})
  }
});

// add minter function
app.post('/addMinter', async (req, res) => {
  console.log(1)
  try {
    const minAddress = req.body.minterAddress;
    await wcContract.addMinter(minAddress);
    const existingMinter = await Admin.findOne({ contractAddress: minAddress })
    if (existingMinter) {
      res.status(200).json({msg:'Minter existing'})
    }
    const minter = await Admin.create({
      contractAddress: minAddress,
      isAdmin: false,
      isMinter: true
    })
    res.status(200).json({ msg: 'Minter Added', minter })
  } catch (error) {
    res.status(400).json({msg:'error'})
  }
})

// removeMinter
app.post('/removeMinter', async (req, res) => {
  try {
    const minAddress = req.body.minterAddress;
    if (minAddress === '0x4938156553B3CC58a1885847CD252FA18d39CE48') {
      res.status(200).json({msg:'Cant remove deployer as minter'})
    }
    await wcContract.removeMinter(minAddress);
    const existingMinter = await Admin.findOne({ contractAddress: minAddress, isMinter: true })
    if (!existingMinter) {
      res.status(200).json({msg:'No minter with this address'})
    }
    const minter = await Admin.findOneAndDelete({ contractAddress: minAddress })
    res.status(200).json({ msg: 'Minter Deleted', minter })
  } catch (error) {
    console.log(error);
  }
})

// addAdmin
app.post('/addAdmin', async (req, res) => {
  try {
    console.log(req.body.adminAddress)
    const adminAddress = req.body.adminAddress;
    await wcContract.addAdmin(adminAddress);
    const existingAdmin = await Admin.findOne({ contractAddress: adminAddress })
    if (!existingAdmin) {
      const admin = await Admin.create({
        contractAddress: adminAddress,
        isAdmin: true,
        isMinter: true
      })
      res.status(200).json({ msg: 'Admin Added', admin })
      return;
    }
    else if (existingAdmin.isAdmin === true) {
      res.status(200).json({ msg: "Admin existing" })
      return;
    }
    else if (existingAdmin.isAdmin === false) {
      const admin = await Admin.findOneAndUpdate({ contractAddress: adminAddress }, { isAdmin: true });
      res.status(200).json({ msg: 'Admin Added', admin })
      return;
    }
  } catch (error) {
    res.status(400).json({msg:'Error'})
  }
})

// removeAdmin
app.post('/removeAdmin', async (req, res) => {
  try {
    console.log(req.body.adminAddress)
    const adminAddress = req.body.adminAddress;
    if (adminAddress === '0x4938156553B3CC58a1885847CD252FA18d39CE48') {
      res.status(200).json({msg:'Cant remove deployer as admin'})
    }
    await wcContract.removeAdmin(adminAddress);
    const existingAdmin = await Admin.findOne({ contractAddress: adminAddress })
    if (!existingAdmin) {
      res.status(200).json({msg:'No admin with this address'})
    }
    const admin = await Admin.findOneAndDelete({ contractAddress: adminAddress })
    res.status(200).json({ msg: 'Admin Deleted', admin })
  } catch (error) {
    res.status(400).json({msg:"Error"})
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});