import React, { useEffect, useState } from 'react'
import { useTimer } from 'use-timer';
import axios from 'axios';

const ElectricCharge = ({currentAccount}) => {
   
  const { time, start, pause, reset, status } = useTimer(
    {
      initialTime: 28800000
    }
  );
  const handlesubmit=async()=>{
    console.log(1)
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };

          const data=await axios.post("http://localhost:5000/mint",
          {
            time: Math.floor(time/3600),
            apiAddress:currentAccount
          },config)
          console.log(data)

        } catch (error) {
          console.log(error)
        }
  }

  return (
    <div className='flex flex-col items-center justify-start w-1/2 h-auto py-5 border border-black'  >
     
     {/* timer */}
    <button onClick={status !== 'RUNNING'?start:pause} className=' shadow-[0_8px_30px_rgb(0,0,0,0.30)] font-medium text-lg cursor-pointer text-white w-24 h-24 rounded-full bg-black bg-opacity-30 flex justify-center items-center' >
      {
        status === 'RUNNING'?(<h1>Stop</h1>):(<h1>Start</h1>)
      }
    </button>
     
     {/* show time */}
     <div className=' text-white font-bold mt-5 text-6xl' >
       {time}
     </div>
      
      {
        time>0&&(
          <button onClick={()=>handlesubmit()} className=' mt-7 w-auto h-auto text-black px-5 py-3 text-center font-bold   bg-white bg-opacity-30 shadow-[2px_2px_9px_0px_#FDF2F8]  rounded-lg' >
           Confirm
          </button>
        )
      }
    
    </div>
  )
}

export default ElectricCharge