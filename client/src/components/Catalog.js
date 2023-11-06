import React, { useEffect, useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography, Grid, CardActions, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormGroup, FormControlLabel,
  Slider, Drawer, List, ListItem, Box, TextField
} from '@mui/material';
import { useAuth } from '../context/authContext';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import EditDialog from './EditDialog';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const BASE_IMAGE_URL = 'http://localhost:8000';

function Catalog() {
  const [vehicles, setVehicles] = useState([]);
  const { token } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [brands, setBrands] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState({});
  const [bodyTypes, setBodyTypes] = useState({});
  const [yearStart, setYearStart] = useState(null);
  const [yearEnd, setYearEnd] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(new Set());
  const [selectedBodyTypes, setSelectedBodyTypes] = useState(new Set());

  const [allVehicles, setAllVehicles] = useState([]);


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSaveFilters = () => {
    applyFilters();
    setIsDrawerOpen(false);
  };
  
  useEffect(() => {
    // jeśli którykolwiek z filtrów się zmieni, możesz zastosować filtry ponownie
    applyFilters();
  }, [selectedBrands, selectedVehicleTypes, selectedBodyTypes, yearStart, yearEnd]);
  

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    // Jeśli szuflada jest zamykana, zastosuj filtry.
    if (!open) {
      // Możesz wywołać tutaj dowolną dodatkową logikę potrzebną do zastosowania filtrów.
    }

    setIsDrawerOpen(open);
  };



  const handleFilterChange = (event, setFilterState) => {
    const { name, checked } = event.target;
    setFilterState(prevState => {
      const newState = new Set(prevState);
      if (checked) {
        newState.add(name);
      } else {
        newState.delete(name);
      }
      return newState;
    });
  };

  
  const aggregateData = (data, key) => {
    let counts = {};
    data.forEach(item => {
      const value = item[key];
      if (value && value !== '-') { // Pomijamy puste, niezdefiniowane wartości lub '-'
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  };

  const handleYearChange = (event, yearType) => {
    const value = event.target.value;

    // Ustaw wartość na null, jeśli pole jest puste, aby wyłączyć filtrowanie.
    const intValue = value === "" ? null : parseInt(value);

    if (yearType === 'start') {
      setYearStart(intValue);
    } else if (yearType === 'end') {
      setYearEnd(intValue);
    }

    // Możesz również dodać logikę do ponownego filtrowania listy pojazdów na podstawie nowego zakresu
  };

  

  useEffect(() => {
    refreshCatalog();

    setBrands(aggregateData(vehicles, 'brand'));
    setVehicleTypes(aggregateData(vehicles, 'vehicleType'));
    setBodyTypes(aggregateData(vehicles, 'bodyType'));

  }, [vehicles]);

  const handleEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsEditDialogOpen(true);
  };

  const refreshCatalog = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/myapi/get_vehicles/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setVehicles(data);
        setAllVehicles(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, [token]);

  const handleDeleteDialogOpen = (vehicleId) => {
    setVehicleToDelete(vehicleId);
    setIsDeleteDialogOpen(true);
  };

  const applyFilters = () => {
    // Filtrujemy pojazdy na podstawie wybranych kryteriów.
    const newFilteredVehicles = allVehicles.filter(vehicle => {
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(vehicle.brand);
      const matchesVehicleType = selectedVehicleTypes.size === 0 || selectedVehicleTypes.has(vehicle.vehicleType);
      const matchesBodyType = selectedBodyTypes.size === 0 || selectedBodyTypes.has(vehicle.bodyType);
    
      const validStartYear = yearStart !== null ? vehicle.productionYear >= yearStart : true;
      const validEndYear = yearEnd !== null ? vehicle.productionYear <= yearEnd : true;
    
      return matchesBrand && matchesVehicleType && matchesBodyType && validStartYear && validEndYear;
    });
  
    setVehicles(newFilteredVehicles);  // aktualizacja stanu pojazdów
  };
  

  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/myapi/delete_vehicle/${vehicleId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        console.error('Error deleting vehicle:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
    setIsDeleteDialogOpen(false);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(vehicle.brand);
    const matchesVehicleType = selectedVehicleTypes.size === 0 || selectedVehicleTypes.has(vehicle.vehicleType);
    const matchesBodyType = selectedBodyTypes.size === 0 || selectedBodyTypes.has(vehicle.bodyType);
  
    const validStartYear = yearStart !== null ? vehicle.productionYear >= yearStart : true;
    const validEndYear = yearEnd !== null ? vehicle.productionYear <= yearEnd : true;
  
    return matchesBrand && matchesVehicleType && matchesBodyType && validStartYear && validEndYear;
  });

  const resetFilters = () => {
    setSelectedBrands(new Set()); // resetowanie stanu wybranych marek
    setSelectedVehicleTypes(new Set()); // resetowanie stanu wybranych typów pojazdów
    setSelectedBodyTypes(new Set()); // resetowanie stanu wybranych typów nadwozia
    setYearStart(null); // resetowanie stanu początkowego roku
    setYearEnd(null); // resetowanie stanu końcowego roku
  

    setVehicles(allVehicles); 
    // Tutaj możesz także zresetować inne stany związane z filtrowaniem, jeśli je masz.
  };
  
  

  return (
    <div>
      <Button
          startIcon={<FilterAltIcon style={{ fontSize: "2.5rem" }} />} // Zwiększ rozmiar ikony
          onClick={toggleDrawer(true)}
          sx={{
            width: '100%',  // Upewnij się, że przycisk zajmuje pełną szerokość ListItem, aby ikona była wyśrodkowana
            justifyContent: 'center' // Wycentruj zawartość przycisku
          }}
        >
          Filter
        </Button>
      <Drawer
    anchor="top"
    open={isDrawerOpen}
    onClose={toggleDrawer(false)}
  >
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', p: 2 }}>
      {/* Filtr marki */}
      <Box>
        <FormGroup>
          <Typography variant="h6">Brand</Typography>
          {Object.keys(brands).map((brand) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={brand}
                  onChange={(event) => handleFilterChange(event, setSelectedBrands)}
                  checked={selectedBrands.has(brand)}
                />
              }
              label={`${brand} (${brands[brand]})`}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Filtr typu pojazdu */}
      <Box>
        <FormGroup>
          <Typography variant="h6">Vehicle Type</Typography>
          {Object.keys(vehicleTypes).map((type) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={type}
                  onChange={(event) => handleFilterChange(event, setSelectedVehicleTypes)}
                  checked={selectedVehicleTypes.has(type)}
                />
              }
              label={`${type} (${vehicleTypes[type]})`}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Filtr typu nadwozia */}
      <Box>
        <FormGroup>
          <Typography variant="h6">Body Type</Typography>
          {Object.keys(bodyTypes).map((type) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={type}
                  onChange={(event) => handleFilterChange(event, setSelectedBodyTypes)}
                  checked={selectedBodyTypes.has(type)}
                />
              }
              label={`${type} (${bodyTypes[type]})`}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Filtr rocznika */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: 'column' }}> {/* Uwaga na zmianę kierunku na 'column' */}
        <Typography variant="h6">Production Year:</Typography>
        <TextField
          value={yearStart}
          onChange={(e) => handleYearChange(e, 'start')}
          type="number"
          variant="outlined"
          size="small"
          label="From year"
        />
        <TextField
          value={yearEnd}
          onChange={(e) => handleYearChange(e, 'end')}
          type="number"
          variant="outlined"
          size="small"
          label="To year"
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveFilters}>
          Save filters
        </Button>
        <Button onClick={resetFilters} color="secondary">
          Reset filters
        </Button>
      </Box>
    </Box>
  </Drawer>
  {filteredVehicles == 0 &&
  <>
        <h1 style={{textAlign: 'center', marginTop: '4.5rem', fontSize: '4rem'}}>
          There's no vehicles to be displayed.
        </h1>
        <h2 style={{textAlign: 'center'}}>
          Change filters or add some vehicles
        </h2>
        </>
      }
      <Grid container spacing={2}>
    
        {filteredVehicles.map(vehicle => (
          <Grid item xs={4} key={vehicle.id}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '20px' }}>
              <CardMedia
                component="img"
                alt="Vehicle image"
                style={{ height: '300px', objectFit: 'cover' }}
                image={`${BASE_IMAGE_URL}${vehicle.vehicleImage?.image}`}
                onError={(e) => { e.target.onerror = null; e.target.src = "/path/to/default/image.jpg"; }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: '18px' }}>
                  Vehicle Type: {vehicle.vehicleType || '-'}<br />
                  Brand: {vehicle.brand || '-'}<br />
                  Model: {vehicle.model || '-'}<br />
                  Body Type: {vehicle.bodyType || '-'}<br />
                  Production Year: {vehicle.productionYear || '-'} <br />
                  Description: {vehicle.description || '-'}
               </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'right' }}>
                <IconButton onClick={() => handleDeleteDialogOpen(vehicle.id)} aria-label="delete">
                  <DeleteForeverIcon />
                </IconButton>
                <IconButton onClick={() => handleEdit(vehicle)} aria-label="edit">
                  <EditIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <EditDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        vehicleData={vehicleToEdit}
        refreshCatalog={refreshCatalog}
      />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this vehicle?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(vehicleToDelete)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Catalog;
