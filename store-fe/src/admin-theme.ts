import { getAdminTheme } from './admin-theme/index';

export const adminLightTheme = getAdminTheme({
  primaryColor: '#6366f1',
  fontFamily: 'Roboto',
  mode: 'light'
});

export const adminDarkTheme = getAdminTheme({
  primaryColor: '#8b5cf6',
  fontFamily: 'Roboto',
  mode: 'dark'
});