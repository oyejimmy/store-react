import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  InstagramOutlined,
  FacebookOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const StyledFooter = styled(AntFooter)`
  padding: 48px 10% 24px;
  margin-top: auto;
  transition: all 0.3s ease;
  
  .light-theme & {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    color: #333;
    border-top: 2px solid #e8e8e8;
  }
  
  .dark-theme & {
    background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
    color: #ffffff;
    border-top: 2px solid #333;
  }
  
  @media (max-width: 768px) {
    padding: 48px 5% 24px;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 24px;
`;

const FooterTitle = styled(Title)`
  font-size: 20px !important;
  margin-bottom: 16px !important;
  font-weight: 600 !important;
  
  .light-theme & {
    color: #d4af37 !important;
  }
  
  .dark-theme & {
    color: #d4af37 !important;
  }
`;

const FooterLink = styled(Link)`
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  .light-theme & {
    color: #666;
  }
  
  .dark-theme & {
    color: #ccc;
  }

  &:hover {
    color: #d4af37;
    transform: translateX(5px);
  }
`;

const SocialLink = styled.a`
  font-size: 24px;
  margin-right: 16px;
  transition: all 0.3s ease;
  
  .light-theme & {
    color: #666;
  }
  
  .dark-theme & {
    color: #ccc;
  }

  &:hover {
    color: #d4af37;
    transform: translateY(-3px) scale(1.2);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  .light-theme & {
    color: #666;
  }
  
  .dark-theme & {
    color: #ccc;
  }

  .anticon {
    margin-right: 12px;
    color: #d4af37;
    font-size: 16px;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 24px;
  
  .light-theme & {
    border-top: 1px solid #e8e8e8;
    color: #666;
  }
  
  .dark-theme & {
    border-top: 1px solid #333;
    color: #999;
  }
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <FooterSection>
            <FooterTitle level={4}>Saiyaara</FooterTitle>
            <Text className="footer-description">
              Elegant jewelry for every occasion. Discover our beautiful
              collection of anklets, bangles, bracelets, earrings, rings and
              more.
            </Text>
          </FooterSection>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <FooterSection>
            <FooterTitle level={4}>Quick Links</FooterTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/shop">Shop</FooterLink>
            <FooterLink to="/offers/under-299">Special Offers</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
          </FooterSection>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <FooterSection>
            <FooterTitle level={4}>Categories</FooterTitle>
            <FooterLink to="/shop/anklets">Anklets</FooterLink>
            <FooterLink to="/shop/bangles">Bangles</FooterLink>
            <FooterLink to="/shop/bracelets">Bracelets</FooterLink>
            <FooterLink to="/shop/earrings">Earrings</FooterLink>
            <FooterLink to="/shop/rings">Rings</FooterLink>
            <FooterLink to="/shop/pendants">Pendants</FooterLink>
          </FooterSection>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <FooterSection>
            <FooterTitle level={4}>Contact Info</FooterTitle>
            <ContactInfo>
              <PhoneOutlined />
              <Text className="contact-text">+91-XXXXXXXXXX</Text>
            </ContactInfo>
            <ContactInfo>
              <MailOutlined />
              <Text className="contact-text">support@saiyaara.com</Text>
            </ContactInfo>
            <ContactInfo>
              <EnvironmentOutlined />
              <Text className="contact-text">
                Saiyaara Store
                <br />
                Jewelry District
                <br />
                City, State - PIN
              </Text>
            </ContactInfo>

            <Space style={{ marginTop: 16 }}>
              <SocialLink href="https://instagram.com/saiyaara" target="_blank">
                <InstagramOutlined />
              </SocialLink>
              <SocialLink href="https://facebook.com/saiyaara" target="_blank">
                <FacebookOutlined />
              </SocialLink>
            </Space>
          </FooterSection>
        </Col>
      </Row>

      <Copyright>
        <Text>
          © {new Date().getFullYear()} Saiyaara. All rights reserved. |
          <FooterLink
            to="/privacy"
            style={{ display: "inline", margin: "0 8px" }}
          >
            Privacy Policy
          </FooterLink>
          |
          <FooterLink
            to="/terms"
            style={{ display: "inline", margin: "0 8px" }}
          >
            Terms of Service
          </FooterLink>
        </Text>
      </Copyright>
    </StyledFooter>
  );
};

export default Footer;
