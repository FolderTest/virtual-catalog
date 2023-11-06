import React, { useState, useCallback } from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import PredictionDialog from './PredictionDialog';  // Asumując, że PredictionDialog jest w tym samym katalogu
import { useAuth } from '../context/authContext';  // Upewnij się, że ścieżka jest poprawna w zależności od lokalizacji pliku authContext.
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';  // Upewnij się, że masz zainstalowany i zaimportowany react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Importuj style dla react-toastify


function Recognize() {
  const [imageAdded, setImageAdded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const { isLoggedIn } = useAuth();


  const [isPredictionDialogOpen, setIsPredictionDialogOpen] = useState(false);
  const [predictionData, setPredictionData] = useState({ prediction: "", probabilities: {} });


  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length > 1) {
      toast.error("Możesz dodać tylko jedno zdjęcie!");
      return;
    }
    setImageAdded(true);
  }, []);

  const onFileInputChange = (event) => {
    onDrop(event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  const resetImage = () => {
    setImageAdded(false);
    setSelectedFile(null);  
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn('Proszę wybrać plik!');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/api/myapi/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Przykład odpowiedzi:
      // {
      //   "prediction": "Car",
      //   "probabilities": {
      //     "Bus": 0.002,
      //     "Car": 0.95,
      //     "Truck": 0.03,
      //     "Motorcycle": 0.018
      //   }
      // }
  
      const { prediction, probabilities, car_body_type, car_body_accuracy } = response.data;
      setPredictionData({ prediction, probabilities, car_body_type, car_body_accuracy });
      setIsPredictionDialogOpen(true);
      
     } catch (error) {
      console.error('Błąd podczas przesyłania obrazu:', error);
      toast.error('Nie udało się przesłać obrazu. Spróbuj ponownie później.');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Grid container justifyContent="center">
        <Typography variant="h4" align="center" gutterBottom>
          Aby korzystać z funkcji rozpoznawania, musisz się zalogować.
        </Typography>
      </Grid>
    );
  }
  

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
      {isLoading && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            position="fixed" 
            top={0} 
            left={0} 
            width="100vw" 
            height="100vh" 
            zIndex={9999} // duża wartość, aby upewnić się, że jest na wierzchu
          >
            <CircularProgress size={ 150 }/>
          </Box>
        )}
      <PredictionDialog 
        open={isPredictionDialogOpen} 
        onClose={() => setIsPredictionDialogOpen(false)} 
        predictionData={predictionData} 
        vehicleImage={selectedFile}
      />

        <Typography variant="h3" align="center" gutterBottom>
          Recognize car
        </Typography>

        <Paper 
          style={{
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: imageAdded ? '2px dashed #28a745' : '2px dashed #cccccc',
            cursor: imageAdded ? 'default' : 'pointer',
            backgroundColor: imageAdded ? '#d4edda' : '#ffffff',
          }}
        >
          {!imageAdded && (
            <>
              <input 
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="fileInput"
                onChange={onFileInputChange}
              />
              <label htmlFor="fileInput" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <Typography variant="h6">
                  Przeciągnij i upuść zdjęcie lub kliknij, aby wybrać plik
                </Typography>
              </label>
            </>
          )}
          {imageAdded && (
            <>
              <CheckCircleOutlineIcon style={{ color: '#28a745', fontSize: 40 }} />
              <Typography variant="h6" style={{ color: '#28a745' }}>
                Pomyślnie dodano zdjęcie
              </Typography>
            </>
          )}
        </Paper>

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={resetImage}
            disabled={!imageAdded}
            startIcon={<DeleteIcon />}
          >
            Usuń zdjęcie
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!imageAdded}
            style={{ marginLeft: 10 }}
          >
            Rozpoznaj Pojazd
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Recognize;
