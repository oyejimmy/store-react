import React from 'react';
import { Form, Input, Button, Typography, Card, message, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { signup } from '../../store/slices/authSlice';
import styled from 'styled-components';

const { Title, Text } = Typography;

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const signupData = {
        email: values.email,
        username: values.email.split('@')[0], // Use email prefix as username
        full_name: `${values.first_name} ${values.last_name}`,
        phone: values.phone,
        password: values.password
      };
      await dispatch(signup(signupData)).unwrap();
      message.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#d4af37', marginBottom: '8px' }}>
            Join Saiyaara
          </Title>
          <Text type="secondary">Create your account to start shopping</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
              style={{ flex: 1 }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="First name"
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
              style={{ flex: 1 }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Last name"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Enter your phone number"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Create a password"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm your password"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <Link to="/terms" style={{ color: '#d4af37' }}>
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: '#d4af37' }}>
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: '48px' }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login" style={{ color: '#d4af37', fontWeight: 'bold' }}>
            Sign in here
          </Link>
        </div>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
