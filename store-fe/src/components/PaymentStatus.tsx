import React, { useState, useEffect } from 'react';
import { Spin, Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

interface PaymentStatusProps {
  transactionId: string;
  onComplete: (status: string) => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ transactionId, onComplete }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! You will receive a confirmation notification.');
          onComplete('success');
        } else if (data.status === 'failed') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
          onComplete('failed');
        } else {
          // Still pending, continue polling
          setTimeout(checkPaymentStatus, 3000);
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Error checking payment status.');
        onComplete('failed');
      }
    };

    checkPaymentStatus();
  }, [transactionId, onComplete]);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
        <h3 style={{ marginTop: '20px' }}>{message}</h3>
        <p>Please wait while we confirm your payment...</p>
      </div>
    );
  }

  return (
    <Result
      icon={status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      status={status === 'success' ? 'success' : 'error'}
      title={status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
      subTitle={message}
      extra={[
        <Button type="primary" key="home" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      ]}
    />
  );
};

export default PaymentStatus;