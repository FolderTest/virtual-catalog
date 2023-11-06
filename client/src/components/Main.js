import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import car1 from '../images/main/car1.jpg';
import car2 from '../images/main/car2.jpg';
import car3 from '../images/main/car3.jpg';
import car4 from '../images/main/car4.jpg';
import car5 from '../images/main/car5.jpg';
import car6 from '../images/main/car6.jpg';
import car7 from '../images/main/car7.jpg';
import car8 from '../images/main/car8.jpg';
import car9 from '../images/main/car9.jpg';
import automotive from '../images/main/automotive.jpg';
import Button from '@mui/material/Button';

const images = [car1, car2, car3, car4, car5, car6, car7, car8, car9];





function Main() {
  return (
    <>
    <Box ml={6} >
    <Grid container spacing={4} >
        {/* Left column for text */}
        <Grid item xs={12} md={6} style={{ marginTop: '50px' }}>
          <Box mt={6}>
            <Typography variant="h3" gutterBottom sx={{fontWeight: 'bold'}}>
                Welcome to the modern <br /><span style={{color: 'secondary'}}> car catalog! </span>
            </Typography>
            <Typography variant="h5">
                Looking for the perfect vehicle for yourself or want to learn more about a car that caught your eye? <br />You're in the right place!
            </Typography>
            <Grid container spacing={2} mt={1} alignItems="center">
            <Grid item>
                <Button 
                    color="primary" 
                    variant="contained" 
                    sx={{ borderRadius: '5px' }}>
                    Main button
                </Button>
            </Grid>
            <Grid item>
                <Button 
                    color="secondary" 
                    variant="contained" 
                    sx={{ borderRadius: '5px' }}>
                    Secondary button
                </Button>
            </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* Right column for image */}
        <Grid item xs={12} md={6} overflow={'hidden'} sx={{marginBottom: '-600px'}}>
        <Box 
            display={{ xs: 'none', md: 'block' }} 
            sx={{ transform: 'rotate(-45deg)', position: 'relative', right: '-45%', top: '-30%' }}
        >
            <Grid container spacing={1} >
            {/* 1st column: 2 images */}
            <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <img src={images[0]} alt="Car 1" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[1]} alt="Car 2" style={{ width: '100%', height: 'auto' }} />
            </Grid>

            {/* 2nd column: 3 images */}
            <Grid item xs={4}>
                <img src={images[2]} alt="Car 3" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[3]} alt="Car 4" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[4]} alt="Car 5" style={{ width: '100%', height: 'auto' }} />
            </Grid>

            {/* 3rd column: 4 images */}
            <Grid item xs={4}>
                <img src={images[5]} alt="Car 6" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[6]} alt="Car 7" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[7]} alt="Car 8" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                <img src={images[8]} alt="Car 9" style={{ width: '100%', height: 'auto' }} />
            </Grid>
            </Grid>
        </Box>
        </Grid>
    </Grid>
    </Box>
    
    <Box ml={6} style={{padding: 0, marginRight: 30}}>
        <Grid container spacing={4} style={{ marginTop: '100px' }}>
            {/* Left column for text */}
        <Grid item xs={12} md={6}>
            <Typography variant='h3' gutterBottom >
                Recognize car
            </Typography>
            <Typography variant='h5'>
                Discover the rich world of cars with our platform, tailored for every car enthusiast. Utilize our advanced vehicle recognition technology to easily add your own vehicles. Join us and become a part of the global community of car lovers.
            </Typography>

            {/* Grid below the text, divided into three parts */}
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={4}>
                    {/* Content for the first part */}
                    <Typography variant='h4'>
                        First part
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    {/* Content for the second part */}
                    <Typography variant='h4'>
                        Second part
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    {/* Content for the third part */}
                    <Typography variant='h4'>
                        Third part
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
            {/* Right column for the text "For car enthusiasts" */}
            <Grid item xs={12} md={6}>
                <img src={automotive} alt="Automotive" style={{ width: '100%', height: 'auto', borderRadius: '2%' }} />
            </Grid>
        </Grid>

        <Grid container spacing={4} style={{ marginTop: '120px' }}>
        {/* Left column for the text "Why choose our platform?" */}
        <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '15px' }}>
                <Typography variant="h3" gutterBottom color="primary">
                    Why choose our platform?
                </Typography>
                <Typography variant="h5">
                    Our platform offers a unique vehicle addition module based on image recognition technology. Just upload a photo, and we'll take care of the rest - from identifying the type of vehicle to determining the brand and model.
                </Typography>
            </Paper>
        </Grid>

        {/* Right column for the text "Discover the future of car cataloging!" */}
        <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '15px' }}>
                <Typography variant="h3" gutterBottom color="secondary">
                    Discover the future of car cataloging!
                </Typography>
                <Typography variant="h5">
                    Our platform combines traditional cataloging methods with modern technologies. This allows us to offer a tool tailored to the needs of both individual users and professionals in the automotive industry.
                </Typography>
            </Paper>
        </Grid>
        </Grid>
        
        {/* Text "Start your journey with us!" */}
        <Grid item xs={12} sx={{ marginTop: '150px', marginBottom: '100px' }}>
            <Typography variant="h4" gutterBottom>
                Start your journey with us!
            </Typography>
            <Typography variant="h6">
                Join the community of enthusiasts and professionals. Discover the new possibilities offered by the modern car catalog. Register today!
            </Typography>
            <Button 
                color="secondary" 
                variant="contained" 
                sx={{ 
                    borderRadius: '5px',
                    marginTop: '10px',
                    marginBottom: '20px',
                    padding: {
                        xs: '8px 16px',  // Małe urządzenia
                        md: '12px 24px', // Średnie urządzenia
                        lg: '16px 32px'  // Duże urządzenia
                    },
                    fontSize: {
                        xs: '0.5rem',      // Małe urządzenia
                        md: '0.75rem',      // Średnie urządzenia
                        lg: '1rem'       // Duże urządzenia
                    },
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontWeight: 'bold',
                }}>
                Sign Up!
            </Button>
        </Grid>
    </Box>
    
    </>
  );
}

export default Main;
