import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2  transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1 whitespace-no-wrap w-max">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
