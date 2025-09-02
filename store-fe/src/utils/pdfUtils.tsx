import React from 'react';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

/**
 * Generates a standardized filename for order PDFs
 * @param orderNumber - The order number or identifier
 * @returns Formatted filename string (e.g., "Order-12345-2023-09-01.pdf")
 */
export const generateOrderFileName = (orderNumber: string): string => {
  const date = new Date().toISOString().split('T')[0];
  return `Order-${orderNumber}-${date}.pdf`;
};

interface PDFDownloadButtonProps extends Omit<ButtonProps, 'onClick' | 'component'> {
  /** The React PDF document component to render */
  document: React.ReactElement;
  /** The filename for the downloaded PDF */
  fileName: string;
  /** Text to display on the button */
  buttonText?: string;
  /** Icon to display at the start of the button */
  startIcon?: React.ReactNode;
  /** Show loading state */
  loading?: boolean;
}

/**
 * A reusable button component for downloading PDFs
 * Wraps PDFDownloadLink with Material-UI Button and loading state
 */
export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  document,
  fileName,
  buttonText = 'Download PDF',
  startIcon = <DownloadIcon />,
  loading: propLoading,
  ...props
}) => {
  // Skip rendering on server-side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ loading: linkLoading }) => {
        const isLoading = propLoading !== undefined ? propLoading : linkLoading;
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} /> : startIcon}
            disabled={isLoading}
            {...props}
          >
            {isLoading ? 'Preparing...' : buttonText}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

// Re-export commonly used PDF components
export { PDFViewer, Document, Page, Text, View, StyleSheet, Image, Font };
