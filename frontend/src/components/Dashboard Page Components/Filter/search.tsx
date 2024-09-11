// SearchBar.tsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  onSearch?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, placeholder, onSearch }) => {
  return (
    <TextField
      label={placeholder}
      variant="outlined"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon onClick={onSearch}/>
          </InputAdornment>
        ),
      }}
      style={{ marginRight: '16px', marginTop:"1.5rem" }}
    />
  );
};

export default SearchBar;
