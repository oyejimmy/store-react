import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, InputNumber, Modal, Progress, Alert, message } from 'antd';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 24px;
`;

const AdminInventory: React.FC = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data
  const inventory = [
    {
      id: 1,
      name: 'Gold Ring',
      category: 'Rings',
      currentStock: 2,
      minStock: 10,
      maxStock: 50,
      status: 'low'
    },
    {
      id: 2,
      name: 'Silver Necklace',
      category: 'Necklaces',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      status: 'normal'
    },
    {
      id: 3,
      name: 'Diamond Earrings',
      category: 'Earrings',
      currentStock: 0,
      minStock: 5,
      maxStock: 30,
      status: 'out'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'orange';
      case 'out': return 'red';
      case 'normal': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'low': return 'LOW STOCK';
      case 'out': return 'OUT OF STOCK';
      case 'normal': return 'IN STOCK';
      default: return 'UNKNOWN';
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
    },
    {
      title: 'Min Stock',
      dataIndex: 'minStock',
      key: 'minStock',
    },
    {
      title: 'Stock Level',
      key: 'stockLevel',
      render: (_: any, record: any) => (
        <Progress 
          percent={Math.round((record.currentStock / record.maxStock) * 100)} 
          size="small"
          status={record.currentStock < record.minStock ? 'exception' : 'normal'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => handleEditStock(record)}
        >
          Update Stock
        </Button>
      ),
    },
  ];

  const handleEditStock = (item: any) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleUpdateStock = async (values: any) => {
    try {
      message.success(`Stock updated for ${editingItem.name}`);
      setIsModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      message.error('Failed to update stock');
    }
  };

  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'out');

  return (
    <AdminContainer>
      {lowStockItems.length > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${lowStockItems.length} products need restocking`}
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '16px' }}
        />
      )}

      <Card title="Inventory Management">
        <Table
          columns={columns}
          dataSource={inventory}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="Update Stock"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingItem && (
          <div>
            <p><strong>Product:</strong> {editingItem.name}</p>
            <p><strong>Current Stock:</strong> {editingItem.currentStock}</p>
            <p><strong>Min Stock Level:</strong> {editingItem.minStock}</p>
            <p><strong>Max Stock Level:</strong> {editingItem.maxStock}</p>
            
            <div style={{ marginTop: '16px' }}>
              <label>New Stock Level:</label>
              <InputNumber
                min={0}
                max={editingItem.maxStock}
                defaultValue={editingItem.currentStock}
                style={{ width: '100%', marginTop: '8px' }}
                onChange={(value) => {
                  if (value !== null) {
                    handleUpdateStock({ stock: value });
                  }
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminInventory;
