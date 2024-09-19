import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Box } from '@mui/material';
import { useThemeBackground } from '../../../context/BackgroundContext';
import "./search.css"
import "../DarkModeStyles.css"

interface SearchProps {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onClick?: () => void;
}

const SearchBar: React.FC<SearchProps> = ({ placeholder, onChange, value, onClick }) => {
  const { isDarkMode } = useThemeBackground();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '55%',
        maxWidth: '800px', 
        paddingTop: '16px',
        paddingBottom: '16px',
        borderRadius: '8px',
      }}
      className={isDarkMode ? 'custom-dark-mode' : ''}
    >
      <TextField
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        fullWidth
        
      />
      <SearchIcon
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          fontSize: "1.8rem",
          color: "gray",
          cursor: 'pointer',
          '&:hover': {
            color: isDarkMode? '#fff' : '#555',
          },
        }}
        
      />
    </Box>
  );
};

export default SearchBar;
