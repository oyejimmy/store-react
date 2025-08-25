import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Switch, Modal, message } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 24px;
`;

const AdminUsers: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91-1234567890',
      status: 'active',
      isAdmin: false,
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91-9876543210',
      status: 'active',
      isAdmin: true,
      joinDate: '2024-01-05'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91-5555555555',
      status: 'inactive',
      isAdmin: false,
      joinDate: '2024-01-10'
    }
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? 'purple' : 'blue'}>
          {isAdmin ? 'ADMIN' : 'CUSTOMER'}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
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
            onClick={() => handleViewUser(record)}
          >
            View
          </Button>
          <Switch
            checked={record.status === 'active'}
            onChange={(checked) => handleToggleStatus(record.id, checked)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleToggleStatus = (userId: number, active: boolean) => {
    const status = active ? 'active' : 'inactive';
    message.success(`User status updated to ${status}`);
  };

  return (
    <AdminContainer>
      <Card title="User Management">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#d4af37', marginRight: '16px' }} />
              <div>
                <h3>{selectedUser.name}</h3>
                <p style={{ color: '#666' }}>{selectedUser.email}</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Phone:</strong>
                <p>{selectedUser.phone}</p>
              </div>
              <div>
                <strong>Status:</strong>
                <p>
                  <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                    {selectedUser.status.toUpperCase()}
                  </Tag>
                </p>
              </div>
              <div>
                <strong>Role:</strong>
                <p>
                  <Tag color={selectedUser.isAdmin ? 'purple' : 'blue'}>
                    {selectedUser.isAdmin ? 'ADMIN' : 'CUSTOMER'}
                  </Tag>
                </p>
              </div>
              <div>
                <strong>Join Date:</strong>
                <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminUsers;
