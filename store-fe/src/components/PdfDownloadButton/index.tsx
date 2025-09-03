import React, { useState, useEffect } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface PdfDownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  document: React.ReactElement;
  fileName: string;
  buttonText?: string;
  startIcon?: React.ReactNode;
}

export const generateOrderFileName = (prefix: string = 'report') => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.pdf`;
};

// A simple PDF document component
const SimpleDocument: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {children}
      </View>
    </Page>
  </Document>
);

const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  document,
  fileName,
  buttonText = 'Download PDF',
  startIcon = <DownloadIcon />,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Create a simple PDF document
      const blob = await pdf(
        <SimpleDocument>
          <Text>Order Details</Text>
          <Text>This is a placeholder for the order details.</Text>
        </SimpleDocument>
      ).toBlob();
      
      // Save the PDF
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      variant={props.variant || 'contained'}
      color={props.color || 'primary'}
      disabled={loading}
      sx={{
        bgcolor: props.variant === 'contained' ? '#2c6e49' : 'transparent',
        '&:hover': {
          bgcolor: props.variant === 'contained' ? '#1e4f35' : 'rgba(0, 0, 0, 0.04)',
        },
        ...props.sx,
      }}
      {...props}
    >
      {loading ? 'Generating...' : buttonText}
    </Button>
  );
};

export default PdfDownloadButton;
