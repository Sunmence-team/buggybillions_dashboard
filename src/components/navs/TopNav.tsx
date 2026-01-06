import React from 'react'
import { useUser } from '../../context/UserContext';

interface TopNavProps {
  heading: string;
  subText?: string | undefined;
}

const TopNav: React.FC<TopNavProps> = ({ heading, subText }) => {
  const { user } = useUser();

  const splitedFirstName = user?.fullname.split(" ")?.[0]
  const splitedLastName = user?.fullname.split(" ")?.[1]

  const splitedFirstLetterOfFirstName = splitedFirstName?.trim()[0]
  const splitedFirstLetterOfLastName = splitedLastName?.trim()[0]

  return (
    <header className="bg-white lg:px-0 flex items-center justify-between w-full">
      <div>
        <h4 className="md:text-lg font-semibold leading-6">{heading}</h4>
        {subText && <p className='text-sm'>{subText}</p>}
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
        <p className="text-white text-sm lg:text-lg text-center font-medium uppercase">
          {`${splitedFirstLetterOfFirstName}${splitedFirstLetterOfLastName ? splitedFirstLetterOfLastName : ""}`}
        </p>
      </div>
    </header>
  )
}

export default TopNav