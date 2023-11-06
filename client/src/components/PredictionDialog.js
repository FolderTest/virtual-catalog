import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAuth } from '../context/authContext';  // Dostosuj ścieżkę w razie potrzeby, w zależności od struktury folderów.
import { toast } from 'react-toastify';  // Upewnij się, że masz zainstalowany i zaimportowany react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Importuj style dla react-toastify



function PredictionDialog({ open, onClose, predictionData, vehicleImage }) {
  const { prediction, probabilities, car_body_type, car_body_accuracy } = predictionData || {};

  const [vehicleType, setVehicleType] = useState("");
  const [bodyType, setBodyType] = useState("");  // Dodaj ten wiersz
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const { token } = useAuth();
  const [description, setDescription] = useState("");


  const highestProbabilityVehicle = Object.entries(probabilities || {}).reduce(
    (prev, curr) => (prev[1] > curr[1] ? prev : curr),
    ["", 0]  // added initial value to avoid error when the array is empty
  )[0];

  useEffect(() => {
    if (highestProbabilityVehicle) {
      setVehicleType(highestProbabilityVehicle);
    }

    if (car_body_type) {
      setBodyType(car_body_type);  // Ustawia wartość bodyType na podstawie car_body_type
    }
  }, [predictionData]);

  const handleAddToCatalog = async () => {
    try {
      const formData = new FormData();
      formData.append('vehicleImage', vehicleImage);
      formData.append('vehicleType', vehicleType || "-");
      formData.append('brand', brand || "-");
      formData.append('model', model || "-");
      formData.append('bodyType', bodyType || "-");  // Zakładając, że masz stan bodyType
      formData.append('productionYear', productionYear || null);
      formData.append('description', description || "-");

      console.log(token);
      const response = await fetch('http://localhost:8000/api/myapi/add_to_catalog/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`  // Uzupełnij odpowiedni token
        },
        body: formData  // Send form data
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message); // Możesz dostosować tę część do własnych potrzeb
        onClose();  // Zamknij dialog po pomyślnym dodaniu pojazdu
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas dodawania pojazdu do katalogu.");
    }
};

  

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        Prediction Result
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box flexGrow={1}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              Probabilities:
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {Object.entries(probabilities || {}).map(([vehicle, probability]) => (
                <li key={vehicle} style={{ fontWeight: 'bold', color: vehicle === highestProbabilityVehicle ? 'primary' : 'secondary' }}>
                  {vehicle}: {(probability * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
            {car_body_type && (
              <>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Car Body Type: {car_body_type} ({car_body_accuracy}%)
                </Typography>
              </>
            )}
          </Box>
          <Box>
            {vehicleImage ? (
              <img 
                src={URL.createObjectURL(vehicleImage)} 
                alt="Uploaded vehicle" 
                style={{ width: 'auto', height: '150px' }} 
              />
            ) : (
              <p>No image available</p>
            )}
          </Box>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="Vehicle Type"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        />
        {highestProbabilityVehicle === 'Car' && (
          <TextField
            fullWidth
            margin="normal"
            label="Body Type"
            value={bodyType}  // Zakładam, że zdefiniowałeś wcześniej stan bodyType
            onChange={(e) => setBodyType(e.target.value)}  // I funkcję setBodyType
          />
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Production Year"
          value={productionYear}
          onChange={(e) => setProductionYear(e.target.value)}
          type="number"
        />
        <TextField
        margin="dense"
        id="description"
        label="Description"
        type="text"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleAddToCatalog} color="primary">
        Add to Catalog
      </Button>
      <Button onClick={onClose} color="primary">
        Close
      </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PredictionDialog;
