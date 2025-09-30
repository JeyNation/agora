import { createTheme, Theme } from '@mui/material/styles';

// Modern Blue-Gray theme tokens
export const modernLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E6FFF', contrastText: '#FFFFFF' },
    secondary: { main: '#00BFA6', contrastText: '#0F1720' },
    background: { default: '#F6F8FA', paper: '#FFFFFF' },
    text: { primary: '#0F1720', secondary: '#6B7280' },
    divider: '#E6E9EE',
    success: { main: '#28A745' },
    warning: { main: '#FFB020' },
    error: { main: '#E53E3E' },
    info: { main: '#2B6CB0' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        containedPrimary: { boxShadow: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        colorPrimary: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    MuiFab: {
      defaultProps: {
        color: 'secondary',
      },
    },
  },
});

export const modernDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#5FA1FF', contrastText: '#0B1220' },
    secondary: { main: '#2EE1C1', contrastText: '#0B1220' },
    background: { default: '#0B1220', paper: '#0F1724' },
    text: { primary: '#E6EEF6', secondary: '#AAB7C7' },
    divider: 'rgba(255,255,255,0.06)',
    success: { main: '#28A745' },
    warning: { main: '#FFB020' },
    error: { main: '#E53E3E' },
    info: { main: '#2B6CB0' },
  },
});
