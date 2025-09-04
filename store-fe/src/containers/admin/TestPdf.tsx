import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const TestPdf: React.FC = () => {
  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Test PDF Document', 14, 15);
    
    // Add some content
    doc.setFontSize(12);
    doc.text('This is a test PDF document generated from the admin panel.', 14, 30);
    
    // Add a simple table
    const headers = ['ID', 'Name', 'Value'];
    const data = [
      ['1', 'Item 1', 'Value 1'],
      ['2', 'Item 2', 'Value 2'],
      ['3', 'Item 3', 'Value 3'],
    ];
    
    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [44, 110, 73],
        textColor: 255,
        fontStyle: 'bold',
      },
    });
    
    doc.save('test_document.pdf');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        PDF Generation Test
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleGeneratePdf}
        sx={{ 
          bgcolor: '#2c6e49',
          '&:hover': {
            bgcolor: '#1e4f35',
          },
        }}
      >
        Generate Test PDF
      </Button>
    </Box>
  );
};

export default TestPdf;
