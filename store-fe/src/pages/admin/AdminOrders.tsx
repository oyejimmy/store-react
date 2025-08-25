import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Modal, Descriptions, message } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const AdminContainer = styled.div`
  padding: 24px;
`;

const AdminOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+91-1234567890',
      total: 2500,
      status: 'pending',
      date: '2024-01-15',
      items: [
        { name: 'Gold Ring', quantity: 1, price: 2500 }
      ]
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91-9876543210',
      total: 1800,
      status: 'processing',
      date: '2024-01-14',
      items: [
        { name: 'Silver Necklace', quantity: 1, price: 1800 }
      ]
    }
  ];

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
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `₹${total}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleUpdateStatus(record)}
          >
            Update Status
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
      <Card title="Order Management">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Order Number" span={2}>
              {selectedOrder.orderNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {selectedOrder.customer}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedOrder.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedOrder.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Total">
              ₹{selectedOrder.total}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
              <Tag color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Order Date" span={2}>
              {new Date(selectedOrder.date).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Items" span={2}>
              {selectedOrder.items.map((item: any, index: number) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  {item.name} - Qty: {item.quantity} - ₹{item.price}
                </div>
              ))}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminOrders;
