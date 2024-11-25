import { useState } from "react";
import {FaSearch } from "react-icon/fa";

function SearchBar ({ placeholder, value, onChange }) {
    const[isFocused, setIsFocused,] = useState(false);

    
    return(
        <div className ={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}> 
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
          <FaSearch className = "w-5 h-5" />
        </div>
        <input 
        type = "text"
        Placeholder = {placeholder}
        value = {value}
        onChange = {onChange}   
        onFocus = {() => setIsFocused(true)}
        onBlur = {() => setIsFocused(flase)}
        />
        
        <div className={`absolute inset-0 -z-10 rounded-xl transition-all duration-300 ${isFocused ? 'bg-blue-100/50 scale-105' : 'bg-transparent'}`}>
        </div>
        </div>
     );
}
export default SearchBar;
