import { createTheme } from "@mui/material/styles";
import { GOLD } from "./config";

export const beosTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: GOLD,
      contrastText: "#111111"
    },
    secondary: {
      main: "#111111"
    },
    background: {
      default: "#F3F4F6",
      paper: "#FFFFFF"
    }
  },

  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",

    h4: {
      fontWeight: 900
    },

    h5: {
      fontWeight: 900
    },

    h6: {
      fontWeight: 900
    },

    button: {
      fontWeight: 800,
      textTransform: "none"
    }
  },

  shape: {
    borderRadius: 12
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)"
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 900,
          backgroundColor: "#F7F7F7"
        }
      }
    }
  }
});
