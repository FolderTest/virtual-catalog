import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar.js';
import Main from './components/Main.js';
import Recognize from './components/Recognize.js';
import Contact from './components/Contact.js';
import Catalog from './components/Catalog.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import { ThemeProvider } from '@mui/material/styles';
import themePalette from './themePalette.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { AuthProvider } from './context/authContext';
import './setup/axiosSetup';

function App() {
  return (
    <AuthProvider>
    <ThemeProvider theme={themePalette}>
    <Router>
    <Layout>
    <div className="App">
    <ToastContainer position={toast.POSITION.TOP_CENTER} />
      <Routes>
        <Route path="/" element= {
          <>
          <Navbar />
          <Main />
          </> 
        }/>
        <Route path="/recognize" element= {
          <>
          <Navbar />
          <Recognize />
          </>
        } />
        <Route path="/contact-us" element= {
          <>
          <Navbar />
          <Contact />
          </>
        } />
        <Route path="/catalog" element= {
          <>
          <Navbar />
          <Catalog />
          </>
        } />
      </Routes>
    </div>
    </Layout>
    </Router>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
