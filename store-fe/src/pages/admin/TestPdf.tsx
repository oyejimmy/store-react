import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { htmlToPdf } from '../../utils/pdfGenerator';

const TestPdf: React.FC = () => {
  const generatePdfFromString = async () => {
    const htmlContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Test PDF Generation</h1>
        <p>This is a test PDF generated from an HTML string.</p>
        <p>Current date: ${new Date().toLocaleDateString()}</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    `;
    
    try {
      await htmlToPdf(htmlContent, 'test-from-string.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generatePdfFromElement = async () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      try {
        await htmlToPdf(element, 'test-from-element.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        PDF Generation Test
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={generatePdfFromString}
        >
          Generate PDF from String
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={generatePdfFromElement}
        >
          Generate PDF from Element
        </Button>
      </Box>

      <Paper 
        id="pdf-content" 
        elevation={3} 
        sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}
      >
        <Typography variant="h5" gutterBottom>
          Test Content for PDF
        </Typography>
        <Typography paragraph>
          This is a test content section that will be converted to PDF.
          The PDF should preserve the styling and layout of this element.
        </Typography>
        <Typography paragraph>
          Current time: {new Date().toLocaleString()}
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>List item 1</li>
          <li>List item 2 with some longer content to test text wrapping</li>
          <li>List item 3</li>
        </Box>
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="textSecondary">
            This is a styled box within the content
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TestPdf;
