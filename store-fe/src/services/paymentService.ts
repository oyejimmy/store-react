import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface PaymentRequest {
  amount: number;
  mobile_number: string;
  cnic: string;
  order_id: string;
  gateway: 'jazzcash' | 'easypaisa';
}

export interface PaymentResponse {
  success: boolean;
  transaction_id: string;
  message: string;
  payment_url?: string;
}

export interface PaymentStatus {
  transaction_id: string;
  status: 'pending' | 'success' | 'failed' | 'not_found' | 'error';
  message: string;
  order_number?: string;
  amount?: number;
}

class PaymentService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/payments`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // JazzCash Payment
  async processJazzCashPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.api.post('/jazzcash', paymentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'JazzCash payment failed');
    }
  }

  // EasyPaisa Payment
  async processEasyPaisaPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.api.post('/easypaisa', paymentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'EasyPaisa payment failed');
    }
  }

  // Check Payment Status
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await this.api.get(`/status/${transactionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get payment status');
    }
  }

  // Process payment based on gateway
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    if (paymentData.gateway === 'jazzcash') {
      return this.processJazzCashPayment(paymentData);
    } else if (paymentData.gateway === 'easypaisa') {
      return this.processEasyPaisaPayment(paymentData);
    } else {
      throw new Error('Invalid payment gateway');
    }
  }

  // Poll payment status until completion
  async pollPaymentStatus(
    transactionId: string,
    onStatusUpdate?: (status: PaymentStatus) => void,
    maxAttempts: number = 20,
    interval: number = 3000
  ): Promise<PaymentStatus> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const poll = async () => {
        try {
          attempts++;
          const status = await this.getPaymentStatus(transactionId);
          
          if (onStatusUpdate) {
            onStatusUpdate(status);
          }
          
          if (status.status === 'success' || status.status === 'failed') {
            resolve(status);
            return;
          }
          
          if (attempts >= maxAttempts) {
            resolve({
              transaction_id: transactionId,
              status: 'failed',
              message: 'Payment timeout - please check manually'
            });
            return;
          }
          
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }
}

export const paymentService = new PaymentService();
export default paymentService;