import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themePalette = createTheme({
  palette: {
    primary: {
      main: '#2a9d8f', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F59E49', 
      contrastText: '#ffffff',
    },
  },

  typography: {
    h3: {
      color: '#000000',
      fontWeight: 'bold'
    },
    h4: {
      color: '#F59E49',
      fontWeight: 'bold'
    },
    h5: {
      color: '#61677A'

    }
  }
  
});

themePalette = responsiveFontSizes(themePalette);

export default themePalette;