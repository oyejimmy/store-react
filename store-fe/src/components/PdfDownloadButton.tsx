import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';

interface PdfDownloadButtonProps {
  document: React.ReactElement;
  fileName: string;
  buttonText?: string;
  startIcon?: React.ReactNode;
  [key: string]: any;
}

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  document,
  fileName,
  buttonText = 'Download PDF',
  startIcon = <Download />,
  ...props
}) => {
  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : startIcon}
          disabled={loading}
          {...props}
        >
          {loading ? 'Preparing...' : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export const generateOrderFileName = (orderNumber: string): string => {
  const date = new Date().toISOString().split('T')[0];
  return `Order-${orderNumber}-${date}.pdf`;
};
