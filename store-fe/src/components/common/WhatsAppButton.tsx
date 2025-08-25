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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25d366;
  border: none;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #128c7e !important;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
  }

  .anticon {
    font-size: 24px;
    color: white;
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
