import React from "react";

const SummaryCard = ({
  icon,
  text,
  number,
  bgColor = "bg-gray-200",
  textColor = "text-white",
}) => {
  return (
    <div
      className={`rounded-lg p-4 flex items-center space-x-4 shadow ${bgColor}`}
    >
      <div className={`text-2xl p-3 rounded-full bg-white/20 text-white`}>
        {icon}
      </div>
      <div className={`${textColor}`}>
        <p className="text-sm font-semibold">{text}</p>
        <p className="text-xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
