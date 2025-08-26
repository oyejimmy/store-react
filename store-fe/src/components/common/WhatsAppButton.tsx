import React from "react";
import { Button, Tooltip } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import styled from "styled-components";

const WhatsAppButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const StyledWhatsAppButton = styled(Button)`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #25d366, #128c7e);
  border: 3px solid #ffffff;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
    border-radius: 50%;
  }

  &:hover {
    background: linear-gradient(135deg, #128c7e, #25d366) !important;
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.7);
    border-color: #25d366;
  }

  .anticon {
    font-size: 28px;
    color: white;
    z-index: 1;
    position: relative;
  }
`;

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
    <WhatsAppButtonContainer>
      <Tooltip title="Chat with us on WhatsApp" placement="left">
        <StyledWhatsAppButton
          type="primary"
          icon={<WhatsAppOutlined />}
          onClick={handleWhatsAppClick}
        />
      </Tooltip>
    </WhatsAppButtonContainer>
  );
};

export default WhatsAppButton;
