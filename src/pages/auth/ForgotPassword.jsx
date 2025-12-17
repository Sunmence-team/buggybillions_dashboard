import React from "react";
import { assests } from "../../assets/assest";
import { MdEmail } from "react-icons/md";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex">
      <div
        className="p-5 w-1/1  text-white flex text-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(121, 111, 171, 0.97), rgba(121, 111, 171, 0.96)), url('./lap.jpg')",
        }}
      >
        <div>
          <img src={assests.logo} className="w-55" />
        </div>
        <div className="text-center flex flex-col justify-center items-start mr-[10rem]">
          <h1 className="text-[48px]  text-justify">
            Recover account a<span className="text-yellow-400">ccess</span>
          </h1>
        </div>
      </div>

      <div className="w-1/1 flex flex-col justify-center items-center p-5 bg-white">
        <div className="w-full max-w-md">
          <div>
            <h2 className="text-2xl font-semibold text-black text-center">
              Forgot Password
            </h2>
            <p className="text-black mb-10 text-center">
              Enter your registered email adress to <br /> reset your password
            </p>
          </div>
          <form className="space-y-5">
            <div className="relative">
              <span className="absolute left-4 top-4">
                <MdEmail />
              </span>
              <input
                type="email"
                className="w-full px-9 py-3 rounded-lg bg-gray-200"
                placeholder="Email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#796FAB] text-white py-2 rounded-lg"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
