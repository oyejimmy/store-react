import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Select, Modal, Descriptions, message, Spin, Image } from 'antd';
import { EyeOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { adminAPI } from '../../services/api';
import styled from 'styled-components';

const { Option } = Select;

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

const AdminOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
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
      title: 'Total amount',
      dataIndex: 'total_amount',
      key: 'total',
      width: 120,
      render: (total: number) => (
        <span style={{ fontWeight: 'bold' }}>PKR {total || 0}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Delivery Deadline',
      key: 'deliveryDeadline',
      width: 120,
      render: (_: any, record: any) => {
        const deliveryDate = new Date(record.created_at);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        return deliveryDate.toLocaleDateString('en-GB');
      },
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'paymentStatus',
      width: 80,
      render: (paymentStatus: string) => (
        <Tag color={paymentStatus === 'paid' ? 'green' : 'red'}>
          {paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}
        </Tag>
      ),
    },
    {
      title: 'Product Availability',
      dataIndex: 'status',
      key: 'productStatus',
      width: 120,
      render: (status: string) => {
        const statusMap = {
          'pending': 'Expected',
          'processing': 'Picked',
          'shipped': 'Picked',
          'delivered': 'Picked'
        };
        return statusMap[status as keyof typeof statusMap] || 'Expected';
      },
    },
    {
      title: 'Delivery',
      dataIndex: 'status',
      key: 'deliveryStatus',
      width: 100,
      render: (status: string) => {
        const deliveryMap = {
          'pending': <span style={{ color: '#ff4d4f' }}>Not Shipped</span>,
          'processing': <span style={{ color: '#faad14' }}>Packed</span>,
          'shipped': <span style={{ color: '#52c41a' }}>Packed</span>,
          'delivered': <span style={{ color: '#52c41a' }}>Packed</span>
        };
        return deliveryMap[status as keyof typeof deliveryMap] || 'Packed';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
            style={{ background: '#d4af37', borderColor: '#d4af37' }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleUpdateStatus = (order: any) => {
    Modal.confirm({
      title: 'Update Order Status',
      content: (
        <Select 
          defaultValue={order.status} 
          style={{ width: '100%', marginTop: '8px' }}
          onChange={(value) => {
            message.success(`Order status updated to ${value}`);
          }}
        >
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
      onOk() {
        // Handle status update
      },
    });
  };

  return (
    <AdminContainer>
      <StyledCard 
        title="Orders" 
        extra={
          <Button 
            type="primary" 
            style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
          >
            New Order
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={{
            pageSize: 15,
            showSizeChanger: false,
            showQuickJumper: false,
            simple: true,
          }}
          scroll={{ x: 1000 }}
        />
      </StyledCard>

      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={1000}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Order Number" span={2}>
                <strong>{selectedOrder.order_number}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedOrder.customer_name}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {selectedOrder.customer_email}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Phone">
                {selectedOrder.customer_phone}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {selectedOrder.user_id || 'Guest Order'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <strong>PKR {selectedOrder.total_amount}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Order Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrder.payment_status === 'paid' ? 'green' : 'orange'}>
                  {selectedOrder.payment_status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>
                {selectedOrder.shipping_address}
              </Descriptions.Item>
            </Descriptions>
            
            <Card title="Order Items" style={{ marginTop: '16px' }}>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item: any, index: number) => (
                  <Card key={index} type="inner" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {item.product && item.product.images && item.product.images[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <Descriptions size="small" column={2}>
                          <Descriptions.Item label="Product ID">
                            {item.product_id}
                          </Descriptions.Item>
                          <Descriptions.Item label="Product Name">
                            <strong>{item.product ? item.product.name : 'Product not found'}</strong>
                          </Descriptions.Item>
                          <Descriptions.Item label="Quantity">
                            {item.quantity}
                          </Descriptions.Item>
                          <Descriptions.Item label="Unit Price">
                            PKR {item.price}
                          </Descriptions.Item>
                          <Descriptions.Item label="Total Price">
                            <strong>PKR {item.price * item.quantity}</strong>
                          </Descriptions.Item>
                          {item.product && (
                            <>
                              <Descriptions.Item label="Category">
                                {item.product.category || item.product.subcategory || 'N/A'}
                              </Descriptions.Item>
                              <Descriptions.Item label="Stock Available">
                                {item.product.stock_quantity || item.product.stock || 0}
                              </Descriptions.Item>
                              <Descriptions.Item label="Product Status">
                                {item.product.status}
                              </Descriptions.Item>
                              {item.product.description && (
                                <Descriptions.Item label="Description" span={2}>
                                  {item.product.description}
                                </Descriptions.Item>
                              )}
                            </>
                          )}
                        </Descriptions>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No items found for this order</p>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminOrders;
