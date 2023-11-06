import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  

function LoginDialog({ open, onClose, onOpenSignUp, onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/myapp/login/', {
        username: email,
        password: password
      });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        login(response.data.token);
        onClose();
        toast.success("Zalogowano pomyślnie!");
        onSuccess();
      } 
    } catch (error) {
        if (error.response && error.response.data.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error("Wystąpił błąd podczas logowania.");
        }
    }
};


  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}
    PaperProps={{
        style: {
            borderRadius: '15px',  
        },
    }}>
    <DialogTitle 
        sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            paddingBottom: 0
        }}
    >
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',  // Kierunek ustawiony na column
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <PersonIcon color="primary" sx={{ marginBottom: '-10px', fontSize: '6rem' }} />
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative', 
                }}
            >
                Sign <span style={{color: '#2a9d8f', marginLeft: '20px'}}>IN</span>
                <Box 
                    sx={{ 
                        content: '""',
                        position: 'absolute',
                        bottom: '-20px',  
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#2a9d8f',
                        marginBottom: '20px',
                    }}
                />
            </Box>
        </Box>
    </DialogTitle>




      <DialogContent sx={{ marginTop: '1rem' }}>
      <Typography variant="body2" align="center" sx={{ marginBottom: '20px' }}>
        Not a member yet? <span style={{ cursor: 'pointer', color: '#2a9d8f' }} onClick={onOpenSignUp}>Sign Up here</span>
      </Typography>
      <TextField 
        margin="dense" 
        label="Username" 
        fullWidth 
        required 
        value={email}  // Zmień nazwę zmiennej stanu na `username`
        onChange={(e) => setEmail(e.target.value)}  // Zmień metodę obsługi na setUsername
      />

      <TextField 
        margin="dense" 
        label="Password" 
        type="password" 
        fullWidth 
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom: '10px' }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogin} color="primary">
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginDialog;
