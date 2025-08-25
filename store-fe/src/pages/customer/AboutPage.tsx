import React from 'react';
import { Typography, Row, Col, Card, Divider } from 'antd';
import { HeartOutlined, StarOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

const AboutContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  text-align: center;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  height: 100%;
  border-radius: 8px;
`;

const AboutPage: React.FC = () => {
  return (
    <AboutContainer>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>About Saiyaara</Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          Crafting elegance, one piece at a time
        </Paragraph>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <AboutCard>
            <Title level={3}>Our Story</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Founded with a passion for creating beautiful jewelry that tells a story, 
              Saiyaara has been at the forefront of jewelry craftsmanship for over a decade. 
              Our journey began with a simple dream: to make elegant, high-quality jewelry 
              accessible to everyone.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Today, we continue to blend traditional craftsmanship with modern design, 
              creating pieces that are not just accessories, but expressions of individuality 
              and style. Every piece in our collection is carefully crafted to ensure the 
              highest quality and timeless beauty.
            </Paragraph>
          </AboutCard>
        </Col>
        
        <Col xs={24} lg={12}>
          <AboutCard>
            <Title level={3}>Our Mission</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              At Saiyaara, our mission is to provide our customers with exceptional jewelry 
              that combines contemporary design with traditional craftsmanship. We believe 
              that every piece of jewelry should tell a story and create lasting memories.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              We are committed to:
            </Paragraph>
            <ul style={{ fontSize: '16px', lineHeight: '1.8', textAlign: 'left' }}>
              <li>Offering the highest quality materials and craftsmanship</li>
              <li>Providing exceptional customer service</li>
              <li>Creating timeless designs that never go out of style</li>
              <li>Making luxury jewelry accessible to everyone</li>
            </ul>
          </AboutCard>
        </Col>
      </Row>

      <Divider />

      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Why Choose Saiyaara?
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard>
            <HeartOutlined style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
            <Title level={4}>Quality Craftsmanship</Title>
            <Text>
              Every piece is crafted with attention to detail and the finest materials
            </Text>
          </FeatureCard>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard>
            <StarOutlined style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
            <Title level={4}>Timeless Design</Title>
            <Text>
              Our designs are created to be beautiful and relevant for years to come
            </Text>
          </FeatureCard>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard>
            <SafetyOutlined style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
            <Title level={4}>Trusted Quality</Title>
            <Text>
              We use only the highest quality materials and maintain strict quality standards
            </Text>
          </FeatureCard>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard>
            <TeamOutlined style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
            <Title level={4}>Expert Team</Title>
            <Text>
              Our team of skilled artisans and designers bring years of experience
            </Text>
          </FeatureCard>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <AboutCard>
            <Title level={3}>Our Values</Title>
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '16px' }}>Quality:</Text>
                <br />
                <Text>We never compromise on quality, ensuring every piece meets our high standards.</Text>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '16px' }}>Integrity:</Text>
                <br />
                <Text>We conduct our business with honesty, transparency, and respect for our customers.</Text>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '16px' }}>Innovation:</Text>
                <br />
                <Text>We continuously innovate in design and craftsmanship to bring you the best.</Text>
              </div>
              <div>
                <Text strong style={{ fontSize: '16px' }}>Customer Focus:</Text>
                <br />
                <Text>Your satisfaction is our priority, and we strive to exceed your expectations.</Text>
              </div>
            </div>
          </AboutCard>
        </Col>
        
        <Col xs={24} lg={12}>
          <AboutCard>
            <Title level={3}>Our Commitment</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              We are committed to providing you with an exceptional shopping experience 
              from the moment you visit our website to the day your jewelry arrives at 
              your doorstep.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Our commitment extends beyond just selling jewelry - we want to be part 
              of your special moments, helping you celebrate life's beautiful occasions 
              with pieces that reflect your unique style and personality.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Thank you for choosing Saiyaara. We look forward to being part of your 
              jewelry journey.
            </Paragraph>
          </AboutCard>
        </Col>
      </Row>
    </AboutContainer>
  );
};

export default AboutPage;
