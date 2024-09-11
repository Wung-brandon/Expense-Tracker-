import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import "./search.css"

interface SearchProps {
  placeholder: string;
  onChange?: any;
  value?: string;
  onClick?: any;
}

const SearchBar: React.FC<SearchProps> = ({ placeholder, onChange, value, onClick }) => {
  return (
    <div className="row">
      <div className="col-4 mt-4">
        <div className="position-relative">
          <TextField
            type="text"
            className="form-control fs-2 search-input"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
          <SearchIcon 
            className="search-icon fs-2" 
            onClick={onClick} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
