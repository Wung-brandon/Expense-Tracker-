import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface TotalCardProps {
  title: string;
  total: number;
  icon: SvgIconComponent;
}

const TotalCard: React.FC<TotalCardProps> = ({ title, total, icon: Icon }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 4,
        margin: 6,
        height: 'auto',
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 7,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',  
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',  
          backgroundColor:"#4a148c",
          color: "white",
          transition: "all 0.3s ease",
          '& .MuiSvgIcon-root': { 
            color: 'white',
          },
        },
      }}
    >
      <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, marginBottom: { xs: 2, sm: 0 } }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{total}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon sx={{ fontSize: 40, color: '#4a148c' }} />
      </Box>
    </Card>
  );
};

export default TotalCard;
