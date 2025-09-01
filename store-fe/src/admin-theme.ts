import { getAdminTheme } from './admin-theme/index';

export const adminLightTheme = getAdminTheme({
  primaryColor: '#2c6e49',
  fontFamily: 'Roboto',
  mode: 'light'
});

export const adminDarkTheme = getAdminTheme({
  primaryColor: '#2c6e49',
  fontFamily: 'Roboto',
  mode: 'dark'
});