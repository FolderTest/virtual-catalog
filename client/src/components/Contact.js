import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';
import emailjs from 'emailjs-com';
import { Grid as MuiGrid, styled } from '@mui/material';

const Grid = styled(MuiGrid)(({ theme }) => ({
  padding: theme.spacing(5),
}));

const MapContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // Stosunek 16:9
    overflow: 'hidden',
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  }));

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Wysyłanie wiadomości za pomocą EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (error) => {
         console.log('FAILED...', error);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Typography variant="h4" color="primary" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          Please do not hesitate to contact us in case of any queries. We will get back to you as soon as possible.
        </Typography>
        <Typography variant="body1">
          <Box display="flex" alignItems="center">
            <MailOutlineIcon />
            <span style={{ marginLeft: '8px' }}>example@example.com</span>
          </Box>
        </Typography>
        <Typography variant="body1" mt={2}>
          <Box display="flex" alignItems="center">
            <CallIcon />
            <span style={{ marginLeft: '8px' }}>+48 123 456 789</span>
          </Box>
        </Typography>
        <Typography variant="body1" mt={2}>
          <Box display="flex" alignItems="center">
            <PlaceIcon />
            <span style={{ marginLeft: '8px' }}>Gabriela Narutowicza 11/12 <br /> 80-233 Gdańsk</span>
          </Box>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            variant="outlined"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit" style={{marginTop: '8px'}} fullWidth >
            Send
          </Button>
        </form>
      </Grid>

      <MapContainer mt={4}>
        <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2324.21270668242!2d18.610640876434996!3d54.37089197260415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd74905bc27359%3A0x28894eb421c53d77!2sPolitechnika%20Gda%C5%84ska%2C%20Wydzia%C5%82%20Elektroniki%2C%20Telekomunikacji%20i%20Informatyki!5e0!3m2!1sen!2spl!4v1692948472191!5m2!1sen!2spl" 
        style={{border: "0"}} 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </MapContainer>



     </Grid>
  );
}

export default Contact;
