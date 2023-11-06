import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Box from '@mui/material/Box';
import axios from 'axios';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function SignUpDialog({ open, onClose, onOpenLogin }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  const [isRegistered, setIsRegistered] = React.useState(false); // Nowa zmienna stanu


  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/myapp/register/', {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      });
  
      // Sprawdzamy, czy odpowiedź zawiera określone pole lub komunikat, który wskazuje na pomyślną rejestrację
      if (response.status === 201 || response.status === 200 || (response.data && response.data.someSpecificField)) {
        setIsRegistered(true);
      } else {
        toast.error("Nie udało się zarejestrować. Spróbuj ponownie.");
      }
    } catch (error) {
      // Jeśli odpowiedź z serwera zawiera konkretny komunikat o błędzie, możemy go wykorzystać
      const errorMessage = error.response && error.response.data && error.response.data.detail
        ? error.response.data.detail
        : "Wystąpił błąd podczas rejestracji.";
      toast.error(errorMessage);
    }

    if (isRegistered) {
    return (
      <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth={true}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: '#F59E49',
              width: '100px',
              height: '100px',
              marginBottom: '1rem'
            }}
          >
            <CheckCircleOutlineIcon style={{ fontSize: '50px', color: 'secondary' }} />
          </Box>
          <Typography variant="h6" align="center">
            Rejestracja przebiegła pomyślnie!
          </Typography>
          <Box sx={{ marginTop: '1rem' }}>
            <Button onClick={onClose} color="secondary" style={{ marginRight: '1rem' }}>
              Zamknij
            </Button>
            <Button color="secondary">
              Zaloguj się
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }
  };

  if (isRegistered) {
    return (
      <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth={true}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              marginBottom: '1rem'
            }}
          >
            <CheckCircleOutlineIcon style={{ fontSize: '6rem', color: '#F59E49' }} />
          </Box>
          <Typography variant="h6" align="center">
            Rejestracja przebiegła pomyślnie!
          </Typography>
          <Box sx={{ marginTop: '1rem' }}>
            <Button onClick={onClose} color="secondary" style={{ marginRight: '1rem' }}>
              Zamknij
            </Button>
            <Button color="secondary" onClick={() => {
              onClose();  // Zamknij okno dialogowe rejestracji
              onOpenLogin();  // Otwórz okno dialogowe logowania
            }}>
              Zaloguj się
            </Button>

          </Box>
        </Box>
      </Dialog>
    );
  }
  

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
                <PersonAddAlt1Icon color="secondary" sx={{ marginBottom: '-10px', fontSize: '6rem', marginLeft: '2rem' }} />
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative',  // Dodajemy pozycję względną dla kontenera napisu
                    }}
                >
                    Sign <span style={{color: '#F59E49', marginLeft: '20px'}}>UP</span>
                    <Box 
                        sx={{ 
                            content: '""',
                            position: 'absolute',
                            bottom: '-20px',  // Dostosuj tę wartość, aby uzyskać pożądaną odległość od napisu
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            height: '3px',
                            backgroundColor: '#F59E49',
                            marginBottom: '20px',
                        }}
                    />
                </Box>
            </Box>
        </DialogTitle>

          <DialogContent sx={{ marginTop: '1rem' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <TextField 
                margin="dense" 
                label="First Name" 
                fullWidth 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              </Grid>
              <Grid item xs={6}>
              <TextField 
                margin="dense" 
                label="Last Name" 
                fullWidth 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              </Grid>
            </Grid>
            <TextField 
              margin="dense" 
              label="Username" 
              fullWidth 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField 
              margin="dense" 
              label="Email Address" 
              type="email" 
              fullWidth 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSignUp} color="secondary">
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

export default SignUpDialog;
