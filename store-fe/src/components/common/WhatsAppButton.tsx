import React from "react";
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';



const WhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+919876543210"; // Replace with actual WhatsApp number
    const message = "Hi! I need help with my order from Saiyaara.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Fab
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 65,
          height: 65,
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          border: '3px solid #ffffff',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.5)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          '&:hover': {
            background: 'linear-gradient(135deg, #128c7e, #25d366)',
            transform: 'scale(1.15) rotate(5deg)',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.7)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 28, color: 'white', zIndex: 1 }} />
      </Fab>
    </Tooltip>
  );
};

export default WhatsAppButton;