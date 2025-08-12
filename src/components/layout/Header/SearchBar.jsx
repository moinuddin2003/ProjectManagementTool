import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search projects..." }) => {
  return (
    <div className="hidden lg:flex items-center space-x-2 bg-gray-100/80 rounded-xl px-4 py-2">
      <Search className="w-4 h-4 text-gray-400" />
      <input 
        type="text" 
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm w-64"
      />
    </div>
  );
};

export default SearchBar;
