import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, InputNumber, Modal, Progress, Alert, message, Form, Input, Select, Row, Col, Statistic, Space, Tabs } from 'antd';
import { EditOutlined, ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, ShoppingOutlined, DollarOutlined, WarningOutlined, CheckCircleOutlined, StarOutlined, CopyOutlined, DeleteOutlined, AppstoreOutlined, BarcodeOutlined, GoldOutlined, ShopOutlined, GroupOutlined, QrcodeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { adminAPI } from '../../services/api';

const AdminContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const StatsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
`;

const AdminInventory: React.FC = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getInventoryStatus();
      const processedData = data.map((item: any) => ({
        ...item,
        currentStock: item.stock_quantity || item.stock || 0,
        total_qty: item.total_qty || item.stock_quantity || item.stock || 0,
        buy_price: item.buy_price || item.retail_price || 0,
        sell_price: item.sell_price || item.offer_price || item.price || 0,
        location: item.location || 'Store',
        price: item.offer_price || item.price || item.retail_price || 0,
        category: typeof item.category === 'object' ? item.category?.name : (item.category || item.subcategory || 'General'),
        minStock: 5, // Default min stock
        maxStock: 100, // Default max stock
        status: getStockStatus(item.stock_quantity || item.stock || 0, 5)
      }));
      setInventory(processedData);
      setFilteredInventory(processedData);
    } catch (error) {
      message.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };
  
  const [form] = Form.useForm();

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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => (
        <span style={{ fontWeight: 'bold', color: '#333' }}>{id.toString().padStart(6, '0')}</span>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Total QTY',
      key: 'totalQty',
      width: 100,
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 'bold' }}>{record.total_qty || record.currentStock || 0}</span>
      ),
    },
    {
      title: 'Buy Price',
      key: 'buyPrice',
      width: 100,
      render: (_: any, record: any) => (
        <span>PKR {record.buy_price || record.retail_price || 0}</span>
      ),
    },
    {
      title: 'Sell Price',
      key: 'sellPrice',
      width: 100,
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 'bold' }}>PKR {record.sell_price || record.offer_price || record.price || 0}</span>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      width: 100,
      render: (_: any, record: any) => (
        <span>{record.location || 'Store'}</span>
      ),
    },
    {
      title: 'Action',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<StarOutlined />}
            style={{ color: '#faad14' }}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<CopyOutlined />}
            style={{ color: '#1890ff' }}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />}
            style={{ color: '#ff4d4f' }}
          />
        </Space>
      ),
    },
  ];

  const handleEditStock = (item: any) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleUpdateStock = async (values: any) => {
    try {
      await adminAPI.updateStock(editingItem.id, values.stock);
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, currentStock: values.stock, status: getStockStatus(values.stock, item.minStock) }
          : item
      );
      setInventory(updatedInventory);
      message.success(`Stock updated for ${editingItem.name}`);
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update stock');
    }
  };
  
  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return 'out';
    if (currentStock < minStock) return 'low';
    return 'normal';
  };

  const applyFilters = (search: string, category: string, status: string) => {
    let filtered = inventory;
    
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    setFilteredInventory(filtered);
  };

  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'out');
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const outOfStockCount = inventory.filter(item => item.status === 'out').length;
  const lowStockCount = inventory.filter(item => item.status === 'low').length;

  return (
    <AdminContainer>
      <Card 
        title="Inventory" 
        style={{ marginBottom: '24px', border: 'none', boxShadow: 'none' }}
      >
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={6}>
            <Card 
              style={{ textAlign: 'center', borderRadius: '12px', border: '1px solid #e8e8e8' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#d4af37' }}>
                <GoldOutlined />
              </div>
              <Button 
                type="primary" 
                style={{ background: '#1890ff', borderColor: '#1890ff', width: '100%' }}
              >
                New Item
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card 
              style={{ textAlign: 'center', borderRadius: '12px', border: '1px solid #e8e8e8' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#d4af37' }}>
                <GroupOutlined />
              </div>
              <Button 
                type="primary" 
                style={{ background: '#1890ff', borderColor: '#1890ff', width: '100%' }}
              >
                New Item Groups
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card 
              style={{ textAlign: 'center', borderRadius: '12px', border: '1px solid #e8e8e8' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#d4af37' }}>
                <ShopOutlined />
              </div>
              <Button 
                type="primary" 
                style={{ background: '#1890ff', borderColor: '#1890ff', width: '100%' }}
              >
                New Composite Items
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card 
              style={{ textAlign: 'center', borderRadius: '12px', border: '1px solid #e8e8e8' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#d4af37' }}>
                <QrcodeOutlined />
              </div>
              <Button 
                type="primary" 
                style={{ background: '#1890ff', borderColor: '#1890ff', width: '100%' }}
              >
                Barcodes
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ border: 'none', boxShadow: 'none' }}>
        <Tabs 
          defaultActiveKey="items"
          items={[
            {
              key: 'items',
              label: 'Items',
            },
            {
              key: 'groups',
              label: 'Item Groups (Variants)',
            },
            {
              key: 'pricelist',
              label: 'Price List',
            },
          ]}
        />
        <div style={{ marginBottom: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Input.Search
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  applyFilters(e.target.value, categoryFilter, statusFilter);
                }}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Filter by Category"
                value={categoryFilter}
                onChange={(value) => {
                  setCategoryFilter(value);
                  applyFilters(searchText, value, statusFilter);
                }}
                style={{ width: '100%' }}
              >
                <Select.Option value="all">All Categories</Select.Option>
                {Array.from(new Set(inventory.map(item => item.category))).map(cat => (
                  <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  applyFilters(searchText, categoryFilter, value);
                }}
                style={{ width: '100%' }}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="normal">In Stock</Select.Option>
                <Select.Option value="low">Low Stock</Select.Option>
                <Select.Option value="out">Out of Stock</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
        <Table
          columns={columns}
          dataSource={filteredInventory}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100'],
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 600, y: 400 }}
        />
      </Card>

      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EditOutlined style={{ color: '#d4af37' }} />
          Update Stock Level
        </div>}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update Stock"
        okButtonProps={{ 
          style: { background: '#d4af37', borderColor: '#d4af37' },
          icon: <CheckCircleOutlined />
        }}
        width={600}
      >
        {editingItem && (
          <div>
            <Card 
              style={{ 
                marginBottom: '20px', 
                background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                border: '1px solid #d4af37'
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Product Name:</strong>
                    <p style={{ margin: '4px 0', fontSize: '16px' }}>{editingItem.name}</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Category:</strong>
                    <p style={{ margin: '4px 0' }}>{editingItem.category}</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Current Price:</strong>
                    <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: 'bold' }}>PKR {editingItem.price}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Current Stock:</strong>
                    <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: 'bold', color: editingItem.currentStock < editingItem.minStock ? '#ff4d4f' : '#52c41a' }}>
                      {editingItem.currentStock} units
                    </p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Min Stock Level:</strong>
                    <p style={{ margin: '4px 0' }}>{editingItem.minStock} units</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#d4af37' }}>Max Stock Level:</strong>
                    <p style={{ margin: '4px 0' }}>{editingItem.maxStock} units</p>
                  </div>
                </Col>
              </Row>
              
              <div style={{ marginTop: '16px', padding: '12px', background: '#fff', borderRadius: '6px' }}>
                <strong style={{ color: '#d4af37' }}>Current Status:</strong>
                <Tag 
                  color={getStatusColor(editingItem.status)} 
                  style={{ marginLeft: '8px', fontSize: '12px' }}
                >
                  {getStatusText(editingItem.status)}
                </Tag>
              </div>
            </Card>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateStock}
              initialValues={{ stock: editingItem.currentStock }}
            >
              <Form.Item
                name="stock"
                label={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#d4af37' }}>New Stock Level</span>}
                rules={[
                  { required: true, message: 'Please enter stock level' },
                  { type: 'number', min: 0, max: editingItem.maxStock, message: `Stock must be between 0 and ${editingItem.maxStock}` }
                ]}
              >
                <InputNumber
                  min={0}
                  max={editingItem.maxStock}
                  style={{ width: '100%', height: '40px', fontSize: '16px' }}
                  placeholder="Enter new stock level"
                  addonAfter="units"
                />
              </Form.Item>
              
              <Alert
                message="Stock Update Guidelines"
                description={
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Minimum recommended stock: {editingItem.minStock} units</li>
                    <li>Maximum capacity: {editingItem.maxStock} units</li>
                    <li>Current inventory value: PKR {editingItem.currentStock * editingItem.price}</li>
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
              />
            </Form>
          </div>
        )}
      </Modal>
    </AdminContainer>
  );
};

export default AdminInventory;
