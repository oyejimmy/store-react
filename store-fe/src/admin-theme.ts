import { getAdminTheme } from './admin-theme/index';

export const adminLightTheme = getAdminTheme({
  primaryColor: '#1E1B4B', // Deep navy
  secondaryColor: '#94A3B8', // Silver accent
  backgroundColor: '#F8FAFC', // Off-white
  fontFamily: 'Inter',
  mode: 'light'
});

export const adminDarkTheme = getAdminTheme({
  primaryColor: '#94A3B8', // Silver accent
  secondaryColor: '#1E1B4B', // Deep navy
  backgroundColor: '#0F172A', // Dark background for contrast
  fontFamily: 'Inter',
  mode: 'dark'
});
