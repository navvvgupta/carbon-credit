import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './assest/carboncredit_logo.png'
import { useState } from 'react';

function App() {
    
   // set of state
   const [addminter,setAddminter]=useState();
   const [rmminter,setRmminter]=useState();
   const [adminAddress,setAdminAddress]=useState();
   const [rmadmin,setRmadmin]=useState();
 
  // toast option
  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // add admin
  const addAdmin=async()=>{
    console.log(1)
    if(!adminAddress) 
    {
      toast.error("Please enter admin address",toastOptions);
      return;
    }

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data=await axios.post('http://localhost:5000/addAdmin',
        {
          adminAddress
        },config)
        console.log(data)
        if(data.data.msg==='Admin Added')
        {
          toast.success("Admin Added",toastOptions);
          return;
        } 
        
      if(data.data.msg==='Admin existing')
      {
        toast.warn("Admin existing",toastOptions);
        return;
      } 
      
    } catch (error) {
      console.log(error)
      toast.error("Error",toastOptions);
    }
  }

  // remove admin 
  const removeAdmin=async()=>{
    if(!rmadmin) 
    {
      toast.error("Please enter admin address",toastOptions);
      return;
    }
    
    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data=await axios.post('http://localhost:5000/removeAdmin',
        {
          adminAddress:rmadmin
        },config)
        console.log(data)
        if(data.data.msg==='Admin Deleted')
        {
          toast.success("Admin Deleted",toastOptions);
          return;
        } 
        
      if(data.data.msg==='No admin with this address')
      {
        toast.warn("No admin with this address",toastOptions);
        return;
      } 

      if(data.data.msg==='Cant remove deployer as admin')
      {
        toast.warn("Can't remove deployer as admin",toastOptions);
        return;
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Error",toastOptions);
    }
  }

  // add minter
  const addMinter=async()=>{
    if(!addminter) 
    {
      toast.error("Please enter minter address",toastOptions);
      return;
    }
   
    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data=await axios.post('http://localhost:5000/addMinter',
        {
          minterAddress:addminter
        },config)
        console.log(data)
        if(data.data.msg==='Minter Added')
        {
          toast.success("Minter added",toastOptions);
          return;
        }
        if(data.data.msg==='Minter existing')
        {
          toast.warn("Minter existing",toastOptions);
          return;
        } 
        
      if(data.data.msg==='No admin with this address')
      {
        toast.warn("No admin with this address",toastOptions);
        return;
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Error",toastOptions);
    }

  }

  // remove minter
  const removeMinter=async()=>{
    if(!rmminter) 
    {
      toast.error("Please enter minter address",toastOptions);
      return;
    }

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data=await axios.post('http://localhost:5000/removeMinter',
        {
          minterAddress:rmminter
        },config)
        console.log(data)
        if(data.data.msg==='Minter Deleted')
        {
          toast.success("Minter Deleted",toastOptions);
          return;
        }
        if(data.data.msg==='No minter with this address')
        {
          toast.warn("No minter with this address",toastOptions);
          return;
        } 
        
      if(data.data.msg==='Cant remove deployer as minter')
      {
        toast.warn("Cant remove deployer as minter",toastOptions);
        return;
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Error",toastOptions);
    }
  }

  return (
    <div className=' relative w-full overflow-x-hidden h-screen bg-gradient-to-r from-violet-200 to-pink-200 flex flex-col items-center justify-start pt-4 gap-y-2'>
       {/* header */}
       <div className='w-full h-auto flex justify-start items-center' >
      <img src={logo} className=' w-80 h-20 scale-x-110 relative left-16'  alt="logo" />
       <h1 className=' ml-72 relative left-5 mt-5 scale-125 text-6xl font-bold tracking-wide text-white lg:text-5xl font-Acme ' >Admin Panel</h1>
       </div>

       {/* main */}
       <div className=' w-full h-4/5 flex flex-col gap-y-4 items-center pt-5' >
         
          {/* add admin */}
         <div className=' flex flex-col gap-y-2 items-center justify-start pt-4 w-96 scale-x-125 h-52 bg-white rounded-md shadow-[2px_2px_9px_0px_#FDF2F8]' >
          <h1 className=' font-head text-xl font-semibold' >Add Admin</h1>
          <div className=' w-full h-auto flex justify-center items-end gap-2 px-10 pt-3'  >
            <input onChange={(e)=>setAdminAddress(e.target.value)} type="text" placeholder='Write Contract Address' className=" font-Coming flex-1 w-2/3 h-12 text-xs  text-gray-900 placeholder-gray-700 bg-pink-100 bg-opacity-60 border border-transparent rounded-lg shadow-sm appearance-none lg:px-4 lg:py-2 md:px-2 md:py-1 lg:text-base md:text-sm border-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent" />
            <button onClick={()=>addAdmin()} className=' w-14 text-white font-head font-semibold h-11 shadow-sm rounded-lg bg-gradient-to-r from-violet-200 to-pink-200' >Add</button>
          </div>
         </div>

         {/* remove admin */}
         <div className=' flex flex-col gap-y-2 items-center justify-start pt-4 w-96 scale-x-125 h-52 bg-white rounded-md shadow-[2px_2px_9px_0px_#FDF2F8]' >
          <h1 className=' font-head text-xl font-semibold' >Remove Admin</h1>
          <div className=' w-full h-auto flex justify-center items-end gap-2 px-10 pt-3'  >
            <input onChange={(e)=>setRmadmin(e.target.value)} type="text" placeholder='Write Contract Address' className=" font-Coming flex-1 w-2/3 h-12 text-xs  text-gray-900 placeholder-gray-700 bg-pink-100 bg-opacity-60 border border-transparent rounded-lg shadow-sm appearance-none lg:px-4 lg:py-2 md:px-2 md:py-1 lg:text-base md:text-sm border-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent" />
            <button onClick={()=>removeAdmin()} className='text-sm  w-16 text-white  font-head font-semibold h-11 shadow-sm rounded-lg bg-gradient-to-r from-violet-200 to-pink-200' >Remove</button>
          </div>
         </div>
          
          {/* add minter */}
         <div className=' flex flex-col gap-y-2 items-center justify-start pt-4 w-96 scale-x-125 h-52 bg-white rounded-md shadow-[2px_2px_9px_0px_#FDF2F8]' >
          <h1 className=' font-head text-xl font-semibold' >Add Minter</h1>
          <div className=' w-full h-auto flex justify-center items-end gap-2 px-10 pt-3'  >
            <input onChange={(e)=>setAddminter(e.target.value)} type="text" placeholder='Write Contract Address' className=" font-Coming flex-1 w-2/3 h-12 text-xs  text-gray-900 placeholder-gray-700 bg-pink-100 bg-opacity-60 border border-transparent rounded-lg shadow-sm appearance-none lg:px-4 lg:py-2 md:px-2 md:py-1 lg:text-base md:text-sm border-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent" />
            <button onClick={()=>addMinter()} className=' w-14 text-white font-head font-semibold h-11 shadow-sm rounded-lg bg-gradient-to-r from-violet-200 to-pink-200' >Add</button>
          </div>
         </div>
        
        {/* remove minter */}
         <div className=' flex flex-col gap-y-2 items-center justify-start pt-4 w-96 scale-x-125 h-52 bg-white rounded-md shadow-[2px_2px_9px_0px_#FDF2F8]' >
          <h1 className=' font-head text-xl font-semibold' >Remove Minter</h1>
          <div className=' w-full h-auto flex justify-center items-end gap-2 px-10 pt-3'  >
            <input  onChange={(e)=>setRmminter(e.target.value)} type="text" placeholder='Write Contract Address' className=" font-Coming flex-1 w-2/3 h-12 text-xs  text-gray-900 placeholder-gray-700 bg-pink-100 bg-opacity-60 border border-transparent rounded-lg shadow-sm appearance-none lg:px-4 lg:py-2 md:px-2 md:py-1 lg:text-base md:text-sm border-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent" />
            <button onClick={()=>removeMinter()} className='text-sm  w-16 text-white font-head font-semibold h-11 shadow-sm rounded-lg bg-gradient-to-r from-violet-200 to-pink-200' >Remove</button>
          </div>
         </div>
       </div>
       <ToastContainer />
    </div>
  );
}

export default App;
