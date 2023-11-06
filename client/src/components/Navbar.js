import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import LoginDialog from './LogInDialog';
import SignupDialog from './SignUpDialog';
import { useAuth } from '../context/authContext';

const pagesLoggedOut = ['Home', 'Contact us'];
const pagesLoggedIn = ['Home', 'Recognize', 'Catalog', 'Contact us'];
const settings = ['Profile', 'Logout'];

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(null);
  const { isLoggedIn, logout } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenLogin = () => {
    setOpenDialog('login');
  };
  const handleOpenSignup = () => {
    setOpenDialog('signup');
  };
  const handleClose = () => {
    setOpenDialog(null);
  };
  const handleOpenSignUpFromLogin = () => {
    setOpenDialog('signup');
  };
  const handleSuccessfulLogin = () => {
    handleClose();
  };
  const handleLogout = () => {
    // Usuń token z localStorage
    localStorage.removeItem('userToken');
    // Jeśli masz funkcję logout w useAuth, użyj jej tutaj
    logout();
};


  const displayPages = isLoggedIn ? pagesLoggedIn : pagesLoggedOut;

  return (
    <HideOnScroll>
      <Box sx={{ marginBottom: '100px' }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <DirectionsCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, ml: 6, color: '#1b263b' }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#1b263b',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="#1b263b"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {displayPages.map((page) => (
                    <MenuItem 
                      key={page} 
                      component={Link}
                      to={page === 'Home' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`}
                      onClick={handleCloseNavMenu}
                      sx={{
                        '&:hover, &:active': {
                          backgroundColor: 'transparent',
                          '& .MuiTypography-root': {
                            color: '#000000',
                          }
                        }
                      }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <DirectionsCarIcon sx={{ display: { xs: 'flex', md: 'none' } }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#1b263b',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {displayPages.map((page) => (
                  <Button
                    key={page}
                    component={Link}
                    to={page === 'Home' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      my: 2,
                      color: '#1b263b',
                      display: 'block',
                      fontWeight: 500,
                      ml: 6,
                      '&:hover, &:active': {
                        backgroundColor: 'transparent',
                        color: '#000000',
                      },
                      textDecoration: 'none'
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              {!isLoggedIn && (
                <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                  <Button color="primary" onClick={handleOpenLogin} sx={{ fontWeight: 'bold' }}>
                    Sign In
                  </Button>
                  <Button color="secondary" onClick={handleOpenSignup} sx={{ fontWeight: 'bold' }}>
                    Sign Up
                  </Button>

                  <LoginDialog 
                    open={openDialog === 'login'} 
                    onClose={handleClose} 
                    onOpenSignUp={handleOpenSignUpFromLogin} 
                    onSuccess={handleSuccessfulLogin}
                  />

                  <SignupDialog 
                    open={openDialog === 'signup'} 
                    onClose={handleClose} 
                    onOpenLogin={handleOpenLogin} 
                  />
                </Box>
              )}

              {isLoggedIn && (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 3 }}>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    onLogout={handleLogout}
                  >
                    {settings.map((setting) => (
                      <MenuItem 
                        key={setting} 
                        onClick={() => {
                          handleCloseUserMenu();
                          if (setting === 'Logout') {
                            handleLogout();
                          }
                        }}
                        sx={{
                          '&:hover, &:active': {
                            backgroundColor: 'transparent',
                            '& .MuiTypography-root': {
                              color: '#000000',
                            }
                          }
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </HideOnScroll>
  );
}

export default Navbar;
