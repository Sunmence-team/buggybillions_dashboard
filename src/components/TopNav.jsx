import React from 'react'

const TopNav = () => {
  return (
    <header className="bg-white py-3 lg:px-0">
      <div className="w-full flex justify-between items-center px-8">
        <div>
          <h4 className="md:text-xl font-bold">Welcome, Favour</h4>
        </div>
        <div className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-black mx-[-20px] lg:mx-0">
          <p className="text-white text-sm lg:text-xl text-center font-medium uppercase">
            {"Ad"}
          </p>
        </div>
      </div>
    </header>
  )
}

export default TopNav