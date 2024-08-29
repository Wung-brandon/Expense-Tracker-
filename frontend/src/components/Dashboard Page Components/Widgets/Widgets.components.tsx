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
    <Card sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: 2, 
      margin: 1,
      height: 'auto'
    }}>
      <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, marginBottom: { xs: 2, sm: 0 } }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{total}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon sx={{ fontSize: 40, color: '#1976d2' }} />
      </Box>
    </Card>
  );
};

export default TotalCard;
