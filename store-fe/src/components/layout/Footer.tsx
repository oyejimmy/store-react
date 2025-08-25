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
  background: #1a1a1a;
  color: white;
  padding: 48px 24px 24px;
  margin-top: auto;
`;

const FooterSection = styled.div`
  margin-bottom: 24px;
`;

const FooterTitle = styled(Title)`
  color: #d4af37 !important;
  font-size: 18px !important;
  margin-bottom: 16px !important;
`;

const FooterLink = styled(Link)`
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;

  &:hover {
    color: #d4af37;
  }
`;

const SocialLink = styled.a`
  color: #ccc;
  font-size: 20px;
  margin-right: 16px;

  &:hover {
    color: #d4af37;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #ccc;

  .anticon {
    margin-right: 8px;
    color: #d4af37;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #333;
  color: #999;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <FooterSection>
            <FooterTitle level={4}>Saiyaara</FooterTitle>
            <Text style={{ color: "#ccc" }}>
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
              <Text style={{ color: "#ccc" }}>+91-XXXXXXXXXX</Text>
            </ContactInfo>
            <ContactInfo>
              <MailOutlined />
              <Text style={{ color: "#ccc" }}>support@saiyaara.com</Text>
            </ContactInfo>
            <ContactInfo>
              <EnvironmentOutlined />
              <Text style={{ color: "#ccc" }}>
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
