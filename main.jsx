import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#d4a91f' }, background: { default: '#f4f5f7' } },
  typography: { fontFamily: 'Arial, sans-serif', h4: { fontWeight: 800 }, h5: { fontWeight: 800 } },
  shape: { borderRadius: 14 },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
