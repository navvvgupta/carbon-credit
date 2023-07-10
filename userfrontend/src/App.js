import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Logo from "./assests/logo.png";
import Footprint from './assests/footericon.png'
import ReactTooltip from "react-tooltip";

import abi from "./contracts/abi.json";
import Dashboard from "./Components/Dashboard";
import ElectricCharge from "./Components/ElectricCharge";
const contractAddress = "0xf4d03aD906dF2E228dD6E3DD3d2AeBECC4B8F344";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currPendingTxNum, setCurrPendingTxNum] = useState(0);
  const [balance, setBalance] = useState(null);
  const [amtToBurn, setAmtToBurn] = useState(0);
  const [burntAmount, setBurntAmount] = useState(0);
  const [chainErr, setChainErr] = useState(false);
  const [showcharger,setShowcharger]= useState(false);
  const [showdashboard,setShowdashboard]= useState(false)

  async function updateBalanceAndBurnedAmount(accounts, signer) {
    // Pick first account and set as current account
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);

      // Initiate an ethers Contract instance using the deployed contract's address, contract ABI and the signer
      const wcContract = new ethers.Contract(contractAddress, abi, signer);
      let balance = await wcContract.balanceOf(account);

      let burnedToken = await wcContract.getBurnAmount(account);
      setBurntAmount(ethers.utils.formatEther(burnedToken));

      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
    } else {
      console.log("No authorized account found.");
    }
  }

  async function monitorTx(txHash) {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);

    while (true) {
      let tx = await provider.getTransaction(txHash);
      if (tx["confirmations"] !== 0) {
        break;
      }
    }

    console.log("finished transaction: ", txHash);
    setCurrPendingTxNum((currPendingTxNum) => currPendingTxNum - 1);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const signer = provider.getSigner();
    await updateBalanceAndBurnedAmount(accounts, signer);
  }

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    // Check if Metamask is installed
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const { chainId } = await provider.getNetwork();
    const accounts = await ethereum.request({ method: "eth_accounts" });

    console.log(chainId);

    if (chainId === 11155111) {
      // Request Metamask for accounts that are connected
      const accounts = await ethereum.request({ method: "eth_accounts" });

      await updateBalanceAndBurnedAmount(accounts, signer);
    } else if (accounts === null || accounts.length === 0) {
      console.log("check length: ", accounts.length);
      setCurrentAccount(null);
    } else {
      alert("Please use Sepolia Network.");
      setChainErr(true);
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    // Check if Metamask is installed
    if (!ethereum) {
      alert("Please install Metamask!");
    }

    // Requests Metamask for the user's wallet addresses
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      // Take the first wallet address available
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const burnTokenHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Set Metamask as the RPC provider - requests issued to the miners using Metamask wallet
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Access signer to issue requests - user needs to sign transactions using their private key
        const signer = provider.getSigner();
        // Initiate an ethers Contract instance using the deployed contract's address, contract ABI and the signer
        const wcContract = new ethers.Contract(contractAddress, abi, signer);

        const amt = ethers.utils.parseEther(amtToBurn, 18);
        console.log("Burning...", amt.toString(10));
        let burnedToken = await wcContract.burnToken(amt);
        console.log(burnedToken);

        setCurrPendingTxNum((currPendingTxNum) => currPendingTxNum + 1);
        await monitorTx(burnedToken["hash"]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <div
        onClick={connectWalletHandler}
        className="cursor-pointer p-2 rounded-xl bg-white hover:bg-gray-100  "
      >
        Connect Wallet
      </div>
    );
  };

  const burnTokenButton = () => {
    return (
      <div
      onClick={burnTokenHandler}
      className=" mt-3 w-60 text-center py-2 text-lg font-bold text-white font-head  h-11 shadow-sm rounded-lg bg-gradient-to-r from-violet-200 to-pink-200"
    >
      Burn {amtToBurn} CarbonCredits
    </div>
    );
  };

  const chargeElectric=()=>{
    setShowcharger(true);
    setShowdashboard(false);
  }

  const showDashboard=()=>{
    setShowdashboard(true);
    setShowcharger(false);
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [currentAccount]);

  useEffect(() => {
    console.log("current pending tx num: ", currPendingTxNum);
  }, [currPendingTxNum]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [balance]);

  return (
    <div className=" w-full flex flex-col gap-y-4 px-12 py-5 items-center justify-start h-screen border border-white overflow-x-hidden bg-gradient-to-r from-violet-200 to-pink-200">
      {/* header       */}
      <div className="w-full px-3 h-1/5 flex items-center justify-between ">
        {/* logo */}
        <img className=" w-64 h-16" src={Logo} alt="logo" />
        {/* connected info */}
        <div>
          {currentAccount && !chainErr ? (
            <div className="cursor-pointer bg-white px-4 py-4 rounded-lg flex flex-row space-x-2 drop-shadow shadow-[2px_2px_9px_0px_#FDF2F8]">
              <span className="bg-green-600 rounded-full w-3 h-3 self-center" />
              <span className="text-lg font-semibold">
                {currentAccount.substring(0, 7) +
                  "..." +
                  currentAccount.substring(
                    currentAccount.length - 5,
                    currentAccount.length
                  )}
              </span>
            </div>
          ) : (
            <div className="cursor-pointer bg-white px-4 py-4 mr-4 rounded-lg  flex flex-row space-x-2 drop-shadow shadow-[2px_2px_9px_0px_#FDF2F8]">
              <div className="bg-red-400 rounded-full w-3 h-3 self-center" />
              <h1 className=" text-lg font-semibold">Not Connected</h1>
            </div>
          )}
        </div>
      </div>

      {/* connected to meat mask info */}
      <div className=" w-1/5 h-auto py-5 mt-5 flex bg-opacity-30 justify-center items-center rounded-lg bg-white shadow-[2px_2px_9px_0px_#FDF2F8]">
        {currentAccount && !chainErr ? (
          <h1 className="cursor-pointer font-semibold scale-110 text-xl">
            Connected to MetaMask
          </h1>
        ) : (
          <button onClick={connectWalletHandler} className="cursor-pointer active:scale-105  bg-white bg-opacity-20 p-4 rounded-lg  font-semibold scale-110 text-xl">
            Connect to MetaMask
          </button>
        )}
      </div>

      {/* user feature  */}
      <div className=" flex justify-around items-center mt-8 w-3/4 h-2/6 ">
        
        <button onClick={()=>chargeElectric()} className="active:scale-105 active:shadow-transparent  rounded-lg text-center flex justify-center items-center w-80 h-32 border bg-opacity-60 bg-white shadow-[2px_2px_9px_0px_#FDF2F8] cursor-pointer font-semibold text-2xl  ">
          {" "}
          Charge a Electric Vehicle
        </button>

        <button onClick={()=>showDashboard()} className="active:scale-105 active:shadow-transparent rounded-lg text-center flex justify-center items-center w-80 h-32 border bg-opacity-60 bg-white shadow-[2px_2px_9px_0px_#FDF2F8] cursor-pointer font-semibold text-2xl  ">
          {" "}
          Dashboard
        </button>
      </div>

      {/* main */}
      <div className="flex justify-center pt-5 mt-5  w-full h-3/4" >

        {/* default png */}
        {
          !showcharger&&!showdashboard&&(<img className=" relative top-5 w-96 h-64 scale-150" src={Footprint} alt="pic" />)
        }
        
        {/* show charging function */}
        {
          showcharger&&!showdashboard&&(<ElectricCharge currentAccount={currentAccount}/>
            )
        }

        {/* show dashboard */}

        {
          !showcharger&&showdashboard&&(
            <Dashboard amtToBurn={amtToBurn} burnTokenHandler={burnTokenHandler} connectWalletHandler={connectWalletHandler} currentAccount={currentAccount} chainErr={chainErr} balance={balance} burntAmount={burntAmount} setAmtToBurn={setAmtToBurn} burnTokenButton={burnTokenButton} connectWalletButton={connectWalletButton} />
          )
        }
        
      </div>  
    </div>
  );

  // <div className="flex flex-wrap content-center justify-center min-h-screen bg-gradient-to-tr from-green-200 bg-green-100 font-major ">
  //   <nav class="fixed top-0 w-screen flex flex-row p-1">
  //     <span class="font-semibold text-lg self-center drop-shadow">
  //       WattCarbon
  //     </span>
  //     <div class="ml-auto items-center mr-2">
  //       {currentAccount && !chainErr ? (
  //         <div class="bg-white p-2 rounded-full flex flex-row space-x-2 drop-shadow">
  //           <span class="bg-green-400 rounded-full w-2 h-2 self-center" />
  //           <span class="font-thin">
  //             {currentAccount.substring(0, 7) +
  //               "..." +
  //               currentAccount.substring(
  //                 currentAccount.length - 5,
  //                 currentAccount.length
  //               )}
  //           </span>
  //         </div>
  //       ) : (
  //         <div class="bg-white p-2 rounded-full flex flex-row space-x-2 drop-shadow">
  //           <div class="bg-red-400 rounded-full w-2 h-2 self-center" />
  //           <span class="font-thin">Not Connected</span>
  //         </div>
  //       )}
  //     </div>
  //     <div>
  //       {currPendingTxNum > 0 && !chainErr ? (
  //         <div class="bg-white p-2 rounded-full flex flex-row space-x-2 drop-shadow">
  //           <svg
  //             role="status"
  //             class="mx-1 w-4 h-4 text-white animate-spin fill-blue-600 self-center"
  //             viewBox="0 0 100 101"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  //               fill="currentColor"
  //             />
  //             <path
  //               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  //               fill="currentFill"
  //             />
  //           </svg>
  //           <span class="font-thin">
  //             {currPendingTxNum} pending transactions
  //           </span>
  //         </div>
  //       ) : (
  //         <></>
  //       )}
  //     </div>
  //   </nav>
  //   <ReactTooltip />
  //   <div class="rounded-2xl p-4 bg-white drop-shadow-2xl min-w-[25%]">
  //     <div className="flex flex-col space-y-4">
  //       {currentAccount && !chainErr ? (
  //         <>
  //           <div class="flex flex-col">
  //             <span class="font-thin text-lg">Your WattCarbon holdings</span>
  //             <span
  //               data-tip={balance + " WC"}
  //               class="font-semibold text-2xl w-fit"
  //             >
  //               {balance ? parseFloat(balance).toFixed(2) : 0} WC
  //             </span>
  //           </div>
  //           <div class="flex flex-col">
  //             <span class="font-thin text-lg">
  //               WattCarbons burnt &#128293;
  //             </span>
  //             <span
  //               data-tip={burntAmount + " WC"}
  //               class="font-semibold text-2xl w-fit"
  //             >
  //               {balance ? parseFloat(burntAmount).toFixed(2) : 0} WC
  //             </span>
  //           </div>
  //           <div class="flex flex-col border-dotted border-t-2 pt-2">
  //             <span class="font-thin">Burn Tokens</span>
  //             <div class="flex rounded-lg border-2 focus:outline-none p-2 mb-2">
  //               <input
  //                 class="w-full outline-none text-lg font-semibold font-mono"
  //                 onChange={(e) => setAmtToBurn(e.target.value)}
  //               />
  //               <span class="bg-gray-100 p-1 rounded-lg drop-shadow">WC</span>
  //             </div>
  //             {burnTokenButton()}
  //           </div>
  //         </>
  //       ) : (
  //         <div class="flex flex-col items-center justify-center space-y-2">
  //           <span class="font-semibold text-xl">
  //             Please connect your wallet or change to the correct network.
  //           </span>
  //           {connectWalletButton()}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // </div>
}

export default App;
