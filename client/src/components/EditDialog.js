import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';


function EditDialog({ open, onClose, vehicleData, refreshCatalog }) {
    const [vehicleType, setVehicleType] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [productionYear, setProductionYear] = useState("");
    const [description, setDescription] = useState(""); 

    useEffect(() => {
      if (vehicleData) {
        setVehicleType(vehicleData.vehicleType);
        setBrand(vehicleData.brand);
        setModel(vehicleData.model);
        setBodyType(vehicleData.bodyType);
        setProductionYear(vehicleData.productionYear);
        setDescription(vehicleData.description);
      }
    }, [vehicleData]);

  const { token } = useAuth();

  const handleUpdateCatalog = async () => {
    try {
      let parsedYear = parseInt(productionYear, 10);
      if (isNaN(parsedYear)) {
        parsedYear = null;
      }
  
      const vehicleDetails = {
        vehicleType: vehicleType || null,
        brand: brand || null,
        model: model || null,
        bodyType: bodyType || null,
        productionYear: parsedYear,
        description: description || null,
      };
  
      console.log(vehicleDetails);
  
      const response = await fetch(`http://localhost:8000/api/myapi/update_vehicle/${vehicleData.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',  // Upewnij się, że ustawiono nagłówek Content-Type na application/json
        },
        body: JSON.stringify(vehicleDetails)  // Teraz przesyłamy dane jako łańcuch JSON
      });
  
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Edytowano pomyślnie!");
        refreshCatalog();  // Wywołaj funkcję po pomyślnym zaktualizowaniu
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating vehicle in catalog.");
    }
  };
  


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
            Edit Vehicle
        </DialogTitle>
        <DialogContent>
        <TextField
            fullWidth
            margin="normal"
            label="Vehicle Type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
        />
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
            label="Body Type"
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
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
            <Button onClick={handleUpdateCatalog} color="primary">
                Update
            </Button>
            <Button onClick={onClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
);
}

export default EditDialog;