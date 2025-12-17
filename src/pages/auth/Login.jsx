import React from 'react';
import { assests } from '../../assets/images/assest'
import { FaUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      <div className="p-5 w-1/1  text-white flex text-center"
      style={{
        backgroundImage:
        "linear-gradient(to bottom, rgba(121, 111, 171, 0.97), rgba(121, 111, 171, 0.96)), url('./lap.jpg')"
      }}>
        <div>
          <img 
            src={assests.logo}
            className='w-55'
          />
        </div>
        <div className="text-center flex flex-col justify-center items-start">
          <h1 className="text-4xl text-bold text-justify">Hello!!</h1>
          <h2 className="text-yellow-400 text-5xl text-bold">Welcome</h2>
        </div>
      
      </div>

        <div className="w-1/1 flex flex-col justify-center items-center p-5 bg-white">
          <div className="w-full max-w-md">
            <div>
              <h2 className="text-2xl font-semibold text-black text-center">Login</h2>
              <p className="text-black mb-10 text-center">Sign in to your account</p>
            </div>
            <form className="space-y-5">
              <div className='relative'>
                <span className='absolute left-4 top-4'><FaUser /></span>
                <input
                  type="text"
                  className="w-full px-9 py-3 rounded-lg bg-gray-200"
                  placeholder=" Tutor/Student ID"
                  
                />
              </div>
              <div className='relative'>
                <span className='absolute left-4 top-4'><MdLock /></span>
                <input
                  type="password"
                  className="w-full px-9 py-3 rounded-lg bg-gray-200"
                  placeholder="Password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-black">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
               
              </div>

              <button
                type="submit"
                className="w-full bg-[#796FAB] text-white py-2 rounded-lg"
              >
                Login
              </button>

              <p className="text-sm text-center mt-4 text-gray-600 flex flex-col">
                <a href="#" className="text-sm text-black">
                  Forgot Password?
                </a>
                <div className='flex justify-center gap-1'>
                 <p className='text-black'> Don’t have an account?{" "}</p>
                  <a href="#" className="text-red-500 font-semibold">
                    Sign up
                  </a>
                </div>
                
              </p>
            </form>
          </div>
        </div>
    </div>
  );
};

export default Login;