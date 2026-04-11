import React from "react";

interface OverviewCardsProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="flex items-center min-h-28 max-h-38 gap-4 rounded-xl bg-white p-4 shadow-md border border-gray-200">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} ${iconColor} text-xl`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <h4 className="text-lg font-semibold text-gray-800">{value}</h4>
      </div>
    </div>
  );
};

export default OverviewCards;
