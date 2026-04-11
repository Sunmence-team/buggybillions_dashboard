import React from 'react';
import { useUser } from '../../context/UserContext';

interface TopNavProps {
  heading: string;
  subText?: string;
}

const TopNav: React.FC<TopNavProps> = ({ heading, subText }) => {
  const { user, loading } = useUser();

  // Prevent crash while user is loading
  if (loading) {
    return null; // or return a loader component
  }

  // Safely generate initials
  const initials =
    user?.fullname
      ?.split(" ")
      .map(name => name.charAt(0))
      .join("") || "";

  return (
    <header className="bg-white lg:px-0 flex items-center justify-between w-full">
      <div>
        <h4 className="md:text-lg font-semibold leading-6">{heading}</h4>
        {subText && <p className="text-sm">{subText}</p>}
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
        <p className="text-white text-sm lg:text-lg text-center font-medium uppercase">
          {initials}
        </p>
      </div>
    </header>
  );
};

export default TopNav;