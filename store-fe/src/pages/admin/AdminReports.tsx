import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Typography } from 'antd';
import { BarChartOutlined, DollarOutlined, ShoppingOutlined, UserOutlined, StarOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminAPI } from '../../services/api';
import styled from 'styled-components';

const { Title } = Typography;

const AdminContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const StatsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  text-align: center;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const StatsIcon = styled.div<{ bgColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  color: white;
`;

const StatsValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const StatsLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const orders = await adminAPI.getAllOrders();
      setReportData(orders);
    } catch (error) {
      console.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const totalSales = reportData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalCost = totalSales * 0.9; // Assuming 90% cost ratio
  const productsSold = reportData.reduce((sum, order) => sum + (order.items?.length || 1), 0);
  const stockValue = totalSales * 3.1; // Estimated stock value

  const columns = [
    {
      title: 'Order#',
      dataIndex: 'order_number',
      key: 'orderNumber',
      width: 100,
      render: (orderNumber: string) => (
        <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>
      ),
    },
    {
      title: 'Product Name',
      key: 'productName',
      width: 200,
      render: (_: any, record: any) => (
        <span>{record.items?.[0]?.product?.name || 'Multiple Items'}</span>
      ),
    },
    {
      title: 'Total QTY',
      key: 'totalQty',
      width: 100,
      render: (_: any, record: any) => (
        <span>{record.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 1}</span>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'created_at',
      key: 'orderDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap = {
          'delivered': { text: 'Done', color: 'green' },
          'shipped': { text: 'Work in progress', color: 'blue' },
          'processing': { text: 'Work in progress', color: 'blue' },
          'pending': { text: 'Not started', color: 'orange' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Price',
      dataIndex: 'total_amount',
      key: 'price',
      width: 100,
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>PKR {amount || 0}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<StarOutlined />} style={{ color: '#faad14' }} />
          <Button type="text" size="small" icon={<CopyOutlined />} style={{ color: '#1890ff' }} />
          <Button type="text" size="small" icon={<DeleteOutlined />} style={{ color: '#ff4d4f' }} />
        </Space>
      ),
    },
  ];

  return (
    <AdminContainer>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Reports</Title>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={6}>
          <StatsCard>
            <StatsIcon bgColor="#1890ff">
              <BarChartOutlined />
            </StatsIcon>
            <StatsValue>PKR {totalSales.toLocaleString()}</StatsValue>
            <StatsLabel>Total Sales</StatsLabel>
          </StatsCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard>
            <StatsIcon bgColor="#ff4d4f">
              <DollarOutlined />
            </StatsIcon>
            <StatsValue>PKR {totalCost.toLocaleString()}</StatsValue>
            <StatsLabel>Total Cost</StatsLabel>
          </StatsCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard>
            <StatsIcon bgColor="#722ed1">
              <ShoppingOutlined />
            </StatsIcon>
            <StatsValue>{productsSold}</StatsValue>
            <StatsLabel>Products Sold</StatsLabel>
          </StatsCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard>
            <StatsIcon bgColor="#fa8c16">
              <UserOutlined />
            </StatsIcon>
            <StatsValue>PKR {stockValue.toLocaleString()}</StatsValue>
            <StatsLabel>Stock on Hand</StatsLabel>
          </StatsCard>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button>Copy</Button>
          <Button>CSV</Button>
          <Button>Excel</Button>
          <Button>PDF</Button>
          <Button>Print</Button>
        </div>

        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="id"
          loading={loading}
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            simple: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </AdminContainer>
  );
};

export default AdminReports;