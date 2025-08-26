import React, { useState } from 'react';
import { Card, Row, Col, Button, Switch, Typography, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const AdminContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const ChannelCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const ChannelLogo = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const SyncItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
`;

const AdminSalesChannels: React.FC = () => {
  const channels = [
    {
      name: 'AliExpress',
      logo: 'AliExpress',
      color: '#ff6a00',
      priceSync: true,
      inventorySync: true
    },
    {
      name: 'eBay',
      logo: 'eBay',
      color: '#0064d2',
      priceSync: true,
      inventorySync: true
    },
    {
      name: 'Walmart',
      logo: 'Walmart',
      color: '#004c91',
      priceSync: false,
      inventorySync: true
    },
    {
      name: 'Wayfair',
      logo: 'wayfair',
      color: '#7b2cbf',
      priceSync: true,
      inventorySync: true
    },
    {
      name: 'Rakuten',
      logo: 'Rakuten',
      color: '#bf0000',
      priceSync: true,
      inventorySync: true
    },
    {
      name: 'Etsy',
      logo: 'Etsy',
      color: '#f56500',
      priceSync: false,
      inventorySync: true
    }
  ];

  return (
    <AdminContainer>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Sales Channels</Title>
      </div>

      <Row gutter={[24, 24]}>
        {channels.map((channel, index) => (
          <Col xs={24} md={8} key={index}>
            <ChannelCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <Text strong>{channel.name}</Text>
                <Dropdown
                  menu={{
                    items: [
                      { key: 'settings', label: 'Settings' },
                      { key: 'disconnect', label: 'Disconnect' }
                    ]
                  }}
                  trigger={['click']}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>

              <ChannelLogo style={{ color: channel.color }}>
                {channel.logo}
              </ChannelLogo>

              <div style={{ marginBottom: '16px' }}>
                <Button type="link" style={{ padding: 0, marginRight: '16px' }}>
                  Import Product
                </Button>
                <Button type="link" style={{ padding: 0 }}>
                  Sync Category
                </Button>
              </div>

              <SyncItem>
                <Text>Price</Text>
                <Switch 
                  checked={channel.priceSync} 
                  size="small"
                  style={{ backgroundColor: channel.priceSync ? '#52c41a' : '#d9d9d9' }}
                />
              </SyncItem>

              <SyncItem>
                <Text>Inventory</Text>
                <Switch 
                  checked={channel.inventorySync} 
                  size="small"
                  style={{ backgroundColor: channel.inventorySync ? '#52c41a' : '#d9d9d9' }}
                />
              </SyncItem>
            </ChannelCard>
          </Col>
        ))}
      </Row>
    </AdminContainer>
  );
};

export default AdminSalesChannels;