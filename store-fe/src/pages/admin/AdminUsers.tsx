import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Switch, Modal, message, Spin, Descriptions } from 'antd';
import { UserOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
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

const AdminUsers: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
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
      dataIndex: 'is_active',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'is_admin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? 'purple' : 'blue'}>
          {isAdmin ? 'ADMIN' : 'CUSTOMER'}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'created_at',
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
            checked={record.is_active}
            onChange={(checked) => handleToggleStatus(record.id, checked)}
            size="small"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
          <Switch
            checked={record.is_admin}
            onChange={() => handleToggleAdmin(record.id, record.is_admin)}
            size="small"
            checkedChildren="Admin"
            unCheckedChildren="User"
            style={{ backgroundColor: record.is_admin ? '#722ed1' : undefined }}
          />
        </Space>
      ),
    },
  ];

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleToggleStatus = async (userId: number, active: boolean) => {
    try {
      await adminAPI.updateUser(userId, { is_active: active });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: active } : user
      ));
      message.success(`User status updated to ${active ? 'active' : 'inactive'}`);
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleToggleAdmin = (userId: number, currentAdminStatus: boolean) => {
    const action = currentAdminStatus ? 'remove admin privileges from' : 'grant admin privileges to';
    const user = users.find(u => u.id === userId);
    
    Modal.confirm({
      title: 'Confirm Admin Status Change',
      content: `Are you sure you want to ${action} ${user?.full_name || user?.email}?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await adminAPI.updateUser(userId, { is_admin: !currentAdminStatus });
          setUsers(users.map(user => 
            user.id === userId ? { ...user, is_admin: !currentAdminStatus } : user
          ));
          message.success(`Admin status updated successfully`);
        } catch (error) {
          message.error('Failed to update admin status');
        }
      }
    });
  };

  return (
    <AdminContainer>
      <StyledCard 
        title="👥 User Management"
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchUsers}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </StyledCard>

      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedUser && (
          <div>
            <Card style={{ marginBottom: '16px', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ fontSize: '64px', color: '#d4af37', marginRight: '20px' }} />
                <div>
                  <h2 style={{ margin: 0, color: '#d4af37' }}>{selectedUser.full_name || 'N/A'}</h2>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '16px' }}>{selectedUser.email}</p>
                  <Space>
                    <Tag color={selectedUser.is_active ? 'green' : 'red'}>
                      {selectedUser.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                    <Tag color={selectedUser.is_admin ? 'purple' : 'blue'}>
                      {selectedUser.is_admin ? 'ADMIN' : 'CUSTOMER'}
                    </Tag>
                  </Space>
                </div>
              </div>
            </Card>
            
            <Card title="Complete User Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <strong style={{ color: '#d4af37' }}>User ID:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>{selectedUser.id}</p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Username:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>{selectedUser.username || 'N/A'}</p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Full Name:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>{selectedUser.full_name || 'N/A'}</p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Email Address:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>{selectedUser.email}</p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Phone Number:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Account Status:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    <Tag color={selectedUser.is_active ? 'green' : 'red'}>
                      {selectedUser.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>User Role:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    <Tag color={selectedUser.is_admin ? 'purple' : 'blue'}>
                      {selectedUser.is_admin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                    </Tag>
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Admin Privileges:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    {selectedUser.is_admin ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Account Created:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Registration Date:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Registration Time:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    {new Date(selectedUser.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#d4af37' }}>Account Age:</strong>
                  <p style={{ margin: '4px 0 16px 0' }}>
                    {Math.floor((new Date().getTime() - new Date(selectedUser.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
              
              {selectedUser.hashed_password && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong style={{ color: '#d4af37' }}>Security Information:</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>Password Hash: {selectedUser.hashed_password.substring(0, 20)}...</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminUsers;
