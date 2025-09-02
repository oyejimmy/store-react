/**
 * PDF Generation Utilities
 */

// Import types
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type HtmlSource = string | HTMLElement;

// Import jsPDF dynamically to avoid SSR issues
const loadJsPDF = async () => {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
};

/**
 * Generates a simple PDF document
 */
export const generateSimplePdf = async (
  content: string,
  filename: string = 'document.pdf'
): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  try {
    const JsPDF = await loadJsPDF();
    const doc = new JsPDF();
    doc.text(content, 10, 10);
    doc.save(filename);
  } catch (error) {
    throw error;
  }
};

/**
 * Converts HTML content to PDF
 */
/**
 * Converts HTML content to a PDF file
 * @param html - HTML string or HTMLElement to convert to PDF
 * @param filename - Name of the output PDF file
 */
export const htmlToPdf = async (
  html: HtmlSource,
  filename: string = 'document.pdf'
): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  try {
    const JsPDF = await loadJsPDF();
    const doc = new JsPDF();
    
    // Create a temporary container to hold the HTML
    // Create a temporary container if HTML is a string
    const element = typeof html === 'string' 
      ? document.createElement('div')
      : html;
    
    // If we created a temporary element, add it to the DOM
    let tempElement: HTMLElement | null = null;
    if (typeof html === 'string') {
      element.style.visibility = 'hidden';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.innerHTML = html;
      document.body.appendChild(element);
      tempElement = element;
    }
    
    // Use html2canvas to capture the element
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF'
    });
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidth = 190; // A4 width - margins
    const pageHeight = 295; // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // Start position
    
    // Add first page
    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    doc.save(filename);
    
    // Clean up the temporary element if we created one
    if (tempElement && tempElement.parentNode === document.body) {
      document.body.removeChild(tempElement);
    }
  } catch (error) {
    throw error;
  }
};

// Export default object
const pdfGenerator = {
  generateSimplePdf,
  htmlToPdf,
};

export default pdfGenerator;
