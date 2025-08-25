import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Card, message } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      // Here you would typically send the form data to your backend
      console.log('Contact form submitted:', values);
      message.success('Thank you for your message! We\'ll get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    }
  };

  return (
    <ContactContainer>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Contact Us
      </Title>
      
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <ContactCard>
            <Title level={3}>Send us a Message</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea rows={6} />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  icon={<SendOutlined />}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </ContactCard>
        </Col>
        
        <Col xs={24} lg={8}>
          <ContactCard>
            <Title level={3}>Get in Touch</Title>
            <Paragraph>
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </Paragraph>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <MailOutlined style={{ fontSize: '20px', color: '#d4af37', marginRight: '12px' }} />
                <div>
                  <Text strong>Email</Text>
                  <br />
                  <Text>support@saiyaara.com</Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <PhoneOutlined style={{ fontSize: '20px', color: '#d4af37', marginRight: '12px' }} />
                <div>
                  <Text strong>Phone</Text>
                  <br />
                  <Text>+91-XXXXXXXXXX</Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: '20px', color: '#d4af37', marginRight: '12px' }} />
                <div>
                  <Text strong>Address</Text>
                  <br />
                  <Text>
                    Saiyaara Jewelry Store<br />
                    123 Jewelry Street<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </Text>
                </div>
              </div>
            </div>
          </ContactCard>
          
          <ContactCard>
            <Title level={4}>Business Hours</Title>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Monday - Friday:</Text> 9:00 AM - 8:00 PM
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Saturday:</Text> 10:00 AM - 6:00 PM
            </div>
            <div>
              <Text strong>Sunday:</Text> 11:00 AM - 5:00 PM
            </div>
          </ContactCard>
        </Col>
      </Row>
    </ContactContainer>
  );
};

export default ContactPage;
