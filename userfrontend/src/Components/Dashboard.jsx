import React from "react";

const Dashboard = ({
  currentAccount,
  chainErr,
  balance,
  burntAmount,
  setAmtToBurn,
  burnTokenButton,
  connectWalletButton,
}) => {
  return (
    <div className="w-2/5 pt-2 pb-5 min-h-full bg-white rounded-lg overflow-hidden shadow-[2px_2px_9px_0px_#FDF2F8]">
      {currentAccount && !chainErr ? (
        <>

           {/* carbon holding */}
          <div className="flex flex-col items-center mt-5 gap-y-1">
            <span className=" font-bold font-sans text-2xl">
              Your Carbon Credit holdings 💼
            </span>
            <span
              data-tip={balance + " CC"}
              className=" font-medium text-2xl w-fit"
            >
              {balance ? parseFloat(balance).toFixed(2) : 0} CC
            </span>
          </div>
    
           {/* Carbon Credit burnt */}
          <div className="flex flex-col items-center mt-5 gap-y-1">
            <span className="font-bold font-sans text-2xl">CarbonCredit burnt &#128293;</span>
            <span
              data-tip={burntAmount + " CC"}
              className="font-semibold text-2xl w-fit"
            >
              {balance ? parseFloat(burntAmount).toFixed(2) : 0} CC
            </span>
          </div>

          {/* burn Carbon Credit  */}
          <div
            className="flex flex-col items-center mt-5 gap-y-1"
          >
            <span className="font-bold font-sans text-xl">Burn Tokens</span>
            <div className="w-full h-auto flex justify-center items-end gap-2 px-10 pt-3">
              <input
                className=" w-72 h-12 text-xs  text-gray-900 placeholder-gray-700 bg-pink-100 bg-opacity-20 border border-transparent rounded-lg shadow-sm appearance-none lg:px-4 lg:py-2 md:px-2 md:py-1 lg:text-base md:text-sm border-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent"
                onChange={(e) => setAmtToBurn(e.target.value)}
              />
              <span className=" w-14 text-white pt-2 text-center font-bold h-11 shadow-sm bg-gradient-to-r from-violet-200 to-pink-200 p-1 rounded-lg">CC</span>
            </div>
            {burnTokenButton()}
          </div>
        </>
      ) : (
        <div class="flex flex-col items-center justify-center space-y-2">
          <span class="font-semibold text-xl">Connect</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
