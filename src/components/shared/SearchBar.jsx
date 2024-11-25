import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ placeholder, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
        <FaSearch className="w-5 h-5" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-300 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className={`absolute inset-0 -z-10 rounded-xl transition-all duration-300 ${isFocused ? 'bg-blue-100/50 scale-105' : 'bg-transparent'}`}></div>
    </div>
  );
}

export default SearchBar;