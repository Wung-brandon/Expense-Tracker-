import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { DarkModeOutlined } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BudgetIcon from '@mui/icons-material/AccountBalanceWallet';
import ReportIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import useAxios from '../../../utils/useAxios';
import defaultImg from "../../../assets/defaults.jpeg"
import { useThemeBackground } from '../../../context/BackgroundContext';

const drawerWidth = 240;

// Define styles for opened and closed drawer states
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  ...(theme.palette.mode === 'light' && {
    backgroundColor: '#4a148c', // Purple color for light mode
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: '#ffffff', // White color for dark mode
  }),
  color: theme.palette.mode === 'light' ? '#ffffff' : '#4a148c', // Text color
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  ...(theme.palette.mode === 'light' && {
    backgroundColor: '#4a148c', // Purple color for light mode
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: '#ffffff', // White color for dark mode
  }),
  color: theme.palette.mode === 'light' ? '#ffffff' : '#4a148c', // Text color
});

// Drawer component styled with conditional theme-based styles
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
      },
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  minHeight: '48px',
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#4a148c', // Purple color for AppBar
  color: '#ffffff', // White color for text and icons
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: 'nowrap',
//     boxSizing: 'border-box',
//     ...(open && {
//       ...openedMixin(theme),
//       '& .MuiDrawer-paper': {
//         ...openedMixin(theme),
//         backgroundColor: '#f5f5f5', // Light grey color for Drawer
//         color: '#000000', // Black color for text
//       },
//     }),
//     ...(!open && {
//       ...closedMixin(theme),
//       '& .MuiDrawer-paper': {
//         ...closedMixin(theme),
//         backgroundColor: '#f5f5f5', // Light grey color for Drawer
//         color: '#000000', // Black color for text
//       },
//     }),
//   }),
// );

export default function Sidebar() {
  const axiosInstance = useAxios();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile function
  const fetchUserProfile = async () => {
    if (!authTokens) {
      console.error("No authentication token available");
      return;
    }

    try {
      const response = await axiosInstance.get("/user/profile/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      if (response.data && response.data.results.length > 0) {
        setUserProfile(response.data.results[0]);
      } else {
        console.error("User profile not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [authTokens]);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { isDarkMode, toggleTheme } = useThemeBackground();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ paddingLeft: open ? 2 : 0 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && { display: 'none' }),
              
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ExpenseEye
          </Typography>
          <div className="d-flex align-items-center justify-content-center">
            <IconButton onClick={toggleTheme} color='inherit'>
              <DarkModeOutlined />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            {userProfile && (
              userProfile.profile_img ? (
                <>
                  <h5 className='me-3 text-capitalize mt-2' style={{ color: "#ffffff" }}>{userProfile.full_name ? userProfile.full_name : userProfile.user || ""}</h5>
                  <img 
                    src={userProfile.profile_img} 
                    className='rounded-circle img-fluid' 
                    style={{ width: "40px", height: "40px" }} 
                    alt="Profile"
                  />
                </>
              ) : (
                <div className='d-flex align-items-center'>
                  <h5 className='me-3 text-capitalize mt-2' style={{ color: "#ffffff" }}>{userProfile.full_name ? userProfile.full_name : userProfile.user || ""}</h5>
                  <div 
                    className='rounded-circle d-flex align-items-center justify-content-center' 
                    style={{
                      width: "40px", 
                      height: "40px", 
                      backgroundColor: "#6A0DAD", // Purple background color
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "bold"
                    }}
                  >
                    {userProfile.email.charAt(0).toUpperCase()} {/* First letter of the email */}
                  </div>
                </div>
              )
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {userProfile && <h5 className='text-center text-capitalize fw-bold m-auto'>{userProfile.user || ''}</h5>}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List >
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link to="expense" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Expenses" />
            </ListItem>
          </Link>
          <Link to="income" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <ReceiptIcon  />
              </ListItemIcon>
              <ListItemText primary="Income" />
            </ListItem>
          </Link>
          <Link to="/budget" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <BudgetIcon />
              </ListItemIcon>
              <ListItemText primary="Budget" />
            </ListItem>
          </Link>
          <Link to="/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </Link>
          <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{color:"#fff"}}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>
        </List>
        <Divider style={{background:"#fff"}} />
        <List>
          <ListItem button onClick={logoutUser}>
            <ListItemIcon sx={{color:"#fff"}}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
