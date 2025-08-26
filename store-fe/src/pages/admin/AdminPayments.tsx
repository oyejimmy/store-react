import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, message, Spin, Form, Select, Input, Row, Col, Descriptions, Popconfirm } from 'antd';
import { EyeOutlined, StarOutlined, CopyOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { adminAPI } from '../../services/api';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  
  .ant-card-head {
    background: linear-gradient(135deg, #d4af37, #b8860b);
    border-radius: 12px 12px 0 0;
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
    }
  }
`;

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const orders = await adminAPI.getAllOrders();
      // Transform orders to payment records
      const paymentData = orders.map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        date: order.created_at,
        status: getPaymentStatus(order.payment_status, order.status),
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status
      }));
      setPayments(paymentData);
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (paymentStatus: string, orderStatus: string) => {
    if (paymentStatus === 'paid' && orderStatus === 'delivered') return 'Completed';
    if (paymentStatus === 'paid') return 'Received';
    return 'Submitted';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Received': return 'blue';
      case 'Submitted': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Order#',
      dataIndex: 'order_number',
      key: 'orderNumber',
      width: 100,
      render: (orderNumber: string) => (
        <span style={{ fontWeight: 'bold', color: '#333' }}>{orderNumber}</span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Total amount',
      dataIndex: 'total_amount',
      key: 'total',
      width: 120,
      render: (total: number) => (
        <span style={{ fontWeight: 'bold' }}>PKR {total || 0}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />}
            style={{ color: '#1890ff' }}
            onClick={() => handleViewPayment(record)}
            title="View Details"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            style={{ color: '#faad14' }}
            onClick={() => handleEditPayment(record)}
            title="Edit Status"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<CopyOutlined />}
            style={{ color: '#52c41a' }}
            onClick={() => handleCopyPayment(record)}
            title="Copy Info"
          />
          <Popconfirm
            title="Delete Payment"
            description="Are you sure you want to delete this payment record?"
            onConfirm={() => handleDeletePayment(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined />}
              style={{ color: '#ff4d4f' }}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setViewModalVisible(true);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    form.setFieldsValue({
      status: payment.status,
      payment_status: payment.payment_status,
      payment_method: payment.payment_method
    });
    setEditModalVisible(true);
  };

  const handleCopyPayment = (payment: any) => {
    const paymentInfo = `Order: ${payment.order_number}\nCustomer: ${payment.customer_name}\nAmount: PKR ${payment.total_amount}\nStatus: ${payment.status}`;
    navigator.clipboard.writeText(paymentInfo);
    message.success('Payment information copied to clipboard');
  };

  const handleDeletePayment = async (paymentId: number) => {
    try {
      setLoading(true);
      // In a real app, you'd call an API to delete the payment
      setPayments(payments.filter(p => p.id !== paymentId));
      message.success('Payment record deleted successfully');
    } catch (error) {
      message.error('Failed to delete payment record');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (values: any) => {
    try {
      setLoading(true);
      // Update payment in the list
      const updatedPayments = payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, ...values }
          : p
      );
      setPayments(updatedPayments);
      message.success('Payment updated successfully');
      setEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <StyledCard 
        title="Payments" 
        extra={
          <Button 
            type="primary" 
            style={{ background: '#d4af37', borderColor: '#d4af37' }}
            onClick={() => message.info('New payment feature coming soon')}
          >
            New Payment
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
          }}
          scroll={{ x: 800 }}
        />
      </StyledCard>

      {/* View Payment Modal */}
      <Modal
        title={<span><EyeOutlined /> Payment & Order Details</span>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedPayment && (
          <div>
            <Card title="Order Information" size="small" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Order ID">
                  #{selectedPayment.id}
                </Descriptions.Item>
                <Descriptions.Item label="Order Number">
                  {selectedPayment.order_number}
                </Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  {new Date(selectedPayment.date).toLocaleDateString('en-GB')}
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Tag color={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Customer Name">
                  {selectedPayment.customer_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedPayment.customer_email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedPayment.customer_phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="User Type">
                  <Tag color={selectedPayment.user_id ? 'blue' : 'orange'}>
                    {selectedPayment.user_id ? 'Registered User' : 'Guest Order'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Payment Information" size="small" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Payment Method">
                  <Tag color="blue">{selectedPayment.payment_method || 'COD'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag color={selectedPayment.payment_status === 'paid' ? 'green' : 'orange'}>
                    {selectedPayment.payment_status || 'Pending'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Transaction ID">
                  {selectedPayment.transaction_id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Gateway">
                  {selectedPayment.payment_gateway || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Currency">
                  {selectedPayment.currency || 'PKR'}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Date">
                  {selectedPayment.payment_date ? new Date(selectedPayment.payment_date).toLocaleDateString('en-GB') : 'Pending'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Order Summary" size="small">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                      PKR {selectedPayment.total_amount || 0}
                    </div>
                    <div style={{ color: '#666' }}>Total Amount</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {selectedPayment.items_count || 'N/A'}
                    </div>
                    <div style={{ color: '#666' }}>Items Count</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {selectedPayment.delivery_charges || 0}
                    </div>
                    <div style={{ color: '#666' }}>Delivery Charges</div>
                  </div>
                </Col>
              </Row>
              
              {selectedPayment.shipping_address && (
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Shipping Address">
                    {selectedPayment.shipping_address}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </div>
        )}
      </Modal>

      {/* Edit Payment Modal */}
      <Modal
        title="Edit Payment"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
        okButtonProps={{ style: { background: '#d4af37', borderColor: '#d4af37' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePayment}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Payment Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Select.Option value="Submitted">Submitted</Select.Option>
                  <Select.Option value="Received">Received</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="payment_method"
                label="Payment Method"
              >
                <Select>
                  <Select.Option value="Cash">Cash</Select.Option>
                  <Select.Option value="Card">Card</Select.Option>
                  <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                  <Select.Option value="Online">Online</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminContainer>
  );
};

export default AdminPayments;