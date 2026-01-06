import React from 'react'

const TopNav = ({ heading, subText }) => {
  return (
    <header className="bg-white lg:px-0 flex items-center justify-between w-full">
      <div>
        <h4 className="md:text-lg font-semibold leading-5">{heading}</h4>
        {subText && <p className='text-sm'>{subText}</p>}
      </div>
      <div className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-black">
        <p className="text-white text-sm lg:text-xl text-center font-medium uppercase">
          {"Ad"}
        </p>
      </div>
    </header>
  )
}

export default TopNav