import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
// import { useThemeBackground } from '../../../context/BackgroundContext';

interface TotalCardProps {
  title: string;
  total: number;
  icon: SvgIconComponent;
  backgroundColor?: string;  
  hoverBackgroundColor?: string;  
  iconColor?: string;  
  hoverIconColor?: string;  
}

const TotalCard: React.FC<TotalCardProps> = ({ title, total, icon: Icon, backgroundColor, hoverBackgroundColor, iconColor, hoverIconColor }) => {
  // const { isDarkMode } = useThemeBackground();
  
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
        width: {xs: '50', sm: '100%'},
        backgroundColor: backgroundColor,  
        borderRadius: 7,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',  
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',  
          backgroundColor: hoverBackgroundColor,  // Apply hover background color from props
          color: 'white',
          transition: 'all 0.3s ease',
          '& .MuiSvgIcon-root': { 
            color: hoverIconColor,  // Apply hover icon color from props
          },
        },
      }}
      // className="widget"
    >
      <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, marginBottom: { xs: 2, sm: 0 } }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{total}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon sx={{ fontSize: 40, color: iconColor }} />  {/* Apply icon color from props */}
      </Box>
    </Card>
  );
};

export default TotalCard;
