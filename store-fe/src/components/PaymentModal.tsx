import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message, Radio, Space } from 'antd';
import { MobileOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const PaymentContainer = styled.div`
  .payment-method {
    padding: 16px;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #d4af37;
    }
    
    &.selected {
      border-color: #d4af37;
      background: #fefbf0;
    }
  }
  
  .method-icon {
    font-size: 24px;
    color: #d4af37;
    margin-right: 12px;
  }
  
  .method-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
  }
  
  .method-desc {
    color: #666;
    font-size: 14px;
  }
`;

interface PaymentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (transactionId: string) => void;
  orderData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  orderData
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('jazzcash');

  const paymentMethods = [
    {
      key: 'jazzcash',
      title: 'JazzCash',
      description: 'Pay using JazzCash mobile wallet',
      icon: <MobileOutlined className="method-icon" />
    },
    {
      key: 'easypaisa',
      title: 'EasyPaisa',
      description: 'Pay using EasyPaisa mobile wallet',
      icon: <BankOutlined className="method-icon" />
    },
    {
      key: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <CreditCardOutlined className="method-icon" />
    }
  ];

  const handlePayment = async (values: any) => {
    try {
      setLoading(true);

      if (selectedMethod === 'cod') {
        // For COD, just return success
        message.success('Order placed successfully! You will pay on delivery.');
        onSuccess('COD-' + Date.now());
        return;
      }

      // For mobile wallets, call the payment API
      const endpoint = selectedMethod === 'jazzcash' ? '/api/payments/jazzcash' : '/api/payments/easypaisa';
      
      const paymentData = {
        amount: orderData.amount,
        mobile_number: values.mobile_number,
        cnic: values.cnic,
        order_id: orderData.orderId,
        gateway: selectedMethod
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        message.success(result.message);
        onSuccess(result.transaction_id);
      } else {
        message.error(result.message || 'Payment failed');
      }

    } catch (error) {
      message.error('Payment processing failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateMobileNumber = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter mobile number');
    }
    if (!value.startsWith('03') || value.length !== 11) {
      return Promise.reject('Please enter valid mobile number (03xxxxxxxxx)');
    }
    return Promise.resolve();
  };

  const validateCNIC = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter CNIC last 4 digits');
    }
    if (value.length !== 4 || !/^\d+$/.test(value)) {
      return Promise.reject('Please enter valid 4 digits');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="Complete Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <PaymentContainer>
        <div style={{ marginBottom: 24 }}>
          <h3>Order Summary</h3>
          <p><strong>Order ID:</strong> {orderData.orderId}</p>
          <p><strong>Amount:</strong> PKR {orderData.amount}</p>
          <p><strong>Customer:</strong> {orderData.customerName}</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePayment}
        >
          <Form.Item label="Select Payment Method">
            <Radio.Group
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {paymentMethods.map((method) => (
                  <Radio key={method.key} value={method.key} style={{ width: '100%' }}>
                    <div className={`payment-method ${selectedMethod === method.key ? 'selected' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {method.icon}
                        <div>
                          <div className="method-title">{method.title}</div>
                          <div className="method-desc">{method.description}</div>
                        </div>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>

          {(selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') && (
            <>
              <Form.Item
                name="mobile_number"
                label="Mobile Number"
                rules={[{ validator: validateMobileNumber }]}
              >
                <Input
                  placeholder="03xxxxxxxxx"
                  prefix={<MobileOutlined />}
                  maxLength={11}
                />
              </Form.Item>

              <Form.Item
                name="cnic"
                label="CNIC Last 4 Digits"
                rules={[{ validator: validateCNIC }]}
              >
                <Input
                  placeholder="1234"
                  maxLength={4}
                  type="number"
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Space>
              <Button onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ background: '#d4af37', borderColor: '#d4af37' }}
              >
                {selectedMethod === 'cod' ? 'Place Order' : 'Pay Now'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </PaymentContainer>
    </Modal>
  );
};

export default PaymentModal;