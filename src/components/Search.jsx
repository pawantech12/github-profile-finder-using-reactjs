import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [username, setUsername] = useState("");

  const handleSearch = () => {
    if (username) {
      onSearch(username);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center items-center my-8 rounded-lg bg-white w-[60%] max-[798px]:w-full border border-gray-200 mx-auto p-2 shadow-custom-blue">
      <input
        type="text"
        placeholder="Enter GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-none rounded-lg p-2 text-base w-full outline-none font-medium"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 px-3 font-medium rounded-lg ml-2"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
